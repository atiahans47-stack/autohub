'use client';

import { usePathname } from 'next/navigation';
import LiveChat from './LiveChat';

export default function ConditionalLiveChat() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return <LiveChat />;
}
