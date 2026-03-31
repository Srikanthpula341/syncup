import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { workspaceId, userId, name, avatar } = await req.json();

    if (!workspaceId || !userId) {
      return NextResponse.json({ error: 'Missing required IDs' }, { status: 400 });
    }

    const workspaceRef = adminDb.doc(`workspaces/${workspaceId}`);
    const workspaceDoc = await workspaceRef.get();

    if (!workspaceDoc.exists) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const workspaceData = workspaceDoc.data();

    // Security Check: Only the workspace owner can make administrative changes
    // If ownerId isn't set, we fall back to a permissive model for initial setup,
    // but ideally we check workspaceData.ownerId === userId.
    if (workspaceData?.ownerId && workspaceData.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized administrative action' }, { status: 403 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    if (Object.keys(updateData).length > 0) {
      await workspaceRef.update(updateData);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Workspace Update Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
