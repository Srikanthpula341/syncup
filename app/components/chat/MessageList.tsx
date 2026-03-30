"use client";

import React, { useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { Check, CheckCheck } from "lucide-react";
import { useUserStatus } from "@/app/hooks/useUserStatus";
import { format } from "date-fns";
import TypingIndicator from "./TypingIndicator";

export default function MessageList() {
  const { messages, loading } = useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { activeChannelId } = useAppSelector((state) => state.ui);

  const isDM = activeChannelId
    ? activeChannelId.startsWith("dm-")
    : false;

  const recipientUid =
    isDM && activeChannelId
      ? activeChannelId
          .replace("dm-", "")
          .split("_")
          .find((id) => id !== currentUser?.uid)
      : undefined;

  const { isOnline: isRecipientOnline } = useUserStatus(
    recipientUid || ""
  );

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
                  <div key={message.id} className="flex justify-end">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-xl max-w-xs break-words inline-flex items-end gap-2 shadow-sm">
                      <span className="text-[15px]">
                        {message.content}
                      </span>

                      <div className="flex items-center gap-1 shrink-0 mb-0.5 mt-1 -mr-1">
                        <span className="text-[10px] text-white/70 font-bold">
                          {format(message.timestamp, "HH:mm")}
                        </span>

                        {message.status === "read" ? (
                          <CheckCheck
                            size={14}
                            className="text-blue-300"
                          />
                        ) : message.status === "delivered" ||
                          (message.status === "sent" &&
                            isRecipientOnline) ? (
                          <CheckCheck
                            size={14}
                            className="text-white/70"
                          />
                        ) : (
                          <Check
                            size={14}
                            className="text-white/70"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className="flex justify-start items-end"
                >
                  <div className="bg-orange-100 text-gray-800 px-4 py-2 rounded-xl max-w-xs break-words shadow-sm">
                    <span className="text-[15px]">
                      {message.content}
                    </span>
                  </div>

                  <span className="ml-2 text-[10px] text-gray-400 mb-1 font-bold">
                    {format(message.timestamp, "HH:mm")}
                  </span>
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