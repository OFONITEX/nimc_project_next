'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Wallet,
  Shield,
  Server,
  FileCheck2,
  CreditCard,
  ShieldCheck,
  IdCard,
  PlusCircle,
  Crown,
  UserCheck,
  User,
  CheckCircle2,
} from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { formatMoney } from '@/helpers/format/formatMoney';
import { Card } from '@/components/ui/atoms/Card';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { RecentActivityTable } from './RecentActivityTable';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';

export function DashboardPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  if (!currentUser) return null;

  const isAdmin =
    currentUser.email === 'brinoekanem@gmail.com' || currentUser.role === 'admin';
  const isAgent = currentUser.role === 'agent';

  const quickServices = [
    {
      title: 'NIN Verification',
      desc: 'NIN, Phone & Demographics',
      href: '/verify',
      icon: <FileCheck2 className="h-6 w-6 text-sky-600" />,
      bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60',
    },
    {
      title: 'BVN Verification',
      desc: 'Basic, Plastic & Regular Pro',
      href: '/bvn',
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60',
    },
    {
      title: 'NIN Validation',
      desc: 'No-Record & SIM Validation',
      href: '/validation',
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60',
    },
    {
      title: 'Personalization',
      desc: 'V1 & V2 Slip Personalization',
      href: '/personalization',
      icon: <IdCard className="h-6 w-6 text-amber-600" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60',
    },
  ];

  return (
    <ContentWidthContainer variant="full" className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Welcome back, {currentUser.firstname || currentUser.full_name}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Identity Verification &amp; Portal Dashboard ({currentUser.email})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/fund">
            <Button variant="default" className="gap-2 shadow-sm font-bold">
              <PlusCircle className="h-4 w-4" /> Fund Wallet
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Wallet Balance Card */}
        <Card className="p-5 border-l-4 border-l-primary flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Wallet Balance
            </div>
            <div className="text-2xl font-black text-foreground">
              {formatMoney(currentUser.wallet_balance)}
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wallet className="h-6 w-6" />
          </div>
        </Card>

        {/* Account Role Card */}
        <Card className="p-5 border-l-4 border-l-purple-600 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Account Role
            </div>
            <div className="pt-1">
              {isAdmin ? (
                <Badge variant="admin" className="px-3 py-1 text-xs">
                  <Crown className="mr-1 h-3.5 w-3.5 text-amber-300" /> Super Admin
                </Badge>
              ) : isAgent ? (
                <Badge variant="agent" className="px-3 py-1 text-xs">
                  <UserCheck className="mr-1 h-3.5 w-3.5" /> Verified Agent
                </Badge>
              ) : (
                <Badge variant="secondary" className="px-3 py-1 text-xs">
                  <User className="mr-1 h-3.5 w-3.5" /> Standard Operator
                </Badge>
              )}
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
            <Shield className="h-6 w-6" />
          </div>
        </Card>

        {/* System Status Card */}
        <Card className="p-5 border-l-4 border-l-emerald-600 flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              API &amp; System Status
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <CheckCircle2 className="h-4 w-4" /> 100% Operational
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Server className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* Quick Access Services */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground px-1">
          Identity Services &amp; Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickServices.map((service) => (
            <Link key={service.title} href={service.href} className="group">
              <Card className="p-4 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md border-border/80">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${service.bg}`}
                >
                  {service.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{service.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable userId={currentUser.id} />
    </ContentWidthContainer>
  );
}
