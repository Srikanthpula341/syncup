'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { formatDistanceToNow } from 'date-fns';

export interface UserStatus {
  isOnline: boolean;
  lastSeen: number | null;
  statusText: string;
}

export const useUserStatus = (uid: string | undefined): UserStatus => {
  const { users } = useAppSelector((state) => state.chat);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Check local time every 10 seconds for super-responsive UI updates
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);
  
  const user = users.find(u => u.uid === uid);
  const lastSeenSeconds = user?.lastSeen?.seconds || 0;
  const lastSeenMs = lastSeenSeconds * 1000 || null;

  // Online if active within the last 1 minute
  const isOnline = lastSeenMs ? (now - lastSeenMs) < 1000 * 60 * 1 : false;

  const getStatusText = () => {
    if (isOnline) return "Active now";
    if (!lastSeenMs) return "Offline";
    return `Last seen ${formatDistanceToNow(lastSeenMs, { addSuffix: true })}`;
  };

  return {
    isOnline,
    lastSeen: lastSeenMs,
    statusText: getStatusText(),
  };
};
