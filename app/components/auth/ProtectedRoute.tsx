'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/store/hooks';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If auth listener has finished and user is not authenticated, redirect.
    // if (status === 'unauthenticated') {
    //   router.push('/auth');
    // }
  }, [status, router]);

  // Show a premium loading state while determining auth status
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F4EDE4]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#4A154B]/20 border-t-[#4A154B] rounded-full animate-spin" />
          <p className="text-[#4A154B] font-bold animate-pulse text-sm">Syncing your workspace...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}
