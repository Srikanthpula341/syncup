import * as admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      // Use service account credentials if available
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin Initialized with Service Account');
    } else if (projectId) {
      // Initialize with Project ID as fallback for local dev or default credentials
      admin.initializeApp({ projectId });
      console.log(`Firebase Admin Initialized with Project ID: ${projectId}`);
    } else {
      // Last resort attempt
      admin.initializeApp();
      console.log('Firebase Admin Initialized with Default (no explicit ID)');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Firebase Admin init error', error.stack);
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore;
