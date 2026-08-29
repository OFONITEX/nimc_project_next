'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, IdCard, ShieldCheck, CreditCard, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: <Home className="h-5 w-5" />, active: pathname === '/dashboard' },
    { label: 'NIN', href: '/verify', icon: <IdCard className="h-5 w-5" />, active: pathname.startsWith('/verify') },
    { label: 'Validate', href: '/validation', icon: <ShieldCheck className="h-5 w-5" />, active: pathname.startsWith('/validation') },
    { label: 'BVN', href: '/bvn', icon: <CreditCard className="h-5 w-5" />, active: pathname.startsWith('/bvn') },
    { label: 'Wallet', href: '/fund', icon: <Wallet className="h-5 w-5" />, active: pathname === '/fund' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-black/10 bg-white shadow-lg lg:hidden px-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors',
            item.active
              ? 'text-[#008751]'
              : 'text-gray-400 hover:text-gray-700'
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
