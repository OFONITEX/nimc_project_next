'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  ShieldCheck,
  Crown,
  FileCheck2,
  GraduationCap,
  History,
  X,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setSidebarOpen } from '@/redux/slices/uiSlice';
import { Badge } from '@/components/ui/atoms/Badge';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: string;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  const isAdmin =
    currentUser?.email === 'brinoekanem@gmail.com' || currentUser?.role === 'admin';

  const navCategories: NavCategory[] = [
    {
      category: 'MAIN NAVIGATION',
      items: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
          active: pathname === '/dashboard',
        },
      ],
    },
    {
      category: 'IDENTITY SERVICES',
      items: [
        {
          label: 'NIN Verification',
          href: '/verify',
          icon: <FileCheck2 className="h-4 w-4 shrink-0" />,
          badge: 'LIVE',
          active: pathname.startsWith('/verify'),
        },
        {
          label: 'NIN Validation',
          href: '/validation',
          icon: <ShieldCheck className="h-4 w-4 shrink-0" />,
          badge: 'LIVE',
          active: pathname.startsWith('/validation'),
        },
        {
          label: 'BVN Verification',
          href: '/bvn',
          icon: <CreditCard className="h-4 w-4 shrink-0" />,
          badge: 'LIVE',
          active: pathname.startsWith('/bvn'),
        },
      ],
    },
    {
      category: 'PORTAL SERVICES',
      items: [
        {
          label: 'JAMB Services',
          href: '/jamb',
          icon: <GraduationCap className="h-4 w-4 shrink-0" />,
          active: pathname === '/jamb',
        },
      ],
    },
    {
      category: 'ACCOUNT & WALLET',
      items: [
        {
          label: 'Fund Wallet',
          href: '/fund',
          icon: <Wallet className="h-4 w-4 shrink-0" />,
          active: pathname === '/fund',
        },
        {
          label: 'Verification Logs',
          href: '/logs',
          icon: <History className="h-4 w-4 shrink-0" />,
          active: pathname === '/logs',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidenav Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-[270px] p-3 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {/* Sidenav Header */}
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <Link href="/dashboard" className="flex items-center gap-3" onClick={closeSidebar}>
              <div className="h-10 w-10 overflow-hidden rounded-xl shadow-xs border border-border">
                <img
                  src="/img/ofonitech_logo.jpg"
                  alt="OFONiTech Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight text-foreground">
                  OFONITECH SOLUTIONZ
                </span>
                <span className="text-[10px] font-semibold text-primary">
                  myninverify.com
                </span>
              </div>
            </Link>
            <button
              onClick={closeSidebar}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-5 overflow-y-auto p-3 text-xs">
            {navCategories.map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-muted-foreground">
                  {group.category}
                </div>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-3 py-2.5 font-medium transition-colors',
                      item.active
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider',
                          item.active
                            ? 'bg-white/20 text-white'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}

            {/* Admin Management Section */}
            {isAdmin && (
              <div className="space-y-1 pt-1 border-t border-border/50">
                <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-muted-foreground">
                  SYSTEM ADMINISTRATION
                </div>
                <Link
                  href="/admin"
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 font-medium transition-colors',
                    pathname === '/admin'
                      ? 'bg-purple-700 text-white font-semibold shadow-xs'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Crown className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Admin &amp; Agents</span>
                  </div>
                  <Badge variant="admin" className="text-[9px] px-1.5 py-0">
                    ADMIN
                  </Badge>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
