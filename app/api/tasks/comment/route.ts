import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { 
      taskId, 
      userId, 
      userName, 
      userAvatar, 
      text, 
      workspaceId 
    } = await req.json();

    if (!taskId || !userId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const commentData = {
      userId,
      userName,
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      text: text.trim(),
      createdAt: FieldValue.serverTimestamp(),
    };

    // Save comment to Firestore
    const commentRef = await adminDb.collection(`tasks/${taskId}/comments`).add(commentData);

    // Activity Log
    await adminDb.collection('activities').add({
      workspaceId: workspaceId || 'unknown',
      type: 'TASK_COMMENTED',
      userId,
      entityId: taskId,
      metadata: {
        commentId: commentRef.id,
        preview: text.trim().substring(0, 50),
      },
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: commentRef.id, success: true });
  } catch (error: unknown) {
    console.error('API Error (Tasks Comment):', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
