'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setAuthUser, setAuthLoading } from '@/app/store/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { useChat } from '@/app/hooks/useChat';
import { ROUTES, PROTECTED_ROUTES } from '@/app/lib/route-constants';

export default function AuthListener() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useAppSelector((state) => state.auth);

  // Initialize global chat/user sync
  useChat();

  useEffect(() => {
    dispatch(setAuthLoading());
    
    let unsubscribeDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. Base User Data
        const baseUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        // 2. Sync to Firestore (Merge)
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          ...baseUserData,
          lastSeen: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // 3. Listen for Role & Metadata Updates
        if (unsubscribeDoc) unsubscribeDoc();
        unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const fullData = docSnap.data();
            dispatch(setAuthUser({
              ...baseUserData,
              role: fullData.role || null,
            }));
          } else {
            dispatch(setAuthUser(baseUserData));
          }
        }, (error) => {
          console.error("User doc sync error:", error);
          dispatch(setAuthUser(baseUserData));
        });

      } else {
        // Clean up and clear auth
        if (unsubscribeDoc) unsubscribeDoc();
        dispatch(setAuthUser(null));
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, [dispatch]);

  // Global Routing Logic
  useEffect(() => {
    if (status === 'loading') return;

    const isAuthPage = pathname === ROUTES.AUTH;
    
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (status === 'unauthenticated' && isProtectedRoute) {
        router.push(ROUTES.AUTH);
    } else if (status === 'authenticated' && isAuthPage) {
        router.push(ROUTES.CHAT);
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return null;
}
