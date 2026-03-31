import { NextResponse } from 'next/server';
import { adminDb, adminFirestore } from '@/app/lib/firebase-admin';
import { getAuthSession } from '@/app/lib/auth-util';

export async function POST(req: Request) {
  try {
    const { content, attachments = [], userId, userName, userAvatar, workspaceId, channelId } = await req.json();

    if ((!content && attachments.length === 0) || !userId || !workspaceId || !channelId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Security: Verify authentication
    const authUid = await getAuthSession();
    if (!authUid || authUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Session invalid or spoofed' }, { status: 401 });
    }

    const isDM = channelId.startsWith('dm-');
    
    // Determine the message path
    const messagePath = isDM
      ? `dms/${channelId}/messages`
      : `workspaces/${workspaceId}/channels/${channelId}/messages`;

    // Preview generation
    let preview = content.trim().substring(0, 100);
    if (!preview && attachments.length > 0) {
      preview = `📎 Sent ${attachments.length} file(s)`;
    }

    const messageData = {
      userId,
      userName,
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      content: content.trim(),
      attachments,
      timestamp: adminFirestore.FieldValue.serverTimestamp(),
      status: 'sent',
    };

    // Save message to Firestore
    const messageRef = await adminDb.collection(messagePath).add(messageData);

    // Update the parent (Channel or DM) with the last message time for sorting
    const parentPath = isDM ? `dms/${channelId}` : `workspaces/${workspaceId}/channels/${channelId}`;
    await adminDb.doc(parentPath).set({
      lastMessageAt: adminFirestore.FieldValue.serverTimestamp(),
      lastMessagePreview: preview,
    }, { merge: true });

    // Activity Log
    await adminDb.collection('activities').add({
      workspaceId,
      type: 'MESSAGE_SENT',
      userId,
      entityId: channelId,
      metadata: {
        channelName: isDM ? 'Direct Message' : 'Channel', 
        preview: preview,
      },
      createdAt: adminFirestore.FieldValue.serverTimestamp(),
    });

    // Update Unread Counts & Activity Timestamps for Sorting
    const now = adminFirestore.FieldValue.serverTimestamp();
    const batch = adminDb.batch();

    // 1. Update Sender's activity (to reorder their list)
    batch.set(adminDb.doc(`unread_counts/${userId}`), {
      [`${channelId}_lastAt`]: now,
      [`${channelId}_lastPreview`]: preview,
    }, { merge: true });

    // 2. Update Recipient's unread count and activity (for DMs)
    if (isDM) {
      const recipientUid = channelId.replace('dm-', '').split('_').find((id: string) => id !== userId);
      if (recipientUid) {
        batch.set(adminDb.doc(`unread_counts/${recipientUid}`), {
          [channelId]: adminFirestore.FieldValue.increment(1),
          [`${channelId}_lastAt`]: now,
          [`${channelId}_lastPreview`]: preview,
        }, { merge: true });
      }
    }

    await batch.commit();

    // Ping the user's lastSeen
    await adminDb.doc(`users/${userId}`).update({
      lastSeen: adminFirestore.FieldValue.serverTimestamp()
    }).catch(() => {});

    // --- Phase 9: Real-Time Notifications ---
    try {
      const usersSnapshot = await adminDb.collection('users').get();
      const allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const notificationsBatch = adminDb.batch();
      const now = adminFirestore.FieldValue.serverTimestamp();

      if (isDM) {
        // Notify the recipient in a DM
        const recipientUid = channelId.replace('dm-', '').split('_').find((id: string) => id !== userId);
        if (recipientUid) {
          const notifRef = adminDb.collection(`users/${recipientUid}/notifications`).doc();
          notificationsBatch.set(notifRef, {
            type: 'message',
            title: `New DM from ${userName}`,
            body: preview,
            senderName: userName,
            senderAvatar: userAvatar,
            channelId,
            workspaceId,
            isRead: false,
            createdAt: now
          });
        }
      } else {
        // Notify for Channel Messages (+ Mentions)
        const mentions = content.match(/@(\w+)/g) || [];
        const mentionedNames = mentions.map((m: string) => m.substring(1).toLowerCase());

        allUsers.forEach((u: { id: string, displayName?: string, email?: string }) => {
          if (u.id === userId) return; // Don't notify sender

          const isMentioned = mentionedNames.some((name: string) => 
            u.displayName?.toLowerCase().includes(name) || 
            u.email?.toLowerCase().includes(name)
          );

          const notifRef = adminDb.collection(`users/${u.id}/notifications`).doc();
          notificationsBatch.set(notifRef, {
            type: isMentioned ? 'mention' : 'message',
            title: isMentioned ? `You were mentioned in #${channelId}` : `New message in #${channelId}`,
            body: preview,
            senderName: userName,
            senderAvatar: userAvatar,
            channelId,
            workspaceId,
            isRead: false,
            createdAt: now
          });
        });
      }

      await notificationsBatch.commit();
    } catch (notifError) {
      console.error('Notification trigger error:', notifError);
      // Don't fail the message send if notifications fail
    }

    return NextResponse.json({ id: messageRef.id, success: true });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
