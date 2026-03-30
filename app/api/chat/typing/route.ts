import { NextResponse } from 'next/server';
import { adminDb, adminFirestore } from '@/app/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { channelId, userId, userName } = await req.json();

    if (!channelId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await adminDb.doc(`typing_states/${channelId}`).set({
      [userId]: {
        name: userName || 'Someone',
        timestamp: adminFirestore.FieldValue.serverTimestamp(),
      }
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Typing API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { channelId, userId } = await req.json();

    if (!channelId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await adminDb.doc(`typing_states/${channelId}`).update({
      [userId]: adminFirestore.FieldValue.delete()
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Typing DELETE Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
