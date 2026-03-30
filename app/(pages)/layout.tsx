"use client";

import React from 'react'
import Sidebar from './Sidebar';
import PresenceProvider from '@/app/components/providers/PresenceProvider';
import { useNotifications } from '@/app/hooks/useNotifications';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotifications(); // Phase 9: Global Notifications
  
  return (
    <PresenceProvider>
      <div className="flex h-screen overflow-hidden bg-white">
        {/* Sidebar */}
        <aside className="w-20 lg:w-24 shrink-0 border-r border-zinc-100 bg-white">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white relative">
          {children}
        </main>
      </div>
    </PresenceProvider>
  );
}