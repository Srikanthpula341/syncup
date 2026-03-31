import { NextResponse } from 'next/server';
import { adminDb, adminFirestore } from '@/app/lib/firebase-admin';
import { getAuthSession } from '@/app/lib/auth-util';
import { ACTIVITY_TYPES } from '@/app/lib/route-constants';

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

    // Security: Verify authentication
    const authUid = await getAuthSession();
    if (!authUid || authUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Session invalid or spoofed' }, { status: 401 });
    }

    const commentData = {
      userId,
      userName,
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      text: text.trim(),
      createdAt: adminFirestore.FieldValue.serverTimestamp(),
    };

    // Fetch task to get involved users
    const taskDoc = await adminDb.doc(`tasks/${taskId}`).get();
    const taskData = taskDoc.exists ? taskDoc.data() : null;
    const taskCreatorId = taskData?.creatorId as string | undefined;
    const taskAssigneeId = taskData?.assigneeId as string | undefined;

    // Save comment to Firestore
    const commentRef = await adminDb.collection(`tasks/${taskId}/comments`).add(commentData);

    // Activity Log
    const involvedUserIds = [userId];
    if (taskCreatorId && taskCreatorId !== userId) involvedUserIds.push(taskCreatorId);
    if (taskAssigneeId && taskAssigneeId !== userId && taskAssigneeId !== taskCreatorId) {
      involvedUserIds.push(taskAssigneeId);
    }

    await adminDb.collection('activities').add({
      workspaceId: workspaceId || 'unknown',
      type: ACTIVITY_TYPES.TASK_COMMENTED,
      userId,
      entityId: taskId,
      involvedUserIds, // Added for personalization
      metadata: {
        commentId: commentRef.id,
        preview: text.trim().substring(0, 50),
      },
      createdAt: adminFirestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: commentRef.id, success: true });
  } catch (error: unknown) {
    console.error('API Error (Tasks Comment):', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
