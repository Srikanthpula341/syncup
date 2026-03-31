'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { setActiveWorkspace, setActiveChannel } from '@/app/store/slices/uiSlice';

const STORAGE_KEY_PREFIX = 'syncup_session_';

export function usePersistence() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeWorkspaceId, activeChannelId } = useAppSelector((state) => state.ui);

  // Load state on mount (if authenticated)
  useEffect(() => {
    if (!user) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${user.uid}`;
    const savedSession = localStorage.getItem(storageKey);
    
    if (savedSession) {
      try {
        const { workspaceId, channelId } = JSON.parse(savedSession);
        
        // Only hydrate if the current state is still null
        if (workspaceId) dispatch(setActiveWorkspace(workspaceId));
        if (channelId) dispatch(setActiveChannel(channelId));
        
      } catch (err) {
        console.error('Failed to parse saved session:', err);
      }
    }
  }, [user, dispatch]);

  // Save state on changes
  useEffect(() => {
    if (!user || (!activeWorkspaceId && !activeChannelId)) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${user.uid}`;
    const sessionData = {
      workspaceId: activeWorkspaceId,
      channelId: activeChannelId
    };
    
    localStorage.setItem(storageKey, JSON.stringify(sessionData));
  }, [user, activeWorkspaceId, activeChannelId]);

  return null;
}
