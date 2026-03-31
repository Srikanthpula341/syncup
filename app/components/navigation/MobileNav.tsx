'use client';

import React from 'react';
import { 
  MessageCircle, 
  CheckSquare, 
  Activity, 
  Building2, 
  Users 
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/app/lib/utils';

const menu = [
  { name: "Chat", icon: MessageCircle, path: "/chat" },
  { name: "Tasks", icon: CheckSquare, path: "/tasks" },
  { name: "Activity", icon: Activity, path: "/activity" },
  { name: "Workspace", icon: Building2, path: "/workspaces" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-3 flex items-center justify-between z-[100] pb-safe-offset-4">
      {menu.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.path);

        return (
          <div
            key={item.name}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-200",
              isActive ? "bg-orange-100 text-orange-500" : "text-zinc-400"
            )}>
              <Icon size={20} />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-tighter",
              isActive ? "text-orange-500" : "text-zinc-400"
            )}>
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
