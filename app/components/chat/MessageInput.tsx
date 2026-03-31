"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store/hooks";
import {
  Bold,
  Italic,
  SendHorizontal,
  Smile,
  AtSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/hooks/useChat";
import { storage } from "@/app/lib/firebase";
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import { AppUser, Attachment } from "@/app/store/slices/chatSlice";
import { cn } from "@/app/lib/utils";
import MentionOverlay from "./MentionOverlay";
import { X, FileIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { api } from "@/app/lib/api-client";
import { API_CONFIG } from "@/app/lib/api-constants";
import { debounce } from "@/app/lib/api-utils";

export default function MessageInput() {
  const [content, setContent] = useState("");
  const [isMentioning, setIsMentioning] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, number>>({});
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const emojiPickerRef = React.useRef<HTMLDivElement>(null);

  const { activeChannelId } = useAppSelector((state) => state.ui);
  const { channels, users } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const { sendMessage } = useChat();

  const isDM = activeChannelId?.startsWith("dm-");
  const activeChannel = !isDM
    ? channels.find((c) => c.id === activeChannelId)
    : null;

  let recipientName = "";
  if (isDM && activeChannelId && user) {
    const participantUids = activeChannelId.replace("dm-", "").split("_");
    const recipientUid = participantUids.find(
      (uid) => uid !== user.uid
    );
    const recipient = users.find((u) => u.uid === recipientUid);
    recipientName =
      recipient?.displayName ||
      recipient?.email?.split("@")[0] ||
      "";
  }

  const handleSendMessage = async () => {
    if (!content.trim() && attachments.length === 0) return;
    const messageContent = content;
    const messageAttachments = attachments;
    
    setContent("");
    setAttachments([]);
    await sendMessage(messageContent, messageAttachments);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user || !activeChannelId) return;

    Array.from(files).forEach(async (file) => {
      // 1. Validation (25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 25MB)`);
        return;
      }

      const fileId = Math.random().toString(36).substring(7);
      const storageRef = ref(storage, `workspaces/${activeChannelId}/files/${fileId}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track progress
      setUploadingFiles(prev => ({ ...prev, [fileId]: 0 }));

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingFiles(prev => ({ ...prev, [fileId]: progress }));
        }, 
        (error) => {
          console.error("Upload error", error);
          toast.error(`Upload failed: ${file.name}`);
          setUploadingFiles(prev => {
            const next = { ...prev };
            delete next[fileId];
            return next;
          });
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newAttachment: Attachment = {
            id: fileId,
            url: downloadURL,
            name: file.name,
            type: file.type,
            size: file.size
          };

          setAttachments(prev => [...prev, newAttachment]);
          setUploadingFiles(prev => {
            const next = { ...prev };
            delete next[fileId];
            return next;
          });
        }
      );
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const addEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    const lastWord = value.split(/\s/).pop();
    if (lastWord?.startsWith("@")) {
      setIsMentioning(true);
      setMentionSearch(lastWord.substring(1));
    } else {
      setIsMentioning(false);
    }
  };

  const insertMention = (targetUser: AppUser) => {
    const words = content.split(/\s/);
    words.pop();
    const mentionName =
      targetUser.displayName ||
      targetUser.email?.split("@")[0] ||
      "user";
    const newContent = [...words, `@${mentionName}`, ""].join(" ");
    setContent(newContent);
    setIsMentioning(false);
  };

  // Typing Status Logic (Modular & Debounced)
  const typingRef = useRef({
    startDebounced: null as ReturnType<typeof debounce> | null,
    stopDebounced: null as ReturnType<typeof debounce> | null,
  });

  useEffect(() => {
    if (!activeChannelId || !user) return;

    const updateStatus = async (isTyping: boolean) => {
      try {
        await api.chat.typing({
          channelId: activeChannelId,
          userId: user.uid,
          userName: user.displayName || user.email || '',
        }, isTyping);
      } catch (err) {
        console.error("Typing API error", err);
      }
    };

    // Initialize debounced functions once per channel/user combo
    typingRef.current.startDebounced = debounce(() => updateStatus(true), API_CONFIG.TYPING_DEBOUNCE, true);
    typingRef.current.stopDebounced = debounce(() => updateStatus(false), 3000);

    return () => {
      // Clear on cleanup (stopping status)
      updateStatus(false).catch(console.error);
    };
  }, [activeChannelId, user]);

  useEffect(() => {
    if (!content.trim() || !typingRef.current.startDebounced || !typingRef.current.stopDebounced) return;

    // 1. Trigger "Started Typing" (Leading edge, immediate, then wait 6s)
    typingRef.current.startDebounced();

    // 2. Trigger "Stopped Typing" (Trailing edge, 3s after last keystroke)
    typingRef.current.stopDebounced();
  }, [content]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setIsEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-2 mb-16 lg:mb-8">
      <div className="relative rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
        {/* Attachment Previews */}
        {(attachments.length > 0 || Object.keys(uploadingFiles).length > 0) && (
          <div className="p-3 flex flex-wrap gap-2 border-b border-zinc-100 bg-zinc-50/50">
            {/* Uploading placeholders */}
            {Object.entries(uploadingFiles).map(([id, progress]) => (
              <div key={id} className="w-32 h-20 rounded-xl border border-zinc-200 bg-white flex flex-col items-center justify-center p-2 animate-pulse">
                <Loader2 className="w-5 h-5 text-zinc-300 animate-spin mb-2" />
                <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Finished attachments */}
            {attachments.map((file) => (
              <div key={file.id} className="group relative w-32 h-20 rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:border-orange-200 transition-colors">
                {file.type.startsWith('image/') ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={file.url} 
                      alt={file.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <FileIcon className="w-6 h-6 text-zinc-400 mb-1" />
                    <span className="text-[10px] font-bold text-zinc-500 truncate w-full text-center">
                      {file.name}
                    </span>
                  </div>
                )}
                <button 
                  onClick={() => removeAttachment(file.id)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Mention Overlay */}
        <MentionOverlay
          isVisible={isMentioning}
          searchQuery={mentionSearch}
          onSelect={insertMention}
        />

        <input 
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <textarea
          value={content}
          onChange={handleContentChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            isDM
              ? `Message @${recipientName}`
              : `Message #${activeChannel?.name || "general"}`
          }
          className="w-full resize-none px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none border-none min-h-[60px]"
        />

        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-100 bg-zinc-50">

          <div className="flex items-center gap-1">
            {/* File Upload Hidden as per request */}
            {/* <ToolbarButton 
              icon={<Paperclip size={18} />} 
              onClick={() => fileInputRef.current?.click()}
            />
            <div className="w-px h-4 bg-zinc-200 mx-1" /> */}
            <ToolbarButton icon={<Bold size={16} />} />
            <ToolbarButton icon={<Italic size={16} />} />
            <div className="relative" ref={emojiPickerRef}>
              <ToolbarButton 
                icon={<Smile size={18} className={cn(isEmojiPickerOpen && "text-orange-500")} />} 
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              />
              <AnimatePresence>
                {isEmojiPickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-2 p-2 bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50 w-64"
                  >
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 px-1">
                      Quick Emojis
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-lg transition-colors text-base"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ToolbarButton
              icon={<AtSign size={18} />}
              onClick={() => {
                setContent(content + "@");
                setIsMentioning(true);
                setMentionSearch("");
              }}
            />

            <button
              onClick={handleSendMessage}
              disabled={!content.trim() && attachments.length === 0}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full transition",
                (content.trim() || attachments.length > 0)
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md transform hover:scale-105 active:scale-95"
                  : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
              )}
            >
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ToolbarButton = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition"
  >
    {icon}
  </button>
);