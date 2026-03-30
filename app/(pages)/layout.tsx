import React from 'react'
import Sidebar from './Sidebar';
import PresenceProvider from '@/app/components/providers/PresenceProvider';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PresenceProvider>
      <div className="flex h-screen overflow-hidden bg-white">
        {/* Sidebar */}
        <aside className="w-20 lg:w-24 flex-shrink-0 border-r border-zinc-100 bg-white">
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