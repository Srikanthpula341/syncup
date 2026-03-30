"use client";

import {
  MessageCircle,
  Users,
  MoreHorizontal,
  CheckSquare,
  Activity,
  Building2,
} from "lucide-react";

const menu = [
  { name: "Chat", icon: MessageCircle },
  { name: "Tasks", icon: CheckSquare },
  { name: "Activity", icon: Activity },
  { name: "People", icon: Users },
  { name: "Workspace", icon: Building2 },
];

export default function Sidebar() {
  return (
    <div className="w-[70px] h-screen bg-white flex flex-col items-center py-4 border-r border-zinc-200">

      {/* Top Logo */}
      <div className="mb-6 text-orange-500 font-bold text-lg">S</div>

      {/* Menu */}
      <div className="flex flex-col items-center gap-6">
        {menu.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === 0;

          return (
            <div
              key={item.name}
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

              {/* Label */}
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

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col items-center gap-6">
        <MoreHorizontal className="text-zinc-400" size={20} />
      </div>
    </div>
  );
}