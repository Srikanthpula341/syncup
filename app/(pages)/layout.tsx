"use client";

import React from 'react'
import Sidebar from './Sidebar';
import PresenceProvider from '@/app/components/providers/PresenceProvider';
import { useNotifications } from '@/app/hooks/useNotifications';
import WorkspaceSettingsModal from '@/app/components/workspaces/WorkspaceSettingsModal';
import { usePersistence } from '@/app/hooks/usePersistence';
import MobileNav from '@/app/components/navigation/MobileNav';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotifications(); // Phase 9: Global Notifications
  usePersistence(); // Phase 14: Session Persistence
  const pathname = usePathname();

  return (
    <PresenceProvider>
      <div className="flex h-screen overflow-hidden bg-white">
        {/* Sidebar */}
        <aside className="hidden lg:block w-20 lg:w-24 shrink-0 border-r border-zinc-100 bg-white">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-white relative mb-8 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileNav />
      <WorkspaceSettingsModal />
    </PresenceProvider>
  );
}