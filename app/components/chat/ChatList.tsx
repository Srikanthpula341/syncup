'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { setActiveChannel } from '@/app/store/slices/uiSlice';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useUserStatus } from '@/app/hooks/useUserStatus';

const ChatList = () => {
  const dispatch = useAppDispatch();
  const { users, unreadCounts, loading } = useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { activeChannelId } = useAppSelector((state) => state.ui);

  // Filter out the current user from the list
  const otherUsers = users.filter((u) => u.uid !== currentUser?.uid);

  return (
    <div className="space-y-1 py-4">
      <div className="flex items-center justify-between px-3 py-1 text-zinc-400 hover:text-orange-600 transition-colors cursor-pointer group mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
           Direct Messages
        </span>
        <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {loading.users ? (
        <div className="px-3 py-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-2 bg-zinc-200 rounded-full animate-pulse w-full" />
          ))}
        </div>
      ) : otherUsers.length === 0 ? (
        <div className="px-4 py-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center">
          No users found
        </div>
      ) : (
        otherUsers.map((targetUser) => {
          const dmId = currentUser ? `dm-${[currentUser.uid, targetUser.uid].sort().join('_')}` : '';
          const unreadCount = dmId ? unreadCounts[dmId] || 0 : 0;
          return (
            <div key={targetUser.uid} className="px-2">
              <DMItem 
                user={targetUser}
                unreadCount={unreadCount}
                isActive={activeChannelId === dmId}
                onClick={() => dmId && dispatch(setActiveChannel(dmId))}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

interface DMUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface DMItemProps {
  user: DMUser;
  isActive: boolean;
  unreadCount: number;
  onClick: () => void;
}

const DMItem = ({ user, isActive, unreadCount, onClick }: DMItemProps) => {
  const { isOnline, statusText } = useUserStatus(user.uid);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-3 py-2 rounded-xl transition-all duration-300 group relative",
        isActive 
          ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100" 
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-transparent"
      )}
    >
      <div className="relative mr-3 shrink-0">
         <div className="w-8 h-8 rounded-lg bg-orange-100 overflow-hidden relative border border-zinc-200">
          {user.photoURL ? (
            <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-[10px] uppercase">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}
         </div>
         <div className={cn(
           "absolute -right-1 -bottom-1 w-2.5 h-2.5 border-2 border-white rounded-full shadow-sm transition-colors duration-300",
           isOnline ? "bg-emerald-500" : "bg-zinc-400"
         )} />
      </div>

      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className={cn(
          "truncate text-sm font-bold tracking-tight",
          isActive ? "text-orange-600" : "text-zinc-700"
        )}>
          {user.displayName || user.email?.split('@')[0]}
        </span>
        <span className="text-[9px] font-bold opacity-60 group-hover:opacity-80 transition-opacity truncate w-full flex items-center">
          {!isOnline && <Clock size={8} className="mr-1" />}
          {statusText}
        </span>
      </div>

      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="ml-2 px-1.5 h-5 min-w-[20px] flex items-center justify-center shrink-0 rounded-full bg-orange-500 text-white shadow-sm"
          >
            <span className="text-[10px] font-black">{unreadCount > 99 ? '99+' : unreadCount}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ChatList;