'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Floating button to view client site */}
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
      >
        <ExternalLink className="h-5 w-5" />
        <span className="font-medium">View Client Site</span>
      </Link>
    </>
  );
}
