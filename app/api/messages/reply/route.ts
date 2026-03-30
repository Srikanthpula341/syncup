import { NextResponse } from 'next/server';
import { adminDb, adminFirestore } from '@/app/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { 
      content, 
      userId, 
      userName, 
      userAvatar, 
      workspaceId, 
      channelId, 
      parentMessageId 
    } = await req.json();

    if (!content || !userId || !channelId || !parentMessageId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isDM = channelId.startsWith('dm-');
    
    // Determine the base and parent path
    const parentPath = isDM
      ? `dms/${channelId}/messages/${parentMessageId}`
      : `workspaces/${workspaceId}/channels/${channelId}/messages/${parentMessageId}`;

    const replyData = {
      userId,
      userName,
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      content: content.trim(),
      timestamp: adminFirestore.FieldValue.serverTimestamp(),
      status: 'sent',
    };

    const parentRef = adminDb.doc(parentPath);

    // Write reply to sub-collection and increment count atomically
    const replyRef = await parentRef.collection('replies').add(replyData);
    
    await parentRef.update({
      replyCount: adminFirestore.FieldValue.increment(1),
      lastReplyAt: adminFirestore.FieldValue.serverTimestamp()
    });

    // Activity Log
    await adminDb.collection('activities').add({
      workspaceId: workspaceId || 'unknown',
      type: 'THREAD_REPLY_SENT',
      userId,
      entityId: parentMessageId,
      metadata: {
        channelId,
        replyPreview: content.trim().substring(0, 50),
      },
      createdAt: adminFirestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: replyRef.id, success: true });
  } catch (error: unknown) {
    console.error('API Error (Reply):', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
