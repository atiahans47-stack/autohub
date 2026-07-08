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
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all hover:scale-105 text-sm"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="font-medium">View Client Site</span>
      </Link>
    </>
  );
}
