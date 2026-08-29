'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, Search, Wallet, Plus, LogOut, Crown, UserCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleSidebar } from '@/redux/slices/uiSlice';
import { clearAuth } from '@/redux/slices/authSlice';
import { supabase } from '@/lib/supabase/client';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { formatMoney } from '@/helpers/format/formatMoney';
import { Badge } from '@/components/ui/atoms/Badge';

export function Topbar() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  if (!currentUser) return null;

  const isAdmin =
    currentUser.email === 'brinoekanem@gmail.com' || currentUser.role === 'admin';
  const isAgent = currentUser.role === 'agent';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-xl border border-border p-2 text-foreground hover:bg-muted lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search identity services..."
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Topbar Actions: Wallet & Profile */}
      <div className="flex items-center gap-3">
        {/* Wallet Chip */}
        <Link
          href="/fund"
          className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary-light/50 px-3 py-1.5 transition-all hover:bg-primary-light"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
            <Wallet className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Balance
            </span>
            <span className="text-xs font-black text-foreground">
              {formatMoney(currentUser.wallet_balance)}
            </span>
          </div>
          <div className="ml-1 rounded-md bg-primary/10 p-1 text-primary hover:bg-primary/20 transition-colors">
            <Plus className="h-3 w-3" />
          </div>
        </Link>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <Avatar name={currentUser.full_name || currentUser.email} size="sm" />
          <div className="hidden md:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground">
                {currentUser.firstname || currentUser.full_name}
              </span>
              {isAdmin && (
                <Badge variant="admin" className="text-[8px] px-1.5 py-0">
                  <Crown className="mr-0.5 h-2.5 w-2.5 text-amber-300" /> Admin
                </Badge>
              )}
              {!isAdmin && isAgent && (
                <Badge variant="agent" className="text-[8px] px-1.5 py-0">
                  <UserCheck className="mr-0.5 h-2.5 w-2.5" /> Agent
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
              {currentUser.email}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-1"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
