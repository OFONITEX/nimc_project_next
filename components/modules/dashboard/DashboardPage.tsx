'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Wallet,
  History,
  ShieldCheck,
  Zap,
  IdCard,
  PenTool,
  CreditCard,
  FileText,
  GraduationCap,
  FileEdit,
  Bot,
  BookOpen,
  Headphones,
} from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { formatMoney } from '@/helpers/format/formatMoney';
import { supabase } from '@/lib/supabase/client';
import { RecentActivityTable } from './RecentActivityTable';

export function DashboardPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [todayCount, setTodayCount] = React.useState<number | string>('—');
  const [totalCount, setTotalCount] = React.useState<number | string>('—');
  const [liveBalance, setLiveBalance] = React.useState<number>(0);

  const isAdmin =
    currentUser?.email?.toLowerCase().trim() === 'brinoekanem@gmail.com' ||
    currentUser?.role === 'admin';
  const isAgent = currentUser?.role === 'agent';
  const isAgentOrAdmin = isAdmin || isAgent;

  const getUserFee = () => {
    if (isAdmin) return 100;
    if (isAgent) return 150;
    return 200;
  };

  const verifyPrice = '₦' + getUserFee();
  const valPrice = isAgentOrAdmin ? '₦1,000' : '₦1,500';
  const ipePrice = isAgentOrAdmin ? '₦600' : '₦1,500';

  React.useEffect(() => {
    if (!currentUser?.id) return;
    setLiveBalance(currentUser.wallet_balance || 0);

    async function loadDashboardStats() {
      if (!currentUser?.id) return;

      // 1. Fetch live wallet balance
      try {
        const { data } = await supabase
          .from('users')
          .select('wallet_balance')
          .eq('id', currentUser.id)
          .single();
        if (data?.wallet_balance !== undefined) {
          setLiveBalance(parseFloat(data.wallet_balance) || 0);
        }
      } catch (err) {
        console.warn('Live balance load warning:', err);
      }

      // 2. Fetch Today's 24h count
      try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        let todayQuery = supabase
          .from('verification_history')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', since);
        if (!isAdmin) {
          todayQuery = todayQuery.eq('user_id', currentUser.id);
        }
        const { count } = await todayQuery;
        setTodayCount(count !== null && count !== undefined ? count : 0);
      } catch {
        setTodayCount(0);
      }

      // 3. Fetch Total all-time count
      try {
        let totalQuery = supabase
          .from('verification_history')
          .select('id', { count: 'exact', head: true });
        if (!isAdmin) {
          totalQuery = totalQuery.eq('user_id', currentUser.id);
        }
        const { count } = await totalQuery;
        setTotalCount(count !== null && count !== undefined ? count.toLocaleString() : '0');
      } catch {
        setTotalCount(0);
      }
    }

    loadDashboardStats();
  }, [currentUser?.id, currentUser?.wallet_balance, isAdmin]);

  if (!currentUser) return null;

  const displayName = currentUser.firstname || currentUser.full_name || currentUser.email;

  const services = [
    {
      href: '/verify',
      icon: <IdCard className="h-4 w-4 sm:h-4.5 sm:w-4.5" />,
      bg: 'bg-[#e8f5e9]',
      color: 'text-[#2e7d32]',
      name: 'NIN Verification',
      desc: 'Verify NIN records',
      price: verifyPrice,
    },
    {
      href: '/validation',
      icon: <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />,
      bg: 'bg-[#e0f2f1]',
      color: 'text-[#00695c]',
      name: 'NIN Validation',
      desc: 'Resolve NIN issues',
      price: valPrice,
    },
    {
      href: '/personalization',
      icon: <PenTool className="h-4 w-4 sm:h-4.5 sm:w-4.5" />,
      bg: 'bg-[#f1f8e9]',
      color: 'text-[#558b2f]',
      name: 'Personalization',
      desc: 'Update NIN details',
      price: '₦1,000',
    },
    {
      href: '/bvn',
      icon: <CreditCard className="h-4 w-4 sm:h-4.5 sm:w-4.5" />,
      bg: 'bg-[#e3f2fd]',
      color: 'text-[#1565c0]',
      name: 'BVN Verification',
      desc: 'Verify BVN records',
      price: verifyPrice,
    },
    {
      href: '/ipe',
      icon: <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5" />,
      bg: 'bg-[#fff3e0]',
      color: 'text-[#e65100]',
      name: 'IPE Services',
      desc: 'Identity management',
      price: ipePrice,
    },
    {
      href: '/jamb',
      icon: <GraduationCap className="h-4 w-4 sm:h-4.5 sm:w-4.5" />,
      bg: 'bg-[#ede7f6]',
      color: 'text-[#4527a0]',
      name: 'JAMB Services',
      desc: 'JAMB NIN linkage',
      price: '₦1,000',
    },
    {
      href: '/correction',
      icon: <FileEdit className="h-4 w-4 sm:h-4.5 sm:w-4.5" />,
      bg: 'bg-[#fce4ec]',
      color: 'text-[#880e4f]',
      name: 'Data Correction',
      desc: 'Fix incorrect records',
      price: '₦5,000',
    },
    {
      href: '/ai',
      icon: <Bot className="h-4 w-4 sm:h-4.5 sm:w-4.5" />,
      bg: 'bg-[#e8eaf6]',
      color: 'text-[#283593]',
      name: 'AI Assistant',
      desc: 'Get identity help',
      price: 'Free',
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* ── 1. Greeting Banner (Compact & Well-proportioned) ── */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#004d2e] to-[#008751] px-4 py-4 sm:px-6 sm:py-5 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="z-10">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Welcome, {displayName}
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Welcome to your identity management portal
          </p>
        </div>

        <div className="z-10 text-left sm:text-right">
          <div className="text-[11px] font-medium text-white/70">Wallet Balance</div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {formatMoney(liveBalance)}
          </div>
        </div>
      </div>

      {/* ── 2. Stat Cards Grid (Proportional & Fitted to Text) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Wallet Card */}
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 sm:p-3.5 shadow-2xs transition-all hover:shadow-xs hover:-translate-y-0.5">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#008751] to-[#00b369] text-white shadow-2xs">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">
              Wallet
            </span>
            <span className="truncate text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">
              {formatMoney(liveBalance)}
            </span>
            <span className="text-[11px] font-semibold text-[#008751] leading-tight">
              <Link href="/fund" className="hover:underline">
                Top up &rarr;
              </Link>
            </span>
          </div>
        </div>

        {/* Today's Verifications Card */}
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 sm:p-3.5 shadow-2xs transition-all hover:shadow-xs hover:-translate-y-0.5">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-2xs">
            <History className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">
              Today&apos;s Lookups
            </span>
            <span className="truncate text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">
              {todayCount}
            </span>
            <span className="text-[11px] text-gray-400 leading-tight">Past 24 hours</span>
          </div>
        </div>

        {/* Total Verifications Card */}
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 sm:p-3.5 shadow-2xs transition-all hover:shadow-xs hover:-translate-y-0.5">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#f2a900] text-white shadow-2xs">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">
              Total Verifications
            </span>
            <span className="truncate text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">
              {totalCount}
            </span>
            <span className="text-[11px] text-gray-400 leading-tight truncate">
              {isAdmin ? 'All-time total' : 'All-time checks'}
            </span>
          </div>
        </div>

        {/* Quick Verify Card */}
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 sm:p-3.5 shadow-2xs transition-all hover:shadow-xs hover:-translate-y-0.5">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white shadow-2xs">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">
              Quick Verify
            </span>
            <span className="truncate text-xs sm:text-sm font-bold text-gray-900 leading-tight">
              NIN Lookup
            </span>
            <span className="text-[11px] font-semibold text-[#008751] leading-tight">
              <Link href="/verify" className="hover:underline">
                Start now &rarr;
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. SERVICES Grid (Properly sized cards hugging text) ── */}
      <div>
        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 px-0.5">
          Services
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {services.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              className="group flex flex-col justify-between rounded-xl border border-black/10 bg-white p-3 sm:p-3.5 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#008751]/40 hover:shadow-xs"
            >
              <div>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg} ${s.color} mb-2 transition-transform group-hover:scale-105`}
                >
                  {s.icon}
                </div>
                <div className="font-bold text-xs sm:text-sm text-gray-900 leading-snug group-hover:text-[#008751] transition-colors">
                  {s.name}
                </div>
                <div className="text-[11px] text-gray-500 leading-tight line-clamp-1 mt-0.5">
                  {s.desc}
                </div>
              </div>
              <div className="mt-2 pt-1 font-black text-xs text-[#008751] border-t border-black/5">
                {s.price}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 4. 24-Hour Verification History Widget ── */}
      <RecentActivityTable userId={currentUser.id} />

      {/* ── 5. RESOURCES Section ── */}
      <div>
        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 px-0.5">
          Resources
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          <Link
            href="/blog"
            className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-xs"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#212121] text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">NIN Blog</span>
              <span className="text-[11px] text-gray-500 truncate">Guides &amp; articles on Medium</span>
            </div>
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-xs"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f5e9] text-[#2e7d32]">
              <Headphones className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">Contact &amp; Support</span>
              <span className="text-[11px] text-gray-500 truncate">WhatsApp, email, social</span>
            </div>
          </Link>

          <Link
            href="/fund"
            className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-xs"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e6f5ed] text-[#008751]">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">Fund Wallet</span>
              <span className="text-[11px] text-gray-500 truncate">Add money for services</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
