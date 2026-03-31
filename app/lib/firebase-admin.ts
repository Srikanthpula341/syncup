import * as admin from 'firebase-admin';

// Singleton guard — critical for serverless environments
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  try {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else if (projectId) {
      // Fallback for local dev with Application Default Credentials
      admin.initializeApp({ projectId });
    } else {
      admin.initializeApp();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Only log errors — not the successful initialization (avoids leaking project IDs in server logs)
      console.error('[Firebase Admin] Initialization failed:', error.message);
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore;
