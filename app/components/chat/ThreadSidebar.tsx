'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { X, SendHorizontal, MessageSquare, Clock } from 'lucide-react';
import { closeThread } from '@/app/store/slices/uiSlice';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { format } from 'date-fns';
import Image from 'next/image';
import toast from 'react-hot-toast';
import PresenceBadge from '../ui/PresenceBadge';
import { api } from '@/app/lib/api-client';

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
}

export default function ThreadSidebar() {
  const dispatch = useAppDispatch();
  const { activeThreadMessageId, activeChannelId, activeWorkspaceId } = useAppSelector((state) => state.ui);
  const { messages } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const parentMessage = messages.find(m => m.id === activeThreadMessageId);

  useEffect(() => {
    if (!activeThreadMessageId || !activeChannelId) return;

    const isDM = activeChannelId.startsWith('dm-');
    const path = isDM
      ? `dms/${activeChannelId}/messages/${activeThreadMessageId}/replies`
      : `workspaces/${activeWorkspaceId}/channels/${activeChannelId}/messages/${activeThreadMessageId}/replies`;

    const q = query(collection(db, path), orderBy('timestamp', 'asc'), limit(100));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timestamp: (doc.data().timestamp as any)?.toMillis() || Date.now()
      })) as Reply[];
      setReplies(data);
    });

    return () => unsubscribe();
  }, [activeThreadMessageId, activeChannelId, activeWorkspaceId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [replies]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !user || !activeThreadMessageId) return;

    setSending(true);
    try {
      await api.messages.reply({
        content: replyText.trim(),
        userId: user.uid,
        userName: user.displayName || user.email || '',
        userAvatar: user.photoURL || '',
        workspaceId: activeWorkspaceId,
        channelId: activeChannelId,
        parentMessageId: activeThreadMessageId
      });
      setReplyText('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  if (!activeThreadMessageId || !parentMessage) return null;

  return (
    <div className="fixed inset-0 lg:relative lg:inset-auto z-150 lg:z-0 w-full lg:w-[400px] border-l border-zinc-200 bg-white flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <MessageSquare size={16} />
            </div>
            <div>
                <h3 className="text-sm font-bold text-zinc-900">Thread</h3>
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest leading-none">
                    {parentMessage.userName?.split(' ')[0]}
                </p>
            </div>
        </div>
        <button 
          onClick={() => dispatch(closeThread())}
          className="p-1.5 hover:bg-zinc-200 rounded-md transition-colors text-zinc-400"
        >
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {/* Parent Message */}
        <div className="pb-6 border-b border-zinc-100 mb-6">
          <div className="flex gap-3">
             <div className="w-9 h-9 rounded-lg shrink-0 relative">
                 <Image 
                   src={parentMessage.userAvatar} 
                   alt="avatar" 
                   fill 
                   sizes="36px"
                   className="object-cover rounded-lg" 
                 />
                 <PresenceBadge 
                   uid={parentMessage.userId} 
                   className="absolute -bottom-1 -right-1 scale-75"
                 />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-zinc-900">{parentMessage.userName}</span>
                    <span className="text-[10px] text-zinc-400 font-bold">{format(parentMessage.timestamp, 'HH:mm')}</span>
                </div>
                <p className="text-[15px] text-zinc-700 leading-relaxed">{parentMessage.content}</p>
             </div>
          </div>
        </div>

        {/* Replies List */}
        <div className="space-y-6">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3 group">
               <div className="w-8 h-8 rounded-lg shrink-0 relative">
                  <Image 
                    src={reply.userAvatar} 
                    alt="avatar" 
                    fill 
                    sizes="32px"
                    className="object-cover rounded-lg" 
                  />
                  <PresenceBadge 
                    uid={reply.userId} 
                    className="absolute -bottom-1 -right-1 scale-75"
                  />
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-zinc-800">{reply.userName}</span>
                      <span className="text-[10px] text-zinc-400 font-bold">{format(reply.timestamp, 'HH:mm')}</span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">{reply.content}</p>
               </div>
            </div>
          ))}
          
          {replies.length === 0 && (
             <div className="flex flex-col items-center justify-center py-10 text-zinc-300">
                <Clock size={32} className="mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No replies yet</p>
             </div>
          )}
        </div>
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/30">
        <div className="relative rounded-xl bg-white border border-zinc-200 shadow-sm focus-within:border-orange-500 transition-all">
            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSendReply();
                }
              }}
              placeholder="Reply to thread..."
              className="w-full p-3 text-sm bg-transparent outline-none resize-none min-h-[80px]"
            />
            <div className="flex justify-end p-2 px-3 border-t border-zinc-50">
               <button 
                 onClick={handleSendReply}
                 disabled={sending || !replyText.trim()}
                 className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 disabled:bg-zinc-200 transition-all shadow-lg shadow-orange-500/20"
               >
                 <SendHorizontal size={16} />
               </button>
            </div>
        </div>
      </div>
    </div>
  );
}
