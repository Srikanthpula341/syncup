'use client';

import { cn } from '@/app/lib/utils';
import {
  Activity,
  Building2,
  CheckSquare,
  MessageCircle,
  User
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/store/hooks';
import Image from 'next/image';
import { ROUTES } from '@/app/lib/route-constants';

const menu = [
  { name: "Chat", icon: MessageCircle, path: ROUTES.CHAT },
  { name: "Tasks", icon: CheckSquare, path: ROUTES.TASKS },
  { name: "Activity", icon: Activity, path: ROUTES.ACTIVITY },
  { name: "Workspace", icon: Building2, path: ROUTES.WORKSPACES },
  { name: "Profile", icon: User, path: ROUTES.PROFILE },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="lg:hidden fixed bottom-1 left-4 right-4 bg-white/80 backdrop-blur-xl border border-zinc-200/50 px-6 py-3 flex items-center justify-between z-50 pb-safe rounded-[28px] shadow-2xl shadow-orange-500/10 mb-2">
      {menu.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.path);

        return (
          <div
            key={item.name}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-300 relative",
              isActive ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            )}>
              {item.name === "Profile" && user?.photoURL ? (
                <div className="relative w-5 h-5">
                  <Image 
                    src={user.photoURL} 
                    alt="Profile" 
                    fill
                    className={cn(
                      "rounded-full object-cover",
                      isActive ? "border-2 border-white" : "border-2 border-transparent"
                    )}
                  />
                </div>
              ) : (
                <Icon size={20} className={cn(isActive ? "animate-pulse-slow font-bold" : "")} />
              )}
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest transition-all duration-300",
              isActive ? "text-orange-600 scale-100 opacity-100" : "text-zinc-400 scale-90 opacity-0 group-hover:opacity-100"
            )}>
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
