"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store/hooks";
import {
  Plus,
  Bold,
  Italic,
  SendHorizontal,
  Smile,
  AtSign,
} from "lucide-react";
import { useChat } from "@/app/hooks/useChat";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { AppUser } from "@/app/store/slices/chatSlice";
import { cn } from "@/app/lib/utils";
import MentionOverlay from "./MentionOverlay";

export default function MessageInput() {
  const [content, setContent] = useState("");
  const [isMentioning, setIsMentioning] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");

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
    if (!content.trim()) return;
    const messageContent = content;
    setContent("");
    await sendMessage(messageContent);
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

  useEffect(() => {
    if (!content.trim() || !activeChannelId || !user) {
      if (activeChannelId && user) {
        setDoc(
          doc(db, "typing_states", activeChannelId),
          { [user.uid]: deleteField() },
          { merge: true }
        );
      }
      return;
    }

    setDoc(
      doc(db, "typing_states", activeChannelId),
      {
        [user.uid]: {
          name: user.displayName || user.email,
          timestamp: serverTimestamp(),
        },
      },
      { merge: true }
    );

    const timeout = setTimeout(() => {
      setDoc(
        doc(db, "typing_states", activeChannelId),
        { [user.uid]: deleteField() },
        { merge: true }
      );
    }, 3000);

    return () => clearTimeout(timeout);
  }, [content, activeChannelId, user]);

  return (
    <div className="p-2">
      {/* IMPORTANT: relative added */}
      <div className="relative rounded-2xl bg-white border border-zinc-200 shadow-sm">

        {/* Mention Overlay */}
        <MentionOverlay
          isVisible={isMentioning}
          searchQuery={mentionSearch}
          onSelect={insertMention}
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
            <ToolbarButton icon={<Plus size={18} />} />
            <div className="w-px h-4 bg-zinc-200 mx-1" />
            <ToolbarButton icon={<Bold size={16} />} />
            <ToolbarButton icon={<Italic size={16} />} />
            <ToolbarButton icon={<Smile size={18} />} />
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
              disabled={!content.trim()}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full transition",
                content.trim()
                  ? "bg-orange-500 text-white hover:bg-orange-600"
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