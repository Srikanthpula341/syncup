import { adminAuth } from './firebase-admin';
import { headers } from 'next/headers';

/**
 * Verifies the Firebase ID Token from the Authorization header.
 * @returns The verified user ID (uid) or null if invalid.
 */
export async function getAuthSession() {
  const headerList = await headers();
  const authHeader = headerList.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

/**
 * Checks if the current request is authorized for a specific resource owner.
 * @param ownerId The ID of the resource owner (e.g., creatorId).
 * @returns Boolean indicating authorization status.
 */
export async function isAuthorized(ownerId: string) {
  const sessionUid = await getAuthSession();
  if (!sessionUid) return false;
  return sessionUid === ownerId;
}
