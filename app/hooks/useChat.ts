'use client';

import { useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  limit, 
  doc,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setActiveWorkspace, setActiveChannel } from '@/app/store/slices/uiSlice';
import toast from 'react-hot-toast';
import { 
  setWorkspaces, 
  setChannels, 
  setMessages, 
  setMessagesLoading,
  setUsers,
  Workspace,
  Channel,
  Message,
  AppUser,
  Attachment,
  setUnreadCounts
} from '@/app/store/slices/chatSlice';
import { api } from '@/app/lib/api-client';
import { debounce } from '@/app/lib/api-utils';
import { API_CONFIG } from '@/app/lib/api-constants';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { activeWorkspaceId, activeChannelId } = useAppSelector((state) => state.ui);
  const { workspaces, channels } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  
  const debouncedMarkRead = useMemo(() => 
    debounce(api.messages.markRead, API_CONFIG.MARK_READ_DEBOUNCE),
    []
  );

  // 0. Workspace Member Sync (Isolation)
  useEffect(() => {
    if (!user || !activeWorkspaceId) return;
    
    // Sync members of the active workspace
    const q = query(collection(db, 'workspaces', activeWorkspaceId, 'members'), orderBy('displayName'), limit(50));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ 
          uid: doc.id, 
          ...doc.data() 
        })) as AppUser[];
        
        // If the workspace is new or members collection is empty, 
        // we might not see anyone. The API should ideally populate this.
        dispatch(setUsers(data));
      },
      (error) => {
        if (error.code === 'permission-denied' && !user) return;
        console.error("Member sync error:", error);
      }
    );
    return () => unsubscribe();
  }, [dispatch, user, activeWorkspaceId]);

  // 0.5. Unread Counts Sync
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'unread_counts', user.uid), 
      (docSnap) => {
        if (docSnap.exists()) {
          dispatch(setUnreadCounts(docSnap.data() as Record<string, number>));
        } else {
          dispatch(setUnreadCounts({}));
        }
      },
      (error) => {
        if (error.code === 'permission-denied' && !user) return;
        console.error("Unread counts sync error", error);
      }
    );
    return () => unsubscribe();
  }, [dispatch, user]);

  // 1. Stable Workspace Sync
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'workspaces'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          ownerId: doc.data().ownerId || '' 
        })) as Workspace[];
        dispatch(setWorkspaces(data));
      },
      (error) => {
        if (error.code === 'permission-denied' && !user) return;
        toast.error(`Workspace sync error: ${error.message}`);
      }
    );
    return () => unsubscribe();
  }, [dispatch, user]);

  // 2. Stable Channel Sync (Only re-runs if workspace changes)
  useEffect(() => {
    if (!activeWorkspaceId || !user) return;
    const q = query(collection(db, 'workspaces', activeWorkspaceId, 'channels'), orderBy('name'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return { 
            id: doc.id, 
            ...d, 
            lastMessageAt: d.lastMessageAt?.toMillis() || 0 
          } as Channel;
        });
        dispatch(setChannels(data));
      },
      (error) => {
        if (error.code === 'permission-denied' && !user) return;
        toast.error(`Channel sync error: ${error.message}`);
      }
    );
    return () => unsubscribe();
  }, [activeWorkspaceId, dispatch, user]);

  // 3. Stable Message Sync (Dynamic Routing for DMs)
  useEffect(() => {
    if (!activeChannelId || !user) return;
    
    dispatch(setMessagesLoading(true));
    
    // Determine the correct message path
    const isDM = activeChannelId.startsWith('dm-');
    const messagesCollection = isDM
      ? collection(db, 'dms', activeChannelId, 'messages')
      : activeWorkspaceId 
        ? collection(db, 'workspaces', activeWorkspaceId, 'channels', activeChannelId, 'messages')
        : null;

    if (!messagesCollection) return;

    const q = query(
      messagesCollection,
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toMillis() || Date.now(),
        })) as Message[];
        dispatch(setMessages(data));

        // Read Receipts engine: Trigger API if unread messages exist
        const hasUnread = snapshot.docs.some(d => {
          const m = d.data() as Message;
          return m.userId !== user.uid && m.status !== 'read';
        });

        if (hasUnread) {
          debouncedMarkRead({ 
            channelId: activeChannelId, 
            userId: user.uid,
            workspaceId: activeWorkspaceId 
          });
        }
      },
      (error) => {
        if (error.code === 'permission-denied' && !user) {
          dispatch(setMessagesLoading(false));
          return;
        }
        console.error("Message sync error:", error);
        toast.error(`Message sync error: ${error.message}`);
        dispatch(setMessagesLoading(false));
      }
    );
    return () => unsubscribe();
  }, [activeWorkspaceId, activeChannelId, dispatch, user, debouncedMarkRead]);

  // 4. Seperate Auto-Selection Logic
  useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      dispatch(setActiveWorkspace(workspaces[0].id));
    }
  }, [workspaces, activeWorkspaceId, dispatch]);

  useEffect(() => {
    // Only auto-select on desktop (lg: 1024px)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    if (channels.length > 0 && !activeChannelId) {
      dispatch(setActiveChannel(channels[0].id));
    }
  }, [channels, activeChannelId, dispatch]);

  // Reset unread count when opening a channel
  useEffect(() => {
    if (!activeChannelId || !user) return;
    debouncedMarkRead({ 
      channelId: activeChannelId, 
      userId: user.uid,
      workspaceId: activeWorkspaceId 
    });
  }, [activeChannelId, user, activeWorkspaceId, debouncedMarkRead]);

  const sendMessage = async (content: string, attachments: Attachment[] = []) => {
    if (!user || !activeChannelId || (!content.trim() && attachments.length === 0)) return;

    try {
      await api.messages.send({
        content: content.trim(),
        attachments,
        userId: user.uid,
        userName: user.displayName || user.email || '',
        userAvatar: user.photoURL || '',
        workspaceId: activeWorkspaceId,
        channelId: activeChannelId,
      });
      
      // The API handles activity logging, unread counts, and lastSeen updates.
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to send: ${errorMessage}`);
    }
  };

  const toggleReaction = async (messageId: string, emoji: string, currentReactions: Record<string, string[]> = {}) => {
    if (!user || !activeChannelId) return;

    const hasReacted = currentReactions[emoji]?.includes(user.uid);
    const action = hasReacted ? 'REMOVE' : 'ADD';

    try {
      await api.messages.react({
        messageId,
        emoji,
        userId: user.uid,
        workspaceId: activeWorkspaceId,
        channelId: activeChannelId,
        action
      });
    } catch (error: unknown) {
      console.error('Reaction error', error);
      toast.error('Failed to update reaction');
    }
  };

  return { sendMessage, toggleReaction };
};
