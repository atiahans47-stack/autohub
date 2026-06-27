'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ToastInner() {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'registered') {
      setToast({ message: 'Account created successfully! Welcome 🎉', type: 'success' });
    } else if (success === 'login') {
      setToast({ message: 'Logged in successfully! Welcome back 👋', type: 'success' });
    } else if (error === 'unauthorized') {
      setToast({ message: 'You are not authorized to access that page.', type: 'error' });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!toast) return;
    if (toast.type === 'success') {
      // Auto-dismiss success after 2 seconds
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
    // Error toasts stay until manually closed
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in ${
      toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {toast.type === 'success' ? (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="font-medium text-sm">{toast.message}</span>
      {toast.type === 'error' && (
        <button
          onClick={() => setToast(null)}
          className="ml-2 text-white hover:text-gray-200 font-bold text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function SuccessToast() {
  return (
    <Suspense fallback={null}>
      <ToastInner />
    </Suspense>
  );
}
