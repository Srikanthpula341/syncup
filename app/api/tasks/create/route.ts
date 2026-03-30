import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { 
      workspaceId, 
      columnId, 
      title, 
      description, 
      assigneeId, 
      priority, 
      dueDate, 
      creatorId 
    } = await req.json();

    if (!workspaceId || !columnId || !title || !creatorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const taskData = {
      workspaceId,
      columnId,
      title: title.trim(),
      description: description?.trim() || '',
      assigneeId: assigneeId || null,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      creatorId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Save task to Firestore
    const taskRef = await adminDb.collection('tasks').add(taskData);

    // Log activity for the timeline
    await adminDb.collection('activities').add({
      workspaceId,
      type: 'TASK_CREATED',
      userId: creatorId,
      entityId: taskRef.id,
      metadata: {
        taskTitle: title.trim(),
        columnId,
      },
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: taskRef.id, success: true });
  } catch (error: unknown) {
    console.error('API Error (Tasks Create):', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
