/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { setActiveChannel } from '@/app/store/slices/uiSlice';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Hash, Search, Clock, Users } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useUserStatus } from '@/app/hooks/useUserStatus';
import { AppUser } from '@/app/store/slices/chatSlice';

const ChatList = () => {
  const dispatch = useAppDispatch();
  const { users, channels, unreadCounts, loading } = useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { activeChannelId, activeWorkspaceId } = useAppSelector((state) => state.ui);
  
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Process Channels (Filter & Sort)
  const filteredChannels = useMemo(() => {
    return channels
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0) || a.name.localeCompare(b.name));
  }, [channels, searchTerm]);

  // 2. Process DMs (Filter & Sort)
  const filteredUsers = useMemo(() => {
    return users
      .filter(u => u.uid !== currentUser?.uid)
      .filter(u => (u.displayName || u.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (!currentUser) return 0;
        const dmIdA = `dm-${[currentUser.uid, a.uid].sort().join('_')}`;
        const dmIdB = `dm-${[currentUser.uid, b.uid].sort().join('_')}`;
        
        const lastAtARaw = unreadCounts[`${dmIdA}_lastAt`];
        const lastAtBRaw = unreadCounts[`${dmIdB}_lastAt`];
        
        const lastAtA = (typeof lastAtARaw === 'object' && lastAtARaw !== null && 'toMillis' in lastAtARaw) 
          ? (lastAtARaw as any).toMillis() 
          : (typeof lastAtARaw === 'number' ? lastAtARaw : 0);
          
        const lastAtB = (typeof lastAtBRaw === 'object' && lastAtBRaw !== null && 'toMillis' in lastAtBRaw) 
          ? (lastAtBRaw as any).toMillis() 
          : (typeof lastAtBRaw === 'number' ? lastAtBRaw : 0);
        
        if (lastAtA !== lastAtB) return (lastAtB as number) - (lastAtA as number);
        
        const unreadA = (unreadCounts[dmIdA] as number) || 0;
        const unreadB = (unreadCounts[dmIdB] as number) || 0;
        return unreadB - unreadA;
      });
  }, [users, currentUser, searchTerm, unreadCounts]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="px-4 py-3 pb-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={14} />
          <input 
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-100/50 border-none rounded-xl py-2 pl-9 pr-4 text-xs font-medium placeholder:text-zinc-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 py-4">
        
        {/* Channels Section */}
        <div>
          <div className="flex items-center justify-between px-4 py-1 text-zinc-400 hover:text-orange-600 transition-colors cursor-pointer group mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
               Channels
            </span>
            <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-0.5 px-2">
            {/* Always show General if active workspace exists */}
            {activeWorkspaceId && (
               <ChannelItem 
                  name="general"
                  isActive={activeChannelId === 'general'}
                  unreadCount={(unreadCounts['general'] as number) || 0}
                  onClick={() => dispatch(setActiveChannel('general'))}
               />
            )}
            
            {filteredChannels.filter(c => c.id !== 'general').map(channel => (
              <ChannelItem 
                key={channel.id}
                name={channel.name}
                isActive={activeChannelId === channel.id}
                unreadCount={(unreadCounts[channel.id] as number) || 0}
                lastPreview={unreadCounts[`${channel.id}_lastPreview`] as string}
                onClick={() => dispatch(setActiveChannel(channel.id))}
              />
            ))}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div>
          <div className="flex items-center justify-between px-4 py-1 text-zinc-400 hover:text-orange-600 transition-colors cursor-pointer group mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
               Direct Messages
            </span>
            <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-0.5 px-2">
            {loading.users ? (
              <div className="px-4 py-2 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-3 bg-zinc-100 rounded-lg animate-pulse w-full" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <Users size={20} className="mx-auto text-zinc-200 mb-2" />
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-tight">No results</p>
              </div>
            ) : (
              filteredUsers.map((targetUser) => {
                const dmId = currentUser ? `dm-${[currentUser.uid, targetUser.uid].sort().join('_')}` : '';
                const unreadCount = dmId ? unreadCounts[dmId] || 0 : 0;
                return (
                  <DMItem 
                    key={targetUser.uid}
                    user={targetUser}
                    unreadCount={(unreadCount as number) || 0}
                    isActive={activeChannelId === dmId}
                    lastPreview={dmId ? (unreadCounts[`${dmId}_lastPreview`] as string) : undefined}
                    onClick={() => dmId && dispatch(setActiveChannel(dmId))}
                  />
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

/* --- Helpers --- */

const ChannelItem = ({ name, isActive, unreadCount, lastPreview, onClick }: { name: string, isActive: boolean, unreadCount: number, lastPreview?: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center px-3 py-2 rounded-xl transition-all duration-200 group relative",
      isActive 
        ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100/50" 
        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-transparent"
    )}
  >
    <div className={cn(
      "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors",
      isActive ? "bg-orange-100 text-orange-600" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
    )}>
      <Hash size={16} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <span className={cn(
        "truncate text-sm font-bold tracking-tight text-left",
        isActive ? "text-orange-600" : "text-zinc-700"
      )}>
        {name}
      </span>
      {unreadCount > 0 && lastPreview && (
        <span className="text-[10px] font-medium opacity-60 truncate w-full">
           {lastPreview}
        </span>
      )}
    </div>
    {unreadCount > 0 && (
       <div className="ml-2 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-orange-500/20">
          {unreadCount}
       </div>
    )}
  </button>
);

const DMItem = ({ user, isActive, unreadCount, lastPreview, onClick }: { user: AppUser, isActive: boolean, unreadCount: number, lastPreview?: string, onClick: () => void }) => {
  const { isOnline, statusText } = useUserStatus(user.uid);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-3 py-2 rounded-xl transition-all duration-200 group relative",
        isActive 
          ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100/50" 
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-transparent"
      )}
    >
      <div className="relative mr-3 shrink-0">
         <div className="w-8 h-8 rounded-lg bg-zinc-100 overflow-hidden relative border border-zinc-200 group-hover:border-zinc-300 transition-colors">
          {user.photoURL ? (
            <Image 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              fill 
              sizes="32px" 
              className="object-cover rounded-lg" 
            />
          ) : (
            <div className="w-full h-full bg-orange-50 text-orange-600 flex items-center justify-center font-black text-[10px] uppercase">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}
         </div>
         <div className={cn(
           "absolute -right-1 -bottom-1 w-2.5 h-2.5 border-2 border-white rounded-full shadow-sm transition-all duration-300",
           isOnline ? "bg-emerald-500 scale-100" : "bg-zinc-400 scale-90"
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
          {lastPreview ? (
            <span className="truncate">{lastPreview}</span>
          ) : (
            <>
              {!isOnline && <Clock size={8} className="mr-1" />}
              {statusText}
            </>
          )}
        </span>
      </div>

      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="ml-2 w-5 h-5 flex items-center justify-center shrink-0 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20"
          >
            <span className="text-[10px] font-black">{unreadCount > 99 ? '99+' : unreadCount}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ChatList;