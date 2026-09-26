'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Search,
  RefreshCw,
  Send
} from 'lucide-react';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { Badge } from '@/components/ui/atoms/Badge';
import { Input } from '@/components/ui/atoms/Input';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateWalletBalance } from '@/redux/slices/authSlice';
import { formatMoney } from '@/helpers/format/formatMoney';
import { supabase } from '@/lib/supabase/client';

export function IpeClearancePage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [trackingId, setTrackingId] = React.useState('');
  const [checkId, setCheckId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [checkingRef, setCheckingRef] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<{ type: 'success' | 'error' | 'info'; text: string; ref?: string } | null>(null);
  const [statusResult, setStatusResult] = React.useState<{ trackingId: string; status: string; reply?: string } | null>(null);
  const [historyRows, setHistoryRows] = React.useState<any[]>([]);

  const isAdmin = currentUser?.email === 'brinoekanem@gmail.com' || currentUser?.role === 'admin';
  const isAgent = currentUser?.role === 'agent';
  const ipeCost = isAdmin ? 350 : (isAgent ? 600 : 1500);
  const costDisplay = formatMoney(ipeCost);

  // Load IPE history
  const loadIpeHistory = React.useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      let query = supabase
        .from('verification_history')
        .select('*')
        .ilike('service_type', '%ipe%')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!isAdmin) {
        query = query.eq('user_id', currentUser.id);
      }
      const { data } = await query;
      setHistoryRows(data || []);
    } catch (e) {
      console.warn('IPE history load error:', e);
    }
  }, [currentUser?.id, isAdmin]);

  React.useEffect(() => {
    loadIpeHistory();
  }, [loadIpeHistory]);

  const handleSubmitIpe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const cleanId = trackingId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
    if (!cleanId || cleanId.length < 5) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid 15-character Tracking ID.' });
      return;
    }

    const balance = currentUser?.wallet_balance || 0;
    if (balance < ipeCost) {
      setStatusMsg({
        type: 'error',
        text: `Insufficient wallet balance (${formatMoney(balance)}). IPE clearance requires ${costDisplay}. Please fund your wallet.`,
      });
      return;
    }

    setIsLoading(true);
    setStatusMsg({ type: 'info', text: 'Connecting to IPE Clearance Gateway...' });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const resp = await fetch('/api/ipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tracking_id: cleanId,
          clearance_type: 'Immigration Clearance',
        }),
      });

      const result = await resp.json();

      if (result.success) {
        if (result.new_balance !== undefined) {
          dispatch(updateWalletBalance(result.new_balance));
        }

        setStatusMsg({
          type: 'success',
          text: `IPE Clearance request submitted successfully! Your tracking ID ${cleanId} has been forwarded for processing.`,
          ref: result.reference || cleanId,
        });
        setCheckId(cleanId);
        setTrackingId('');
        loadIpeHistory();
      } else {
        setStatusMsg({
          type: 'error',
          text: result.error || 'Failed to submit IPE clearance request to gateway.',
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to submit IPE clearance request.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async (e?: React.FormEvent, targetTracking?: string) => {
    if (e) e.preventDefault();
    const cleanId = (targetTracking || checkId).replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
    if (!cleanId) return;

    setIsChecking(true);
    setCheckingRef(cleanId);
    setStatusResult(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const resp = await fetch('/api/ipe-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tracking_id: cleanId }),
      });

      const data = await resp.json();

      if (data.success) {
        setStatusResult({
          trackingId: cleanId,
          status: (data.status || 'PENDING').toUpperCase(),
          reply: data.reply || 'IPE clearance request is in progress with immigration officers.',
        });
        loadIpeHistory();
      } else {
        setStatusResult({
          trackingId: cleanId,
          status: 'NOT FOUND',
          reply: data.error || 'No active IPE record found for this tracking ID.',
        });
      }
    } catch (err: any) {
      setStatusResult({
        trackingId: cleanId,
        status: 'ERROR',
        reply: err.message || 'Unable to check status at this time.',
      });
    } finally {
      setIsChecking(false);
      setCheckingRef(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = String(status || 'pending').toLowerCase();
    if (s.includes('clear') || s.includes('success') || s.includes('complete')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="h-3 w-3" /> CLEARED
        </span>
      );
    }
    if (s.includes('process')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-black text-sky-800 border border-sky-300">
          <RefreshCw className="h-3 w-3 animate-spin" /> PROCESSING
        </span>
      );
    }
    if (s.includes('fail') || s.includes('reject')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-800 border border-rose-300">
          <AlertCircle className="h-3 w-3" /> FAILED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800 border border-amber-300">
        <Clock className="h-3 w-3" /> PENDING
      </span>
    );
  };

  return (
    <ContentWidthContainer variant="wide" className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1a7a4a] to-[#0d4f2f] text-white shadow-sm shrink-0">
            <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                IPE Services
              </h2>
              {isAdmin ? (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-bold">
                  Admin Source Rate (₦350)
                </Badge>
              ) : isAgent ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold">
                  Agent Rate (₦600)
                </Badge>
              ) : null}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Submit your IPE Tracking ID for processing | Fee:{' '}
              <strong className="text-[#008751] font-extrabold">{costDisplay}</strong>
            </p>
          </div>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold self-start sm:self-auto">
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* ── Dual Forms Layout: Submit IPE + Check Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Form 1: Submit IPE Clearance */}
        <Card className="p-4 sm:p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-[#008751]" /> Submit IPE Tracking ID
            </h3>
            <Badge variant="secondary" className="font-bold text-xs text-[#008751]">
              Fee: {costDisplay}
            </Badge>
          </div>

          <form onSubmit={handleSubmitIpe} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground block mb-1.5">
                15-Character Alphanumeric Tracking ID <span className="text-red-500">*</span>
              </label>
              <Input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 25))}
                placeholder="E.G. BTVX178050472NZ"
                maxLength={25}
                disabled={isLoading}
                className="h-11 font-mono text-base sm:text-sm uppercase font-semibold"
                required
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter your 15-character alphanumeric enrollment tracking ID requiring immigration / IPE clearance.
              </p>
            </div>

            <Button
              type="submit"
              variant="default"
              fullWidth
              isLoading={isLoading}
              className="h-11 font-bold text-sm bg-[#008751] hover:bg-[#006b40]"
            >
              {isLoading ? 'Submitting to Gateway...' : `Submit Request (${costDisplay})`}
            </Button>
          </form>

          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-medium space-y-1 ${
                statusMsg.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : statusMsg.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMsg.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                {statusMsg.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{statusMsg.text}</span>
              </div>
              {statusMsg.ref && (
                <div className="font-mono text-[11px] pt-1 text-green-700">
                  Reference: <strong>{statusMsg.ref}</strong> (Status: PENDING)
                </div>
              )}
            </div>
          )}

          {/* Blog Guide Box */}
          <div className="flex items-start gap-3 rounded-xl bg-[#e3f2fd] border border-[#90caf9] p-3 sm:p-3.5 text-xs text-[#0d47a1]">
            <BookOpen className="h-4 w-4 text-[#1565c0] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0d47a1] font-bold">What is NIN IPE?</strong>
              <p className="mt-0.5 text-sky-800 leading-relaxed text-[11px]">
                Read our guide detailing the NIN IPE process and requirements.{' '}
                <Link href="/blog" className="font-bold underline hover:text-[#0b3d91]">
                  Read about NIN IPE &rarr;
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Form 2: Check IPE Status */}
        <Card className="p-4 sm:p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Search className="h-4 w-4 text-sky-600" /> Check IPE Live Status
            </h3>
            <Badge variant="outline" className="text-[10px] text-sky-700 border-sky-200 bg-sky-50">
              Live Gateway Query
            </Badge>
          </div>

          <form onSubmit={(e) => handleCheckStatus(e)} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground block mb-1.5">
                Tracking ID or Reference <span className="text-red-500">*</span>
              </label>
              <Input
                value={checkId}
                onChange={(e) => setCheckId(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 25))}
                placeholder="E.G. BTVX178050472NZ"
                disabled={isChecking}
                className="h-11 font-mono uppercase text-sm"
                required
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter your 15-character Tracking ID to check immigration clearance status.
              </p>
            </div>

            <Button
              type="submit"
              variant="outline"
              fullWidth
              isLoading={isChecking}
              className="h-11 font-bold text-sm border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              {isChecking ? 'Checking Live Status...' : 'Check Status'}
            </Button>
          </form>

          {statusResult && (
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-mono font-bold text-foreground">{statusResult.trackingId}</span>
                {getStatusBadge(statusResult.status)}
              </div>
              <p className="text-foreground leading-relaxed pt-1 font-medium">{statusResult.reply}</p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Recent Submissions Table with Live Progress ── */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden mt-6">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#008751]" /> Recent IPE Clearance Submissions
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live tracking for all submitted IPE immigration clearance tracking IDs.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-bold text-muted-foreground">
            {historyRows.length} requests logged
          </Badge>
        </div>

        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          {historyRows.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground italic">
              No IPE clearance requests logged yet.
            </div>
          ) : (
            <table className="w-full min-w-[550px] text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-bold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Tracking ID</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyRows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {row.reference || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground font-bold">
                      {row.query_value || '—'}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#008751]">
                      {formatMoney(row.amount_charged || 0)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.query_value ? (
                        <button
                          type="button"
                          onClick={() => handleCheckStatus(undefined, row.query_value)}
                          disabled={checkingRef === row.query_value}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008751] hover:underline cursor-pointer disabled:opacity-50"
                        >
                          {checkingRef === row.query_value ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          Check Status
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ContentWidthContainer>
  );
}
