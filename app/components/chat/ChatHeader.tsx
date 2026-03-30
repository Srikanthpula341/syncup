"use client";

import { Video, Phone, Sparkles, Info } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { useUserStatus } from "@/app/hooks/useUserStatus";

export default function ChatHeader() {
  const { activeChannelId } = useAppSelector((state) => state.ui);
  const { channels, users } = useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const isDM = activeChannelId?.startsWith("dm-");

  const activeChannel = !isDM
    ? channels.find((c) => c.id === activeChannelId)
    : null;

  let recipient = null;

  if (isDM && activeChannelId && currentUser) {
    const participantUids = activeChannelId.replace("dm-", "").split("_");
    const recipientUid = participantUids.find(
      (uid) => uid !== currentUser.uid
    );
    recipient = users.find((u) => u.uid === recipientUid);
  }

  const { isOnline, statusText } = useUserStatus(recipient?.uid);

  const name = isDM
    ? recipient?.displayName || recipient?.email?.split("@")[0]
    : activeChannel?.name || "general";

  const avatarLetter = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200">

      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center font-bold text-white overflow-hidden">
          {isDM && recipient?.photoURL ? (
            <img
              src={recipient.photoURL}
              alt="user avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            avatarLetter
          )}
        </div>

        <div>
          <div className="font-semibold text-gray-800">{name}</div>

          {isDM && (
            <div
              className={`text-sm ${
                isOnline ? "text-green-500" : "text-gray-400"
              }`}
            >
              {statusText}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex gap-4 text-gray-600">
        <Video className="cursor-pointer hover:text-orange-500" size={18} />
        <Phone className="cursor-pointer hover:text-orange-500" size={18} />
        <Sparkles className="cursor-pointer hover:text-orange-500" size={18} />
        <Info className="cursor-pointer hover:text-orange-500" size={18} />
      </div>
    </div>
  );
}