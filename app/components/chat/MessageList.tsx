/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { Check, CheckCheck, MessageSquare, FileIcon, Download, ExternalLink, Smile } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import { openThread } from "@/app/store/slices/uiSlice";
import { Attachment } from "@/app/store/slices/chatSlice";
import Image from "next/image";
import PresenceBadge from "../ui/PresenceBadge";
import { cn } from "@/app/lib/utils";
import { useChat } from "@/app/hooks/useChat";

const AttachmentGrid = ({ attachments, isMe }: { attachments: Attachment[], isMe: boolean }) => {
  if (!attachments || attachments.length === 0) return null;

  const images = attachments.filter(a => a.type.startsWith('image/'));
  const files = attachments.filter(a => !a.type.startsWith('image/'));

  return (
    <div className={cn("mt-2 space-y-2", isMe ? "items-end" : "items-start")}>
      {/* Image Grid */}
      {images.length > 0 && (
        <div className={cn(
          "grid gap-1 rounded-xl overflow-hidden max-w-sm",
          images.length === 1 ? "grid-cols-1" : 
          images.length === 2 ? "grid-cols-2" : "grid-cols-3"
        )}>
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square group cursor-pointer">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <ExternalLink className="text-white w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Cards */}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5 max-w-sm">
          {files.map((file) => (
            <a 
              key={file.id} 
              href={file.url} 
              target="_blank" 
              rel="noreferrer"
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 group",
                isMe 
                  ? "bg-white/10 border-white/20 hover:bg-white/20" 
                  : "bg-white border-zinc-200 hover:border-orange-200"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                isMe ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
              )}>
                <FileIcon size={20} />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className={cn("text-xs font-black truncate", isMe ? "text-white" : "text-zinc-900")}>
                  {file.name}
                </div>
                <div className={cn("text-[10px] uppercase font-bold tracking-widest mt-0.5 opacity-60", isMe ? "text-white/70" : "text-zinc-500")}>
                  {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                </div>
              </div>
              <Download size={16} className={cn("shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", isMe ? "text-white" : "text-orange-500")} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const QuickReact = ({ onReact }: { onReact: (emoji: string) => void }) => {
  const emojis = ['👍', '❤️', '🔥', '🎉', '🚀', '👀'];
  return (
    <div className="flex items-center gap-1 px-1 border-r border-zinc-100 mr-1">
      {emojis.map(emoji => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-lg transition-colors text-base hover:scale-125 duration-200"
        >
          {emoji}
        </button>
      ))}
      <button 
        className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400"
        title="More reactions"
      >
        <Smile size={14} />
      </button>
    </div>
  );
};

const ReactionPills = ({ 
  reactions, 
  onReact, 
  currentUserId,
  isMe,
  users
}: { 
  reactions?: Record<string, string[]>, 
  onReact: (emoji: string) => void,
  currentUserId: string,
  isMe: boolean,
  users: any[]
}) => {
  if (!reactions || Object.keys(reactions).length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1 mt-1.5", isMe ? "justify-end" : "justify-start")}>
      <AnimatePresence>
        {Object.entries(reactions).map(([emoji, userIds]) => {
          if (!userIds || userIds.length === 0) return null;
          const hasReacted = userIds.includes(currentUserId);
          
          // Map user IDs to names for tooltip
          const names = userIds.map(uid => {
            const u = users.find(user => user.uid === uid);
            return u?.displayName || u?.email?.split('@')[0] || 'Someone';
          }).join(', ');

          return (
            <motion.button
              key={emoji}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onReact(emoji)}
              title={names}
              className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-black transition-all duration-300",
                hasReacted 
                  ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm" 
                  : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
              )}
            >
              <span>{emoji}</span>
              <span>{userIds.length}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default function MessageList() {
  const dispatch = useAppDispatch();
  const { messages, loading, users } = useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { toggleReaction } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading.messages && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col"
      >
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-xs text-gray-400 font-medium py-10 uppercase tracking-widest">
              Send a message to start chatting
            </div>
          ) : (
            messages.map((message) => {
              const isMe = message.userId === currentUser?.uid;

              if (isMe) {
                return (
                  <div key={message.id} className="flex justify-end group">
                    <div className="relative">
                      {/* Message Hover Actions */}
                      <div className="absolute -top-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-zinc-200 rounded-lg p-1 flex items-center shadow-lg transform -translate-y-2 group-hover:translate-y-0 duration-200 z-10">
                        <QuickReact onReact={(emoji) => message.id && toggleReaction(message.id, emoji, message.reactions)} />
                        <button 
                          onClick={() => message.id && dispatch(openThread(message.id))}
                          className="p-1 px-2 hover:bg-zinc-100 rounded text-xs font-bold text-zinc-500 flex items-center gap-1.5"
                        >
                          <MessageSquare size={14} />
                          Reply
                        </button>
                      </div>

                      <div className="bg-orange-500 text-white px-4 py-2 rounded-xl max-w-xs wrap-break-word shadow-sm">
                        <span className="text-[15px]">{message.content}</span>
                        <div className="flex items-center gap-1 shrink-0 mb-0.5 mt-1 -mr-1 justify-end">
                          <span className="text-[10px] text-white/70 font-bold">
                            {format(message.timestamp, "HH:mm")}
                          </span>
                          {message.status === "read" ? <CheckCheck size={14} className="text-blue-300" /> : <Check size={14} className="text-white/70" />}
                        </div>
                      </div>

                      <AttachmentGrid attachments={message.attachments || []} isMe={true} />
                      
                      <ReactionPills 
                        reactions={message.reactions} 
                        onReact={(emoji) => message.id && toggleReaction(message.id, emoji, message.reactions)}
                        currentUserId={currentUser?.uid || ''}
                        isMe={true}
                        users={users}
                      />

                      {/* Reply Count link */}
                      {message.threadCount && message.threadCount > 0 && (
                        <div className="mt-1 flex justify-end">
                          <button 
                            onClick={() => message.id && dispatch(openThread(message.id))}
                            className="text-[11px] font-bold text-orange-500 hover:underline flex items-center gap-1"
                          >
                            {message.threadCount} {message.threadCount === 1 ? 'reply' : 'replies'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="flex justify-start items-start group gap-3">
                   {/* Avatar */}
                   <div className="w-8 h-8 rounded-lg shrink-0 mt-1 relative">
                      <Image 
                        src={message.userAvatar} 
                        alt={message.userName} 
                        fill
                        sizes="32px"
                        className="object-cover rounded-lg" 
                      />
                      <PresenceBadge 
                        uid={message.userId} 
                        className="absolute -bottom-1 -right-1 scale-75"
                      />
                   </div>

                   <div className="relative">
                      {/* Message Hover Actions */}
                      <div className="absolute -top-4 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-zinc-200 rounded-lg p-1 flex items-center shadow-lg transform -translate-y-2 group-hover:translate-y-0 duration-200 z-10">
                        <QuickReact onReact={(emoji) => message.id && toggleReaction(message.id, emoji, message.reactions)} />
                        <button 
                          onClick={() => message.id && dispatch(openThread(message.id))}
                          className="p-1 px-2 hover:bg-zinc-100 rounded text-xs font-bold text-zinc-500 flex items-center gap-1.5"
                        >
                          <MessageSquare size={14} />
                          Reply
                        </button>
                      </div>

                      <div className="bg-zinc-100 text-gray-800 px-4 py-2 rounded-xl max-w-xs wrap-break-word shadow-sm">
                        <span className="block text-[11px] font-black text-zinc-500 mb-0.5">{message.userName}</span>
                        <span className="text-[15px]">{message.content}</span>
                      </div>

                      <AttachmentGrid attachments={message.attachments || []} isMe={false} />

                      <ReactionPills 
                        reactions={message.reactions} 
                        onReact={(emoji) => message.id && toggleReaction(message.id, emoji, message.reactions)}
                        currentUserId={currentUser?.uid || ''}
                        isMe={false}
                        users={users}
                      />

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 font-bold">
                          {format(message.timestamp, "HH:mm")}
                        </span>
                        
                        {message.threadCount && message.threadCount > 0 && (
                          <button 
                            onClick={() => message.id && dispatch(openThread(message.id))}
                            className="text-[11px] font-bold text-orange-500 hover:underline"
                          >
                            {message.threadCount} {message.threadCount === 1 ? 'reply' : 'replies'}
                          </button>
                        )}
                      </div>
                   </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FIXED Typing Indicator Space */}
      <div className="h-[24px] px-4 flex items-center">
        <TypingIndicator />
      </div>
    </div>
  );
}