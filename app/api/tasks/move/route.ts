import { NextResponse } from 'next/server';
import { adminDb, adminFirestore } from '@/app/lib/firebase-admin';

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

    if (!taskId || !userId || !newColumnId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update task in Firestore
    await adminDb.doc(`tasks/${taskId}`).update({
      columnId: newColumnId,
      updatedAt: adminFirestore.FieldValue.serverTimestamp(),
    });

    // Log activity for the timeline
    await adminDb.collection('activities').add({
      workspaceId: workspaceId || 'unknown',
      type: 'TASK_MOVED',
      userId,
      entityId: taskId,
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
