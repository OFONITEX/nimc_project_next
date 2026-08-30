'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Crown,
  Lock,
  UserPlus,
  Users,
  AlertCircle,
  CheckCircle2,
  History,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  FileText,
} from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import {
  useGetAdminUsersQuery,
  useGetAdminVerificationHistoryQuery,
  useGetAdminVerificationStatsQuery,
} from '@/redux/api/adminApi';
import { supabase } from '@/lib/supabase/client';
import { AddAgentFormValues } from '@/schemas/admin';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { formatMoney } from '@/helpers/format/formatMoney';
import { UsersTable } from './UsersTable';
import { AddAgentForm } from './AddAgentForm';
import { AdminHistoryTable } from './AdminHistoryTable';

export function AdminDashboardPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [activeTab, setActiveTab] = React.useState<'history' | 'users' | 'agent'>('history');

  const { data: users = [], isLoading: isUsersLoading, refetch: refetchUsers } = useGetAdminUsersQuery();
  const {
    data: history = [],
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useGetAdminVerificationHistoryQuery({ allTime: true });
  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetAdminVerificationStatsQuery();

  const [statusMessage, setStatusMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const isAdmin =
    currentUser &&
    (currentUser.email?.toLowerCase().trim() === 'brinoekanem@gmail.com' ||
      currentUser.role === 'admin');

  const handleRefreshAll = () => {
    refetchHistory();
    refetchUsers();
    refetchStats();
  };

  if (!isAdmin) {
    return (
      <ContentWidthContainer variant="narrow" className="py-8">
        <Card className="p-4 text-center shadow-xs border border-border">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Access Restricted</h3>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            This Admin Management Portal is reserved exclusively for the platform administrator (
            <strong>brinoekanem@gmail.com</strong>).
          </p>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="text-xs">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </ContentWidthContainer>
    );
  }

  const handleAddOrUpdateAgent = async (values: AddAgentFormValues) => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const { data: userProfile, error: findError } = await supabase
        .from('users')
        .select('id')
        .eq('email', values.email.trim())
        .single();

      if (findError || !userProfile) {
        setStatusMessage({
          text: `User with email "${values.email}" not found in database. User must sign up first.`,
          type: 'error',
        });
        setIsSaving(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: values.role,
          agent_nin_price: values.agentNinPrice,
          agent_bvn_price: values.agentBvnPrice,
        })
        .eq('id', userProfile.id);

      if (updateError) {
        setStatusMessage({ text: updateError.message, type: 'error' });
      } else {
        setStatusMessage({
          text: `Successfully updated role and pricing for ${values.email}!`,
          type: 'success',
        });
        refetchUsers();
      }
    } catch {
      setStatusMessage({ text: 'Network error updating agent profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* ── 1. Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500 shrink-0" />
            Admin Management Portal
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Platform audit trail, global verification stream, agent pricing &amp; user management.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshAll}
          className="text-xs h-8 self-start sm:self-auto bg-white"
        >
          Refresh All
        </Button>
      </div>

      {/* ── 2. Admin Metric Overview Cards (2 per row mobile, 4 on desktop) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 items-start">
        {/* Total Lookups */}
        <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#008751] to-[#00b369] text-white shadow-2xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 truncate">
              Total Lookups
            </span>
            <span className="truncate text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">
              {isStatsLoading ? '—' : (stats?.totalLookups || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 leading-none truncate">All-time portal</span>
          </div>
        </div>

        {/* Today's 24h Lookups */}
        <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-2xs">
            <History className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 truncate">
              Today (24h)
            </span>
            <span className="truncate text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">
              {isStatsLoading ? '—' : (stats?.todayLookups || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 leading-none truncate">Past 24 hours</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white shadow-2xs">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 truncate">
              Registered Users
            </span>
            <span className="truncate text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">
              {isStatsLoading ? '—' : (stats?.totalUsers || users.length || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 leading-none truncate">Operators &amp; Agents</span>
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#f2a900] text-white shadow-2xs">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 truncate">
              Total Volume
            </span>
            <span className="truncate text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">
              {isStatsLoading ? '—' : formatMoney(stats?.totalRevenue || 0)}
            </span>
            <span className="text-xs text-[#008751] font-semibold leading-none truncate">Recorded fees</span>
          </div>
        </div>
      </div>

      {/* ── 3. Navigation Tabs ── */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-black/10 pb-2">
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('history')}
          className="gap-1.5 text-xs h-8"
        >
          <History className="h-3.5 w-3.5" />
          Verification Audit Stream ({history.length})
        </Button>

        <Button
          variant={activeTab === 'users' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('users')}
          className="gap-1.5 text-xs h-8"
        >
          <Users className="h-3.5 w-3.5" />
          Users &amp; Agents Roster ({users.length})
        </Button>

        <Button
          variant={activeTab === 'agent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('agent')}
          className="gap-1.5 text-xs h-8"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Assign Agent Role &amp; Pricing
        </Button>
      </div>

      {/* ── 4. Status Notification ── */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs ${
            statusMessage.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* ── 5. Tab Content ── */}
      {activeTab === 'history' && (
        <AdminHistoryTable
          history={history}
          isLoading={isHistoryLoading}
          onRefresh={refetchHistory}
        />
      )}

      {activeTab === 'users' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#008751]" />
              Registered Portal Users &amp; Agents
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchUsers()}
              className="text-xs h-8 bg-white"
            >
              Refresh Roster
            </Button>
          </div>
          <UsersTable users={users} isLoading={isUsersLoading} />
        </div>
      )}

      {activeTab === 'agent' && (
        <Card className="p-3 sm:p-4 border-t-4 border-t-purple-600 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-black/10">
            <UserPlus className="h-4 w-4 text-purple-600" />
            <h3 className="text-xs sm:text-sm font-bold text-gray-900">
              Assign Agent Role &amp; Custom Lookup Pricing
            </h3>
          </div>
          <AddAgentForm onSubmit={handleAddOrUpdateAgent} isLoading={isSaving} />
        </Card>
      )}
    </div>
  );
}
