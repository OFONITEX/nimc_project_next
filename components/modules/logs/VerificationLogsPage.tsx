'use client';

import * as React from 'react';
import Link from 'next/link';
import { History, Search, Eye } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { useGetVerificationHistoryQuery } from '@/redux/api/verificationApi';
import { InsetPanel } from '@/components/ui/molecules/InsetPanel';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { Button } from '@/components/ui/atoms/Button';
import { Skeleton } from '@/components/ui/atoms/Skeleton';
import { formatMoney } from '@/helpers/format/formatMoney';
import { formatDateTime } from '@/helpers/format/formatDateTime';

export function VerificationLogsPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { data: history = [], isLoading, refetch } = useGetVerificationHistoryQuery(
    currentUser?.id || '',
    { skip: !currentUser?.id }
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');

  const filteredHistory = React.useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        (item.query_value || item.nin_query || item.phone_query || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const itemType = (item.service_type || item.verification_type || 'NIN').toLowerCase();
      const matchesFilter = filterType === 'all' || itemType.includes(filterType.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [history, searchTerm, filterType]);

  if (!currentUser) return null;

  return (
    <ContentWidthContainer variant="full" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary shrink-0" />
            Verification History &amp; Audit Logs
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete transaction history of all identity queries performed on your operator account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs h-8">
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by NIN, Phone number, or Target ID..."
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All Services</option>
            <option value="nin">NIN Verifications</option>
            <option value="bvn">BVN Verifications</option>
            <option value="phone">Phone Lookups</option>
          </select>
        </div>
      </div>

      {/* Inset Panel Table */}
      <InsetPanel
        data-testid="verification-logs-panel"
        footer={
          <span>
            Showing {filteredHistory.length} of {history.length} total verification records
          </span>
        }
      >
        {isLoading ? (
          <div className="p-3 space-y-2.5">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-5 text-center text-xs text-muted-foreground">
            No verification audit logs match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-3.5 py-2.5">Service Type</th>
                  <th className="px-3.5 py-2.5">Queried Value / ID</th>
                  <th className="px-3.5 py-2.5">Amount Charged</th>
                  <th className="px-3.5 py-2.5">Status</th>
                  <th className="px-3.5 py-2.5">Timestamp</th>
                  <th className="px-3.5 py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3.5 py-2 font-bold text-foreground">
                      {(row.service_type || row.verification_type || 'NIN').toUpperCase()}
                    </td>
                    <td className="px-3.5 py-2 text-muted-foreground font-mono">
                      {row.query_value || row.nin_query || row.phone_query || '—'}
                    </td>
                    <td className="px-3.5 py-2 font-black text-sky-600 dark:text-sky-400">
                      {formatMoney(row.amount_charged || 200)}
                    </td>
                    <td className="px-3.5 py-2">
                      <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-green-700">
                        SUCCESSFUL
                      </span>
                    </td>
                    <td className="px-3.5 py-2 text-muted-foreground">
                      {formatDateTime(row.created_at)}
                    </td>
                    <td className="px-3.5 py-2 text-center">
                      <Link href="/verify">
                        <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]">
                          <Eye className="mr-1 h-3 w-3" /> View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </InsetPanel>
    </ContentWidthContainer>
  );
}
