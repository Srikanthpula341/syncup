import * as admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    // If we have service account info, use it. 
    // Otherwise, it might fall back to application default credentials in environments like Vercel.
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin Initialized with Service Account');
    } else {
      // Light initialization (works in some CI/CD or with application default credentials)
      admin.initializeApp();
      console.log('Firebase Admin Initialized with Default Credentials');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Firebase Admin init error', error.stack);
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
