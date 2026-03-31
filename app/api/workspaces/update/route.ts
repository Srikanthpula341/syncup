import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

interface UpdateWorkspaceRequest {
  workspaceId: string;
  userId: string;
  name?: string;
  icon?: string;
}

export async function POST(req: Request) {
  try {
    const { workspaceId, userId, name, icon }: UpdateWorkspaceRequest = await req.json();

    if (!workspaceId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;
    if (icon) updateData.icon = icon;

    if (Object.keys(updateData).length > 0) {
      await workspaceRef.update(updateData);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Workspace Update Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
