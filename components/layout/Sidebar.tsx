'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  IdCard,
  History,
  ShieldCheck,
  PenTool,
  CreditCard,
  FileText,
  GraduationCap,
  FileEdit,
  BookOpen,
  Headphones,
  Wallet,
  KeyRound,
  Crown,
  X,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setSidebarOpen } from '@/redux/slices/uiSlice';
import { formatMoney } from '@/helpers/format/formatMoney';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  const isAdmin =
    currentUser?.email === 'brinoekanem@gmail.com' || currentUser?.role === 'admin';

  const mainLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4 shrink-0" />, route: '/dashboard' },
    { href: '/verify', label: 'NIN Verification', icon: <IdCard className="h-4 w-4 shrink-0" />, route: '/verify' },
    ...(isAdmin ? [{ href: '/logs', label: 'All-Time History', icon: <History className="h-4 w-4 shrink-0" />, route: '/logs' }] : []),
    { href: '/validation', label: 'NIN Validation', icon: <ShieldCheck className="h-4 w-4 shrink-0" />, route: '/validation' },
    { href: '/personalization', label: 'Personalization', icon: <PenTool className="h-4 w-4 shrink-0" />, route: '/personalization' },
    { href: '/bvn', label: 'BVN Verification', icon: <CreditCard className="h-4 w-4 shrink-0" />, route: '/bvn' },
    { href: '/ipe', label: 'IPE Services', icon: <FileText className="h-4 w-4 shrink-0" />, route: '/ipe' },
    { href: '/jamb', label: 'JAMB Services', icon: <GraduationCap className="h-4 w-4 shrink-0" />, route: '/jamb' },
    { href: '/correction', label: 'Data Correction', icon: <FileEdit className="h-4 w-4 shrink-0" />, route: '/correction' },
  ];

  const supportLinks = [
    { href: '/blog', label: 'Blog', icon: <BookOpen className="h-4 w-4 shrink-0" />, route: '/blog' },
    { href: '/contact', label: 'Contact Us', icon: <Headphones className="h-4 w-4 shrink-0" />, route: '/contact' },
    { href: '/fund', label: 'Fund Wallet', icon: <Wallet className="h-4 w-4 shrink-0" />, route: '/fund' },
    { href: '/change-password', label: 'Change Password', icon: <KeyRound className="h-4 w-4 shrink-0" />, route: '/change-password' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-[260px] p-3 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSidebar}>
              <div className="text-xl font-black tracking-tight select-none">
                <span className="text-[#008751]">my</span>
                <span className="text-[#F2A900]">nin</span>
                <span className="text-[#1b1b1b]">verify</span>
              </div>
            </Link>
            <button
              onClick={closeSidebar}
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3 text-xs">
            {mainLinks.map((item) => {
              const isActive = pathname === item.route || pathname.startsWith(item.route + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-all',
                    isActive
                      ? 'bg-[#e6f5ed] text-[#008751] font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                      isActive ? 'bg-[#008751] text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className="truncate text-sm">{item.label}</span>
                </Link>
              );
            })}

            {/* Support Header */}
            <div className="px-3 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Support
            </div>

            {supportLinks.map((item) => {
              const isActive = pathname === item.route || pathname.startsWith(item.route + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-all',
                    isActive
                      ? 'bg-[#e6f5ed] text-[#008751] font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                      isActive ? 'bg-[#008751] text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className="truncate text-sm">{item.label}</span>
                </Link>
              );
            })}

            {/* System Admin */}
            {isAdmin && (
              <>
                <div className="px-3 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  System Administration
                </div>
                <Link
                  href="/admin"
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2.5 font-medium transition-all',
                    pathname === '/admin'
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-100 text-purple-700">
                      <Crown className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold">Admin Panel</span>
                  </div>
                  <span className="rounded bg-purple-700 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                    Admin
                  </span>
                </Link>
              </>
            )}
          </nav>

          {/* Sidenav Footer: Wallet Widget */}
          <div className="border-t border-black/10 p-3">
            <Link
              href="/fund"
              className="flex items-center gap-3 rounded-xl bg-[#e6f5ed] p-3 transition-colors hover:bg-[#d8efe2]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#008751] text-white shadow-xs">
                <Wallet className="h-4 w-4" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] font-medium text-gray-600">Wallet Balance</span>
                <span className="truncate text-sm font-black text-[#008751]">
                  {formatMoney(currentUser?.wallet_balance)}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
