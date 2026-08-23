'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileCheck2, ShieldCheck, CreditCard, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === '/dashboard',
    },
    {
      label: 'NIN',
      href: '/verify',
      icon: <FileCheck2 className="h-5 w-5" />,
      active: pathname.startsWith('/verify'),
    },
    {
      label: 'Validate',
      href: '/validation',
      icon: <ShieldCheck className="h-5 w-5" />,
      active: pathname.startsWith('/validation'),
    },
    {
      label: 'BVN',
      href: '/bvn',
      icon: <CreditCard className="h-5 w-5" />,
      active: pathname.startsWith('/bvn'),
    },
    {
      label: 'Wallet',
      href: '/fund',
      icon: <Wallet className="h-5 w-5" />,
      active: pathname === '/fund',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-border bg-card/95 px-2 backdrop-blur-md lg:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-colors',
            item.active
              ? 'text-primary font-bold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {item.icon}
          <span className="text-[10px]">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
