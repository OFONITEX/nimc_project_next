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
  CheckCircle2,
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
      icon: <IdCard className="h-5 w-5" />,
      bg: 'bg-[#e8f5e9]',
      color: 'text-[#2e7d32]',
      name: 'NIN Verification',
      desc: 'Verify NIN records',
      price: verifyPrice,
    },
    {
      href: '/validation',
      icon: <ShieldCheck className="h-5 w-5" />,
      bg: 'bg-[#e0f2f1]',
      color: 'text-[#00695c]',
      name: 'NIN Validation',
      desc: 'Resolve NIN issues',
      price: valPrice,
    },
    {
      href: '/personalization',
      icon: <PenTool className="h-5 w-5" />,
      bg: 'bg-[#f1f8e9]',
      color: 'text-[#558b2f]',
      name: 'Personalization',
      desc: 'Update NIN details',
      price: '₦1,000',
    },
    {
      href: '/bvn',
      icon: <CreditCard className="h-5 w-5" />,
      bg: 'bg-[#e3f2fd]',
      color: 'text-[#1565c0]',
      name: 'BVN Verification',
      desc: 'Verify BVN records',
      price: verifyPrice,
    },
    {
      href: '/ipe',
      icon: <FileText className="h-5 w-5" />,
      bg: 'bg-[#fff3e0]',
      color: 'text-[#e65100]',
      name: 'IPE Services',
      desc: 'Identity management',
      price: ipePrice,
    },
    {
      href: '/jamb',
      icon: <GraduationCap className="h-5 w-5" />,
      bg: 'bg-[#ede7f6]',
      color: 'text-[#4527a0]',
      name: 'JAMB Services',
      desc: 'JAMB NIN linkage',
      price: '₦1,000',
    },
    {
      href: '/correction',
      icon: <FileEdit className="h-5 w-5" />,
      bg: 'bg-[#fce4ec]',
      color: 'text-[#880e4f]',
      name: 'Data Correction',
      desc: 'Fix incorrect records',
      price: '₦5,000',
    },
    {
      href: '/ai',
      icon: <Bot className="h-5 w-5" />,
      bg: 'bg-[#e8eaf6]',
      color: 'text-[#283593]',
      name: 'AI Assistant',
      desc: 'Get identity help',
      price: 'Free',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── 1. Greeting Banner (Matching myninverify.com) ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#004d2e] to-[#008751] p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Background decorative element */}
        <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full bg-white/5 pointer-events-none" />

        <div className="z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Welcome, {displayName}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Welcome to your identity management portal
          </p>
        </div>

        <div className="z-10 text-left sm:text-right">
          <div className="text-xs font-medium text-white/70">Wallet Balance</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            {formatMoney(liveBalance)}
          </div>
        </div>
      </div>

      {/* ── 2. Stat Cards Grid (4 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Card */}
        <div className="flex items-start gap-4 rounded-xl border border-black/10 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#008751] to-[#00b369] text-white shadow-xs">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Wallet
            </span>
            <span className="truncate text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">
              {formatMoney(liveBalance)}
            </span>
            <span className="text-xs font-semibold text-[#008751] mt-1">
              <Link href="/fund" className="hover:underline">
                Top up &rarr;
              </Link>
            </span>
          </div>
        </div>

        {/* Today's Verifications Card */}
        <div className="flex items-start gap-4 rounded-xl border border-black/10 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-xs">
            <History className="h-5 w-5" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Today&apos;s Verifications
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">
              {todayCount}
            </span>
            <span className="text-xs text-gray-400 mt-1">Past 24 hours</span>
          </div>
        </div>

        {/* Total Verifications Card */}
        <div className="flex items-start gap-4 rounded-xl border border-black/10 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f2a900] text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Total Verifications
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">
              {totalCount}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {isAdmin ? 'All-time portal lookups' : 'All-time checks done'}
            </span>
          </div>
        </div>

        {/* Quick Verify Card */}
        <div className="flex items-start gap-4 rounded-xl border border-black/10 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white shadow-xs">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Quick Verify
            </span>
            <span className="text-base font-extrabold text-gray-900 leading-tight mt-1">
              NIN Lookup
            </span>
            <span className="text-xs font-semibold text-[#008751] mt-1">
              <Link href="/verify" className="hover:underline">
                Start now &rarr;
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. SERVICES Grid ── */}
      <div>
        <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 px-0.5">
          Services
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {services.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              className="flex flex-col gap-2.5 rounded-xl border border-black/10 bg-white p-4 text-left shadow-xs transition-all hover:-translate-y-1 hover:border-[#008751]/30 hover:shadow-md"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg} ${s.color} shadow-2xs`}
              >
                {s.icon}
              </div>
              <div className="font-bold text-sm text-gray-900 leading-snug">{s.name}</div>
              <div className="text-xs text-gray-500 leading-relaxed line-clamp-2">{s.desc}</div>
              <div className="mt-auto pt-1 font-extrabold text-xs text-[#008751]">{s.price}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 4. 24-Hour Verification History Widget ── */}
      <RecentActivityTable userId={currentUser.id} />

      {/* ── 5. RESOURCES Section ── */}
      <div>
        <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 px-0.5">
          Resources
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/blog"
            className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#212121] text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="font-bold text-sm text-gray-900">NIN Blog</div>
            <div className="text-xs text-gray-500">Guides &amp; articles on Medium</div>
          </Link>

          <Link
            href="/contact"
            className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f5e9] text-[#2e7d32]">
              <Headphones className="h-5 w-5" />
            </div>
            <div className="font-bold text-sm text-gray-900">Contact &amp; Support</div>
            <div className="text-xs text-gray-500">WhatsApp, email, social</div>
          </Link>

          <Link
            href="/fund"
            className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e6f5ed] text-[#008751]">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="font-bold text-sm text-gray-900">Fund Wallet</div>
            <div className="text-xs text-gray-500">Add money for services</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
