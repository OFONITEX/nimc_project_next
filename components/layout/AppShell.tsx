'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileBottomNav } from './MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const cleanPath = (pathname?.replace(/\/+$/, '') || '') || '/';
  const isAuthOrPublicPage =
    cleanPath === '/' ||
    cleanPath === '/login' ||
    cleanPath === '/signup' ||
    cleanPath === '/forgot-password' ||
    cleanPath === '/reset-password';

  React.useEffect(() => {
    if (!isLoading && !currentUser && !isAuthOrPublicPage) {
      router.replace('/login');
    }
  }, [isLoading, currentUser, isAuthOrPublicPage, router]);

  React.useEffect(() => {
    if (
      !isLoading &&
      currentUser &&
      (cleanPath === '/login' || cleanPath === '/signup' || cleanPath === '/forgot-password')
    ) {
      router.replace('/dashboard');
    }
  }, [isLoading, currentUser, cleanPath, router]);

  if (isAuthOrPublicPage || !currentUser) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col transition-all duration-300 lg:pl-[270px]">
        <Topbar />
        <main className="flex-1 p-2.5 pb-20 sm:p-5 sm:pb-8 lg:p-8">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
