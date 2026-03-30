"use client";

import {
  MessageCircle,
  Users,
  MoreHorizontal,
  CheckSquare,
  Activity,
  Building2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const menu = [
  { name: "Chat", icon: MessageCircle, path: "/chat" },
  { name: "Tasks", icon: CheckSquare, path: "/tasks" },
  { name: "Activity", icon: Activity, path: "/activity" },

  { name: "Workspace", icon: Building2, path: "/workspaces" },
    { name: "People", icon: Users, path: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-[70px] h-screen bg-white flex flex-col items-center py-4 border-r border-zinc-200">

      <div className="mb-6 text-orange-500 font-bold text-lg cursor-pointer"
           onClick={() => router.push("/chat")}>
        S
      </div>

      <div className="flex flex-col items-center gap-6">
        {menu.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.path;

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
        <MoreHorizontal className="text-zinc-400" size={20} />
      </div>
    </div>
  );
}