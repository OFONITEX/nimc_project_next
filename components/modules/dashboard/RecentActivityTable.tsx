'use client';

import * as React from 'react';
import Link from 'next/link';
import { History, ShieldCheck, Eye, FolderOpen, Clock } from 'lucide-react';
import { useGetVerificationHistoryQuery } from '@/redux/api/verificationApi';
import { formatMoney } from '@/helpers/format/formatMoney';

export interface RecentActivityTableProps {
  userId: string;
}

export function RecentActivityTable({ userId }: RecentActivityTableProps) {
  const { data: history = [], isLoading, isError } = useGetVerificationHistoryQuery(userId, {
    skip: !userId,
  });

  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getServiceBadgeStyle = (type?: string) => {
    const t = (type || 'nin').toLowerCase();
    if (t.includes('phone')) return 'bg-[#e0f7f4] text-[#00897b]';
    if (t.includes('demo')) return 'bg-[#f3e5f5] text-[#8e24aa]';
    if (t.includes('bvn')) return 'bg-[#e3f2fd] text-[#1565c0]';
    return 'bg-[#e8f0fe] text-[#3c4fe0]';
  };

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xs">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-black/10 px-4 py-3 sm:px-5 sm:py-3.5 gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-900">
            <History className="h-4 w-4 text-[#008751]" />
            24-Hour Verification History
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Verifications from the past 24 hours (automatically cleared after 24h)
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#008751]/20 bg-[#e6f5ed] px-2.5 py-0.5 text-[10px] font-bold text-[#008751]">
          <ShieldCheck className="h-3 w-3" /> 24h Retention
        </span>
      </div>

      {/* Table Body */}
      {isLoading ? (
        <div className="p-6 text-center text-xs text-gray-400">
          <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#008751]" />
          Loading 24h history...
        </div>
      ) : isError ? (
        <div className="p-4 text-center text-xs font-semibold text-red-500">
          Could not load verification history. Please refresh the page.
        </div>
      ) : history.length === 0 ? (
        <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center text-gray-500">
          <FolderOpen className="h-8 w-8 text-gray-300 mb-1.5" />
          <p className="text-xs sm:text-sm font-bold text-gray-800">No verifications in the last 24 hours</p>
          <p className="text-[11px] text-gray-400 mt-0.5 max-w-sm">
            Your verified records will appear here for 24 hours after lookup.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 bg-gray-50 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="px-3.5 py-2.5">Time &amp; Expiry</th>
                <th className="px-3.5 py-2.5">Service</th>
                <th className="px-3.5 py-2.5">Target / Ref</th>
                <th className="px-3.5 py-2.5">Verified Name</th>
                <th className="px-3.5 py-2.5">Fee</th>
                <th className="px-3.5 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {history.map((row) => {
                const createdMs = new Date(row.created_at).getTime();
                const expireMs = row.expires_at
                  ? new Date(row.expires_at).getTime()
                  : createdMs + 24 * 60 * 60 * 1000;
                const remainingMs = Math.max(0, expireMs - now);
                const remHours = Math.floor(remainingMs / (1000 * 60 * 60));
                const remMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
                const timeRemainingStr =
                  remainingMs > 0 ? `${remHours}h ${remMins}m left` : 'Expired';

                const nameStr =
                  [row.first_name, row.middle_name, row.last_name]
                    .filter(Boolean)
                    .join(' ') || '—';

                return (
                  <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3.5 py-2">
                      <div className="font-bold text-gray-900 text-xs">
                        {new Date(row.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
                        <Clock className="h-2.5 w-2.5" /> {timeRemainingStr}
                      </div>
                    </td>
                    <td className="px-3.5 py-2">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${getServiceBadgeStyle(
                          row.service_type || row.verification_type
                        )}`}
                      >
                        {(row.service_type || row.verification_type || 'NIN').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3.5 py-2 font-mono font-semibold text-gray-800 text-xs">
                      {row.query_value || row.nin_query || row.phone_query || '—'}
                    </td>
                    <td className="px-3.5 py-2 font-semibold text-gray-900 text-xs">{nameStr}</td>
                    <td className="px-3.5 py-2 font-black text-[#008751] text-xs">
                      {formatMoney(row.amount_charged || 200)}
                    </td>
                    <td className="px-3.5 py-2 text-center">
                      <Link
                        href="/verify"
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-gray-700 hover:border-[#008751] hover:text-[#008751] transition-colors"
                      >
                        <Eye className="h-3 w-3" /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
