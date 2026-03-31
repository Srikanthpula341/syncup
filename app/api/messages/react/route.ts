import { NextResponse } from 'next/server';
import { adminDb, adminFirestore } from '@/app/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { messageId, emoji, userId, workspaceId, channelId, action } = await req.json();

    if (!messageId || !emoji || !userId || !channelId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isDM = channelId.startsWith('dm-');
    const messagePath = isDM
      ? `dms/${channelId}/messages/${messageId}`
      : `workspaces/${workspaceId}/channels/${channelId}/messages/${messageId}`;

    const messageRef = adminDb.doc(messagePath);
    const messageDoc = await messageRef.get();
    
    if (!messageDoc.exists) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const messageData = messageDoc.data();
    const messageAuthorId = messageData?.userId;

    if (action === 'ADD') {
      await messageRef.update({
        [`reactions.${emoji}`]: adminFirestore.FieldValue.arrayUnion(userId)
      });

      // Trigger notification if the reactor is not the author
      if (messageAuthorId && messageAuthorId !== userId) {
        const reactorName = messageData?.userName || 'Someone';
        await adminDb.collection(`users/${messageAuthorId}/notifications`).add({
          type: 'reaction',
          title: 'New Reaction',
          body: `${reactorName} reacted with ${emoji} to your message`,
          createdAt: adminFirestore.FieldValue.serverTimestamp(),
          isRead: false,
          channelId: channelId,
          workspaceId: workspaceId,
          messageId: messageId,
        });
      }
    } else if (action === 'REMOVE') {
      await messageRef.update({
        [`reactions.${emoji}`]: adminFirestore.FieldValue.arrayRemove(userId)
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Reaction API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
