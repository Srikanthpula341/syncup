"use client";

import {
  MessageCircle,
  Users,
  CheckSquare,
  Activity,
  Building2,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setSettingsModalOpen } from "@/app/store/slices/uiSlice";

const menu = [
  { name: "Chat", icon: MessageCircle, path: "/chat" },
  { name: "Tasks", icon: CheckSquare, path: "/tasks" },
  { name: "Activity", icon: Activity, path: "/activity" },
  { name: "Workspace", icon: Building2, path: "/workspaces" },
  { name: "Profile", icon: Users, path: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeWorkspaceId } = useAppSelector((state) => state.ui);
  const { workspaces } = useAppSelector((state) => state.chat);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const isOwner = activeWorkspace?.ownerId === user?.uid;

  return (
    <div className="w-full h-full bg-white flex flex-col items-center py-4 border-r border-zinc-100">

      {/* Logo */}
      <div
        className="mb-6 text-orange-500 font-bold text-lg cursor-pointer"
        onClick={() => router.push("/chat")}
      >
        S
      </div>

      {/* Menu */}
      <div className="flex flex-col items-center gap-6">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);

          return (
            <div
              key={item.name}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div
                className={`p-2 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-orange-100 text-orange-500"
                      : "text-zinc-500 group-hover:text-orange-500 group-hover:bg-orange-50"
                  }`}
              >
                <Icon size={18} />
              </div>

              <span
                className={`text-[11px] ${
                  isActive
                    ? "text-orange-500 font-medium"
                    : "text-zinc-500 group-hover:text-orange-500"
                }`}
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col items-center gap-6">
        {isOwner && (
           <div
             onClick={() => dispatch(setSettingsModalOpen(true))}
             className="flex flex-col items-center gap-1 cursor-pointer group"
             title="Workspace Settings"
           >
             <div className="p-2 rounded-xl text-zinc-500 group-hover:text-orange-500 group-hover:bg-orange-50 transition">
               <Settings size={18} />
             </div>
             <span className="text-[11px] text-zinc-500 group-hover:text-orange-500">
               Settings
             </span>
           </div>
        )}
      </div>
    </div>
  );
}