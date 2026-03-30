'use client';

import React from 'react';
import { useUserStatus } from '@/app/hooks/useUserStatus';
import { cn } from '@/app/lib/utils';

interface PresenceBadgeProps {
  uid: string;
  className?: string;
  showTooltip?: boolean;
}

export default function PresenceBadge({ uid, className, showTooltip = true }: PresenceBadgeProps) {
  const { isOnline, statusText } = useUserStatus(uid);

  return (
    <div className={cn("relative group inline-flex", className)}>
      <div 
        className={cn(
          "w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-black/5 transition-all duration-500",
          isOnline 
            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" 
            : "bg-zinc-300 shadow-none"
        )}
      />
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 border border-zinc-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
           <div className="flex items-center gap-1.5">
              <div className={cn("w-1 h-1 rounded-full", isOnline ? "bg-green-400" : "bg-zinc-400")} />
              {statusText}
           </div>
           {/* Tooltip Arrow */}
           <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-zinc-900 rotate-45 border-r border-b border-zinc-800 -translate-y-1/2" />
        </div>
      )}
    </div>
  );
}
