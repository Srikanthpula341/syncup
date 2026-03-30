'use client';

import { useHeartbeat } from '@/app/hooks/useHeartbeat';

export default function PresenceProvider({ children }: { children: React.ReactNode }) {
  useHeartbeat();
  return <>{children}</>;
}
