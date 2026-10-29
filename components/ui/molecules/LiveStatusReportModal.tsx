'use client';

import * as React from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/atoms/Button';
import { Badge } from '@/components/ui/atoms/Badge';
import { formatMoney } from '@/helpers/format/formatMoney';

export interface LiveStatusReport {
  trackingId: string;
  reference?: string;
  serviceType?: string;
  status?: string;
  reply?: string;
  downloadUrl?: string | null;
  refund?: {
    amount?: number;
    new_balance?: number;
    reason?: string;
  } | null;
  data?: Record<string, unknown> | null;
  checkedAt?: string;
}

export interface LiveStatusReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  report: LiveStatusReport | null;
  onRefresh?: () => void;
}

export function LiveStatusReportModal({
  isOpen,
  onClose,
  isLoading,
  report,
  onRefresh,
}: LiveStatusReportModalProps) {
  if (!isOpen || !report) return null;

  const statusStr = String(report.status || '').toLowerCase();
  const isSuccess =
    statusStr.includes('cleared') ||
    statusStr.includes('completed') ||
    statusStr.includes('success');
  const isFailed =
    statusStr.includes('fail') ||
    statusStr.includes('error') ||
    statusStr.includes('no_record') ||
    statusStr.includes('not_found');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {report.serviceType || 'Verification Report'}
            </span>
            {isSuccess ? (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold">
                CLEARED
              </Badge>
            ) : isFailed ? (
              <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-bold">
                {report.status?.toUpperCase() || 'FAILED'}
              </Badge>
            ) : (
              <Badge className="bg-sky-100 text-sky-800 border-sky-300 font-bold">
                PROCESSING
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tracking Details */}
        <div className="rounded-xl bg-muted/40 border border-border/80 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Tracking ID:</span>
            <span className="font-mono font-bold text-foreground text-sm tracking-wider">
              {report.trackingId}
            </span>
          </div>
          {report.reference && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Reference:</span>
              <span className="font-mono font-semibold text-foreground">
                {report.reference}
              </span>
            </div>
          )}
          {report.checkedAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Checked At:</span>
              <span className="text-muted-foreground">{report.checkedAt}</span>
            </div>
          )}
        </div>

        {/* Message / Status reply */}
        <div className="p-3.5 rounded-xl border border-border bg-card text-xs space-y-2">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-sky-600 shrink-0" />
            ) : isSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : isFailed ? (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            ) : (
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
            )}
            <span className="font-semibold text-foreground">
              {isLoading ? 'Checking source status...' : 'Status Response'}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-6">
            {report.reply || (isLoading ? 'Querying NIMC database...' : 'No details available.')}
          </p>
        </div>

        {/* Refund Banner if refunded */}
        {report.refund && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900">
            <Wallet className="h-4 w-4 text-emerald-700 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold">
                Wallet Refunded: {formatMoney(report.refund.amount || 0)}
              </div>
              <div className="text-[11px] text-emerald-700">
                New wallet balance: {formatMoney(report.refund.new_balance || 0)}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          {report.downloadUrl && (
            <a
              href={report.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="sm" variant="default" className="gap-1.5 text-xs font-bold">
                <Download className="h-3.5 w-3.5" /> Download Slip
              </Button>
            </a>
          )}

          {onRefresh && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}

          <Button size="sm" variant="default" onClick={onClose} className="text-xs font-semibold">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

