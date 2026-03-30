'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/app/store/hooks';

export const useHeartbeat = () => {
  const { user } = useAppSelector((state) => state.auth);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const sendHeartbeat = async () => {
      // Avoid sending if tab is hidden to save resources
      if (document.visibilityState !== 'visible') return;

      try {
        await fetch('/api/presence/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid }),
        });
      } catch (error) {
        // Silently fail as heartbeats are low priority
        console.warn('Heartbeat failed', error);
      }
    };

    // Send immediately on mount
    sendHeartbeat();

    // Set up periodic heartbeat (every 50 seconds)
    // Firestore consider users offline if no update for 1 minute
    intervalRef.current = setInterval(sendHeartbeat, 50000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user?.uid]);
};
