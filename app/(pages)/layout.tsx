import React from 'react'
import Sidebar from './Sidebar';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {



  return (
    <>
       <div className="flex h-screen overflow-hidden">

          {/* Sidebar - fixed 40px */}
          <div className="w-[px] flex-shrink-0 bg-[#150]">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-white">
            {children}
          </main>

           </div>
    </>
  );
}