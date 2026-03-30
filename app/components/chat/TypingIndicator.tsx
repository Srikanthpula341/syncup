"use client";

import { useAppSelector } from "@/app/store/hooks";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function TypingIndicator() {
  const { activeChannelId } = useAppSelector((state) => state.ui);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!activeChannelId) return;

    const unsub = onSnapshot(
      doc(db, "typing_states", activeChannelId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const users = Object.keys(data)
            .filter((uid) => uid !== currentUser?.uid)
            .map((uid) => data[uid].name);

          setTypingUsers(users);
        } else {
          setTypingUsers([]);
        }
      }
    );

    return () => unsub();
  }, [activeChannelId, currentUser]);

  // 🚨 IMPORTANT: DO NOT RETURN NULL
  // Always keep space
  return (
    <div className="h-[20px] flex items-center text-xs text-gray-500 px-1">
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2">
          <span>
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing`
              : `${typingUsers.join(", ")} are typing`}
          </span>

          {/* animated dots */}
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
}