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

export interface Activity {
  id: string;
  workspaceId: string;
  type: 'MESSAGE_SENT' | 'TASK_CREATED' | 'TASK_MOVED' | 'TASK_COMMENTED' | 'THREAD_REPLY_SENT' | 'WORKSPACE_CREATED';
  userId: string;
  entityId: string;
  metadata: any;
  createdAt: any;
}

export const useActivities = (workspaceId: string | null) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'activities'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const activityData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toMillis() || Date.now()
        })) as Activity[];
        setActivities(activityData);
        setLoading(false);
      },
      (error) => {
        console.error("Activity sync error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workspaceId]);

  return { activities, loading };
};
