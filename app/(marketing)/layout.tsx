'use client';

import React from 'react';
import { Navbar } from '@/app/components/landing/Navbar';
import FooterComponent from '@/app/components/footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#1A1A1A] font-sans flex flex-col">
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <FooterComponent />
    </div>
  );
}
