import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { channelId, userId, workspaceId } = await req.json();

    if (!channelId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const batch = adminDb.batch();

    // 1. Reset Unread Count for this user/channel
    const unreadRef = adminDb.doc(`unread_counts/${userId}`);
    batch.set(unreadRef, { [channelId]: 0 }, { merge: true });

    // 2. Mark recent messages as read (Optional but recommended for consistency)
    // In a real high-scale app, you'd only mark the last message or use a 'lastReadAt' pointer.
    // For SyncUp, we'll iterate and update 'sent'/'delivered' messages to 'read'.
    const isDM = channelId.startsWith('dm-');
    const messagesPath = isDM
      ? `dms/${channelId}/messages`
      : `workspaces/${workspaceId}/channels/${channelId}/messages`;

    const snapshot = await adminDb.collection(messagesPath)
      .where('status', '!=', 'read')
      .limit(50)
      .get();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      // Only mark as read if it's NOT our own message
      if (data.userId !== userId) {
        batch.update(doc.ref, { status: 'read' });
      }
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Mark Read API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
