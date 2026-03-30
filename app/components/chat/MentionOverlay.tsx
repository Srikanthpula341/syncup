"use client";

import React from "react";
import { useAppSelector } from "@/app/store/hooks";
import { AppUser } from "@/app/store/slices/chatSlice";
import { useUserStatus } from "@/app/hooks/useUserStatus";

interface MentionOverlayProps {
  isVisible: boolean;
  onSelect: (user: AppUser) => void;
  searchQuery: string;
}

export default function MentionOverlay({
  isVisible,
  onSelect,
  searchQuery,
}: MentionOverlayProps) {
  const { users } = useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const filteredUsers = users
    .filter((u) => u.uid !== currentUser?.uid)
    .filter((u) => {
      const name = (u.displayName || u.email || "").toLowerCase();
      return name.includes(searchQuery.toLowerCase());
    })
    .slice(0, 8);

  if (!isVisible || filteredUsers.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-[260px] bg-white rounded-xl shadow-lg border border-zinc-200 z-50">

      <div className="px-3 py-2 border-b text-xs font-semibold text-zinc-500">
        Mention
      </div>

      <div className="max-h-[200px] overflow-y-auto">
        {filteredUsers.map((user) => (
          <MentionItem key={user.uid} user={user} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

const MentionItem = ({
  user,
  onSelect,
}: {
  user: AppUser;
  onSelect: (user: AppUser) => void;
}) => {
  const { isOnline } = useUserStatus(user.uid);

  return (
    <button
      onClick={() => onSelect(user)}
      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-100 transition"
    >
      <div className="relative w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-white">
        {user.displayName?.charAt(0) ||
          user.email?.charAt(0) ||
          "U"}

        <span
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      <div className="flex flex-col items-start text-left">
        <span className="text-sm text-zinc-800 font-medium">
          {user.displayName || user.email?.split("@")[0]}
        </span>
        <span className="text-xs text-zinc-500">
          @{user.email?.split("@")[0]}
        </span>
      </div>
    </button>
  );
};