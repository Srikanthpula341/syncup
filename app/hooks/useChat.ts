'use client';

import { useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  limit, 
  serverTimestamp,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  increment
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
  setUnreadCounts
} from '@/app/store/slices/chatSlice';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { activeWorkspaceId, activeChannelId } = useAppSelector((state) => state.ui);
  const { workspaces, channels } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  // 0. Global User Sync
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users'), orderBy('displayName'), limit(100));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ 
          uid: doc.id, 
          ...doc.data() 
        })) as AppUser[];
        dispatch(setUsers(data));
      },
      (error) => {
        if (error.code === 'permission-denied' && !user) return;
        toast.error(`User sync error: ${error.message}`);
      }
    );
    return () => unsubscribe();
  }, [dispatch, user]);

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
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Workspace[];
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
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Channel[];
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

        // Read Receipts engine: Mark incoming messages as read
        snapshot.docs.forEach((document) => {
          const msg = document.data() as Message;
          if (msg.userId !== user.uid && msg.status !== 'read') {
            updateDoc(document.ref, { status: 'read' }).catch(() => {});
          }
        });
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
  }, [activeWorkspaceId, activeChannelId, dispatch, user]);

  // 4. Seperate Auto-Selection Logic
  useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      dispatch(setActiveWorkspace(workspaces[0].id));
    }
  }, [workspaces, activeWorkspaceId, dispatch]);

  useEffect(() => {
    if (channels.length > 0 && !activeChannelId) {
      dispatch(setActiveChannel(channels[0].id));
    }
  }, [channels, activeChannelId, dispatch]);

  // Reset unread count when opening a channel
  useEffect(() => {
    if (!activeChannelId || !user) return;
    setDoc(doc(db, 'unread_counts', user.uid), {
      [activeChannelId]: 0
    }, { merge: true }).catch(() => {});
  }, [activeChannelId, user]);

  const sendMessage = async (content: string) => {
    if (!user || !activeChannelId || !content.trim()) return;

    const messageData = {
      userId: user.uid,
      userName: user.displayName || user.email,
      userAvatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
      content: content.trim(),
      timestamp: serverTimestamp(),
      status: 'sent',
    };

    try {
      const isDM = activeChannelId.startsWith('dm-');
      const messagesCollection = isDM
        ? collection(db, 'dms', activeChannelId, 'messages')
        : activeWorkspaceId 
           ? collection(db, 'workspaces', activeWorkspaceId, 'channels', activeChannelId, 'messages')
           : null;

      if (!messagesCollection) {
        toast.error("No active conversation found.");
        return;
      }

      await addDoc(messagesCollection, messageData);
      
      // Ping the user's activity to keep them "Online" locally
      updateDoc(doc(db, 'users', user.uid), {
        lastSeen: serverTimestamp()
      }).catch(() => {});
      
      // Increment target unread count for DMs
      if (isDM) {
        const recipientUid = activeChannelId.replace('dm-', '').split('_').find(id => id !== user.uid);
        if (recipientUid) {
          setDoc(doc(db, 'unread_counts', recipientUid), {
            [activeChannelId]: increment(1)
          }, { merge: true }).catch(() => {});
        }
      }

      // Removed the redundant "Message sent!" toast for a smoother, premium chat experience
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to send: ${errorMessage}`);
    }
  };

  return { sendMessage };
};
