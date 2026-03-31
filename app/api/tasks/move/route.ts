import { NextResponse } from 'next/server';
import { adminDb, adminFirestore } from '@/app/lib/firebase-admin';
import { getAuthSession } from '@/app/lib/auth-util';
import { ACTIVITY_TYPES } from '@/app/lib/route-constants';

export async function PATCH(req: Request) {
  try {
    const { 
      taskId, 
      taskTitle,
      userId, 
      workspaceId,
      newColumnId, 
      oldColumnName, 
      newColumnName 
    } = await req.json();

    // Security: Verify authentication
    const authUid = await getAuthSession();
    if (!authUid || authUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Session invalid or spoofed' }, { status: 401 });
    }

    // Fetch task to get assignee for activity involvement
    const taskDoc = await adminDb.doc(`tasks/${taskId}`).get();
    const taskData = taskDoc.exists ? taskDoc.data() : null;
    const assigneeId = taskData?.assigneeId;

    // Update task in Firestore
    await adminDb.doc(`tasks/${taskId}`).update({
      columnId: newColumnId,
      updatedAt: adminFirestore.FieldValue.serverTimestamp(),
    });

    // Log activity for the timeline
    const involvedUserIds = [userId];
    if (assigneeId && assigneeId !== userId) {
      involvedUserIds.push(assigneeId);
    }

    await adminDb.collection('activities').add({
      workspaceId: workspaceId || 'unknown',
      type: ACTIVITY_TYPES.TASK_MOVED,
      userId,
      entityId: taskId,
      involvedUserIds, // Added for personalization
      metadata: {
        taskTitle: taskTitle || 'Unknown Task',
        from: oldColumnName || 'Unknown',
        to: newColumnName || 'Unknown',
      },
      createdAt: adminFirestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('API Error (Tasks Move):', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
