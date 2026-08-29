'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut, Crown, UserCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleSidebar } from '@/redux/slices/uiSlice';
import { clearAuth } from '@/redux/slices/authSlice';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/helpers/format/getInitials';

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  if (!currentUser) return null;

  const isAdmin =
    currentUser.email === 'brinoekanem@gmail.com' || currentUser.role === 'admin';
  const isAgent = currentUser.role === 'agent';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
    router.push('/login');
  };

  const getPageTitle = (path: string) => {
    if (path.startsWith('/verify')) return 'NIN Verification';
    if (path.startsWith('/validation')) return 'NIN Validation';
    if (path.startsWith('/personalization')) return 'Personalization';
    if (path.startsWith('/bvn')) return 'BVN Verification';
    if (path.startsWith('/ipe')) return 'IPE Services';
    if (path.startsWith('/jamb')) return 'JAMB Services';
    if (path.startsWith('/fund')) return 'Fund Wallet';
    if (path.startsWith('/logs')) return 'Verification Logs';
    if (path.startsWith('/admin')) return 'Admin Panel';
    if (path.startsWith('/change-password')) return 'Change Password';
    if (path.startsWith('/contact')) return 'Contact Us';
    if (path.startsWith('/blog')) return 'Blog';
    return 'Dashboard';
  };

  const initials = getInitials(currentUser.full_name || currentUser.email);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-black/10 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-400">Pages</span>
          <span className="opacity-40">›</span>
          <span className="font-semibold text-gray-900">{getPageTitle(pathname)}</span>
        </div>
      </div>

      {/* Right: User Profile, Role Badge, Initials & Logout */}
      <div className="flex items-center gap-3">
        {/* Name */}
        <span className="hidden sm:inline-block text-xs font-semibold text-gray-800">
          {currentUser.firstname || currentUser.full_name}
        </span>

        {/* Role Badge */}
        {isAdmin && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
            <Crown className="h-3 w-3 text-amber-300" /> Admin
          </span>
        )}
        {!isAdmin && isAgent && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-600 to-sky-800 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
            <UserCheck className="h-3 w-3" /> Agent
          </span>
        )}

        {/* Avatar Circle */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#008751] text-xs font-bold text-white shadow-xs">
          {initials}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
