import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { userId, notificationId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notificationsRef = adminDb.collection(`users/${userId}/notifications`);

    if (action === 'READ_ALL') {
      const snapshot = await notificationsRef.where('isRead', '==', false).get();
      const batch = adminDb.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();
      return NextResponse.json({ success: true, count: snapshot.size });
    }

    if (!notificationId) {
       return NextResponse.json({ error: 'Notification ID required for this action' }, { status: 400 });
    }

    const docRef = notificationsRef.doc(notificationId);

    if (action === 'MARK_READ') {
      await docRef.update({ isRead: true });
    } else if (action === 'DELETE') {
      await docRef.delete();
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Notification Manage API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
