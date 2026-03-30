import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { content, userId, userName, userAvatar, workspaceId, channelId } = await req.json();

    if (!content || !userId || !workspaceId || !channelId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isDM = channelId.startsWith('dm-');
    
    // Determine the message path
    const messagePath = isDM
      ? `dms/${channelId}/messages`
      : `workspaces/${workspaceId}/channels/${channelId}/messages`;

    const messageData = {
      userId,
      userName,
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      content: content.trim(),
      timestamp: FieldValue.serverTimestamp(),
      status: 'sent',
    };

    // Save message to Firestore
    const messageRef = await adminDb.collection(messagePath).add(messageData);

    // Activity Log
    await adminDb.collection('activities').add({
      workspaceId,
      type: 'MESSAGE_SENT',
      userId,
      entityId: channelId,
      metadata: {
        channelName: isDM ? 'Direct Message' : 'Channel', // We could fetch actual name if needed
        preview: content.trim().substring(0, 50),
      },
      createdAt: FieldValue.serverTimestamp(),
    });

    // Handle Unread Counts for DMs
    if (isDM) {
      const recipientUid = channelId.replace('dm-', '').split('_').find((id: string) => id !== userId);
      if (recipientUid) {
        await adminDb.doc(`unread_counts/${recipientUid}`).set({
          [channelId]: FieldValue.increment(1)
        }, { merge: true });
      }
    }

    // Ping the user's lastSeen
    await adminDb.doc(`users/${userId}`).update({
      lastSeen: FieldValue.serverTimestamp()
    }).catch(() => {});

    return NextResponse.json({ id: messageRef.id, success: true });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
