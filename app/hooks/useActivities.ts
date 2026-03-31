'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useAppSelector } from '@/app/store/hooks';
import { ACTIVITY_TYPES } from '@/app/lib/route-constants';

export interface Activity {
  id: string;
  workspaceId: string;
  type: keyof typeof ACTIVITY_TYPES;
  userId: string;
  entityId: string;
  involvedUserIds?: string[];
  metadata: Record<string, string | number | boolean | null | undefined>;
  createdAt: number;
}

export const useActivities = (workspaceId: string | null) => {
  const { user } = useAppSelector((state) => state.auth);
  
  // Single state object to manage activities, loading, and the current workspace track
  const [state, setState] = useState({ 
    activities: [] as Activity[], 
    loading: !!workspaceId && !!user?.uid,
    lastWorkspaceId: workspaceId,
    lastUserId: user?.uid
  });

  // pattern: Adjusting state during render (recommended for resets)
  if (state.lastWorkspaceId !== workspaceId || state.lastUserId !== user?.uid) {
    setState({
      activities: [],
      loading: !!workspaceId && !!user?.uid,
      lastWorkspaceId: workspaceId,
      lastUserId: user?.uid
    });
  }

  useEffect(() => {
    if (!workspaceId || !user?.uid) return;

    // Use a flag to prevent setting state on unmounted component
    let isMounted = true;

    const q = query(
      collection(db, 'activities'),
      where('workspaceId', '==', workspaceId),
      where('involvedUserIds', 'array-contains', user.uid),
      orderBy('createdAt', 'desc'),
      limit(100) // Increased for better personalized history
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (!isMounted) return;
        const activityData = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: (data.createdAt as { toMillis: () => number })?.toMillis?.() || Date.now()
          };
        }) as Activity[];
        
        setState(prev => ({
          ...prev,
          activities: activityData,
          loading: false
        }));
      },
      (error) => {
        if (!isMounted) return;
        console.error("Activity sync error:", error);
        setState(prev => ({ ...prev, loading: false }));
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [workspaceId, user?.uid]);

  return { activities: state.activities, loading: state.loading };
};
