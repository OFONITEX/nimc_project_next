'use client';

import * as React from 'react';
import Link from 'next/link';
import { Eye, Clock, CheckCircle2, Search } from 'lucide-react';
import { useGetVerificationHistoryQuery } from '@/redux/api/verificationApi';
import { InsetPanel } from '@/components/ui/molecules/InsetPanel';
import { Skeleton } from '@/components/ui/atoms/Skeleton';
import { formatMoney } from '@/helpers/format/formatMoney';
import { formatDateTime } from '@/helpers/format/formatDateTime';
import { Button } from '@/components/ui/atoms/Button';

export interface RecentActivityTableProps {
  userId: string;
}

export function RecentActivityTable({ userId }: RecentActivityTableProps) {
  const { data: history = [], isLoading, isError } = useGetVerificationHistoryQuery(userId, {
    skip: !userId,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Recent Verification Activity
        </h3>
        <Link
          href="/logs"
          className="text-xs font-semibold text-primary hover:underline hover:text-primary-hover"
        >
          View All Logs
        </Link>
      </div>

      <InsetPanel
        data-testid="recent-activity-panel"
        footer={
          history.length > 0 ? (
            <span>Showing recent {history.length} verification record(s)</span>
          ) : undefined
        }
      >
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-xs text-destructive">
            Failed to load verification history. Please refresh the page.
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
              <Search className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">No verification records found</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Perform your first NIN or BVN lookup from the services menu above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Target ID / Value</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date &amp; Time</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {history.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-foreground">
                      {(row.service_type || row.verification_type || 'NIN').toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">
                      {row.query_value || row.nin_query || row.phone_query || '—'}
                    </td>
                    <td className="px-4 py-3 font-black text-sky-600 dark:text-sky-400">
                      {formatMoney(row.amount_charged || 300)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(row.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href="/verify">
                        <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px]">
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
    </div>
  );
}
