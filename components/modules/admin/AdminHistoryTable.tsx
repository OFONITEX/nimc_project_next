'use client';

import * as React from 'react';
import { Search, History, RefreshCw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminVerificationItem } from '@/redux/api/adminApi';
import { Button } from '@/components/ui/atoms/Button';
import { formatMoney } from '@/helpers/format/formatMoney';
import { formatDateTime } from '@/helpers/format/formatDateTime';

export interface AdminHistoryTableProps {
  history: AdminVerificationItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function AdminHistoryTable({ history, isLoading, onRefresh }: AdminHistoryTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [serviceFilter, setServiceFilter] = React.useState('all');

  const filteredHistory = React.useMemo(() => {
    return (history || []).filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        (item.query_value || '').toLowerCase().includes(search) ||
        (item.user_email || '').toLowerCase().includes(search) ||
        (item.first_name || '').toLowerCase().includes(search) ||
        (item.last_name || '').toLowerCase().includes(search) ||
        (item.id || '').toLowerCase().includes(search);

      const sType = (item.service_type || 'nin').toLowerCase();
      const matchesService = serviceFilter === 'all' || sType.includes(serviceFilter.toLowerCase());

      return matchesSearch && matchesService;
    });
  }, [history, searchTerm, serviceFilter]);

  const getServiceBadge = (type?: string) => {
    const t = (type || 'nin').toLowerCase();
    if (t.includes('phone')) return { bg: 'bg-teal-50 text-teal-700 border-teal-200', label: 'PHONE' };
    if (t.includes('demo')) return { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'DEMO' };
    if (t.includes('bvn')) return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'BVN' };
    if (t.includes('ipe')) return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'IPE' };
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'NIN' };
  };

  return (
    <div className="space-y-3">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by NIN, Phone, Email, or Name..."
            className="h-9 w-full rounded-lg border border-black/10 bg-white pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#008751] focus:outline-none focus:ring-1 focus:ring-[#008751]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="h-9 rounded-lg border border-black/10 bg-white px-2.5 text-xs font-semibold text-gray-700 focus:border-[#008751] focus:outline-none"
          >
            <option value="all">All Services</option>
            <option value="nin">NIN Lookups</option>
            <option value="bvn">BVN Lookups</option>
            <option value="phone">Phone Lookups</option>
            <option value="demo">Demographic Lookups</option>
            <option value="ipe">IPE Clearance</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-9 gap-1.5 px-3 text-xs font-bold text-gray-700 bg-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-400">
            <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#008751]" />
            Loading portal verification audit logs...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
            <FileText className="h-8 w-8 text-gray-300 mb-1.5" />
            <p className="text-xs sm:text-sm font-bold text-gray-800">No verification records found</p>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-sm">
              {searchTerm || serviceFilter !== 'all'
                ? 'Try adjusting your search criteria or filter.'
                : 'Verification activities across the portal will stream here automatically.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 bg-gray-50 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-2.5">Date &amp; Time</th>
                  <th className="px-3 py-2.5">Operator Email</th>
                  <th className="px-3 py-2.5">Service</th>
                  <th className="px-3 py-2.5">Queried Value / ID</th>
                  <th className="px-3 py-2.5">Verified Citizen</th>
                  <th className="px-3 py-2.5">Fee</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredHistory.map((row) => {
                  const badge = getServiceBadge(row.service_type);
                  const fullName =
                    [row.first_name, row.middle_name, row.last_name]
                      .filter(Boolean)
                      .join(' ') || '—';

                  return (
                    <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-3 py-2 text-gray-500 whitespace-nowrap text-[11px]">
                        {formatDateTime(row.created_at)}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-800 truncate max-w-[160px]" title={row.user_email}>
                        {row.user_email || '—'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-gray-900 whitespace-nowrap">
                        {row.query_value || '—'}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-700 truncate max-w-[150px]" title={fullName}>
                        {fullName}
                      </td>
                      <td className="px-3 py-2 font-black text-[#008751] whitespace-nowrap">
                        {formatMoney(row.amount_charged || 200)}
                      </td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        {row.success !== false ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                            <AlertCircle className="h-3 w-3" /> FAILED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="border-t border-black/5 bg-gray-50 px-4 py-2 text-[11px] text-gray-500 flex items-center justify-between">
          <span>
            Showing <strong>{filteredHistory.length}</strong> of <strong>{history.length}</strong> total verification records
          </span>
          <span className="text-[10px] text-gray-400">All-time portal verification stream</span>
        </div>
      </div>
    </div>
  );
}
