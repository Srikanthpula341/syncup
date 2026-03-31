'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { Bell, Check, MessageSquare, AtSign, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { setActiveChannel } from '@/app/store/slices/uiSlice';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  limit, 
  Timestamp
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/app/lib/utils';
import toast from 'react-hot-toast';
import { api } from '@/app/lib/api-client';

interface Notification {
  id: string;
  type: 'mention' | 'message' | 'task_assigned' | 'reply';
  title: string;
  body: string;
  senderName: string;
  senderAvatar: string;
  channelId?: string;
  workspaceId?: string;
  isRead: boolean;
  createdAt: Timestamp | null;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: Notification) => {
    if (!user) return;
    
    // 1. Mark as Read via API
    if (!notif.isRead) {
      api.notifications.manage({
        userId: user.uid,
        notificationId: notif.id,
        action: 'MARK_READ'
      }).catch(console.error);
    }

    // 2. Redirect & Select Channel
    if (notif.channelId) {
      dispatch(setActiveChannel(notif.channelId));
      router.push('/chat');
    }

    setIsOpen(false);
  };

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      await api.notifications.manage({
        userId: user.uid,
        action: 'READ_ALL'
      });
      toast.success('All marked as read');
    } catch (err) {
      console.error("Mark Read Error", err);
    }
  };

  const clearAll = async () => {
    if (!user || notifications.length === 0) return;
    
    // We should probably add a DELETE_ALL action to the API, 
    // but for now we'll handle single deletes quickly in sequence or update API.
    // Let's implement individual deletes via API for each.
    
    notifications.forEach(n => {
      api.notifications.manage({
        userId: user.uid,
        notificationId: n.id,
        action: 'DELETE'
      }).catch(console.error);
    });
    
    setIsOpen(false);
    toast.success('Alerts cleared');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-xl transition-all duration-300",
          isOpen ? "bg-orange-50 text-orange-600" : "text-zinc-600 hover:bg-zinc-50"
        )}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                Notifications
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                  {unreadCount} New
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="p-1.5 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
                  title="Mark all as read"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={clearAll}
                  className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
                    <Bell size={24} />
                  </div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "p-4 border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer group flex gap-3",
                      !notif.isRead && "bg-orange-50/30"
                    )}
                  >
                    <div className="shrink-0 pt-1">
                      {notif.type === 'mention' ? (
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <AtSign size={14} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                          <MessageSquare size={14} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-black text-zinc-800 truncate">{notif.title}</span>
                        <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap ml-2">
                          {notif.createdAt ? `${formatDistanceToNow(notif.createdAt.toMillis())} ago` : 'Just now'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                        <span className="font-bold text-zinc-700">{notif.senderName}</span>: {notif.body}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-zinc-50 text-center">
                 <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-orange-600 transition-colors">
                    View Activity Timeline
                 </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
