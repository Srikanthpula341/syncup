'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setAuthUser, setAuthLoading } from '@/app/store/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { useChat } from '@/app/hooks/useChat';

export default function AuthListener() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useAppSelector((state) => state.auth);

  // Initialize global chat/user sync
  useChat();

  useEffect(() => {
    dispatch(setAuthLoading());
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        dispatch(setAuthUser(userData));

        // Sync to Firestore Users Collection
        try {
          await setDoc(doc(db, 'users', user.uid), {
            ...userData,
            lastSeen: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (error) {
          console.error("Error syncing user to Firestore:", error);
        }
      } else {
        dispatch(setAuthUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Global Routing Logic
  useEffect(() => {
    if (status === 'loading') return;

    const isAuthPage = pathname === '/auth';
    const isRootPage = pathname === '/';

    // if (status === 'unauthenticated' && !isAuthPage) {
    //   router.push('/auth');
    // } else if (status === 'authenticated' && (isAuthPage || isRootPage)) {
    //   router.push('/dashboard');
    // }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return null;
}
