'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileBottomNav } from './MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  // If user is on unauthenticated routes (e.g. landing, login, signup) or not logged in, render raw children
  const isAuthOrPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

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
        <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-8 lg:p-8">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
