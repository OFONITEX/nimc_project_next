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
  RefreshCw,
  Zap,
  Copy,
  Check,
  ShieldCheck,
  X,
  Eye,
  Search,
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

interface ReplyModal {
  open: boolean;
  trackingId: string;
  reply: string;
  status: string;
  isLoading: boolean;
}

export function IpeClearancePage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // Form State
  const [trackingId, setTrackingId] = React.useState('');
  const [activeSession, setActiveSession] = React.useState<'standard' | 'special'>('standard');
  const [category, setCategory] = React.useState('HIT IPE');
  const [isLoading, setIsLoading] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<{ type: 'success' | 'error' | 'info'; text: string; ref?: string } | null>(null);

  // Table State
  const [historyRows, setHistoryRows] = React.useState<any[]>([]);
  const [testHistory, setTestHistory] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [checkingRow, setCheckingRow] = React.useState<string | null>(null);

  // Reply Modal State
  const [replyModal, setReplyModal] = React.useState<ReplyModal>({
    open: false, trackingId: '', reply: '', status: '', isLoading: false
  });
  const [copiedReply, setCopiedReply] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('ipe_test_history');
      if (saved) setTestHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const isAdmin = currentUser?.email === 'brinoekanem@gmail.com' || currentUser?.role === 'admin';
  const isOperator = currentUser?.role === 'operator';
  const isAgent = !isAdmin && (currentUser?.role === 'agent' || !isOperator);
  const ipeCost = isAdmin ? 350 : (isAgent ? 600 : 1500);
  const costDisplay = formatMoney(ipeCost);

  // Special IPE Pricing: Admin (brinoekanem@gmail.com) = ₦500, all other accounts = ₦1,000
  const specialIpeCost = isAdmin ? 500 : 1000;
  const specialCostDisplay = formatMoney(specialIpeCost);

  const loadIpeHistory = React.useCallback(async () => {
    if (!currentUser?.id && !currentUser?.email) return;
    try {
      let query = supabase
        .from('verification_history')
        .select('*')
        .or('service_type.ilike.%ipe%,service_type.ilike.%clearance%')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!isAdmin) {
        if (currentUser?.id && currentUser?.email) {
          query = query.or(`user_id.eq.${currentUser.id},user_email.eq.${currentUser.email}`);
        } else if (currentUser?.id) {
          query = query.eq('user_id', currentUser.id);
        } else if (currentUser?.email) {
          query = query.eq('user_email', currentUser.email);
        }
      }
      const { data } = await query;
      setHistoryRows(data || []);
      return data || [];
    } catch (e) {
      console.warn('IPE history load error:', e);
      return [];
    }
  }, [currentUser?.id, currentUser?.email, isAdmin]);

  React.useEffect(() => { loadIpeHistory(); }, [loadIpeHistory]);

  const handleSubmitIpe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const cleanId = trackingId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
    if (!cleanId || cleanId.length < 5) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid Tracking ID.' });
      return;
    }

    const isTestId = cleanId.startsWith('TEST') || cleanId.startsWith('DEMO') || cleanId === 'BTVX178050472NZ';
    const isSpecial = activeSession === 'special';
    const effectiveCategory = isSpecial ? category : 'Standard IPE';
    const effectiveType = isSpecial ? category : 'Immigration Clearance';
    const balance = currentUser?.wallet_balance || 0;
    const requiredFee = isSpecial ? specialIpeCost : ipeCost;
    const requiredFeeDisplay = isSpecial ? specialCostDisplay : costDisplay;

    if (!isTestId && balance < requiredFee) {
      setStatusMsg({ type: 'error', text: `Insufficient wallet balance (${formatMoney(balance)}). ${isSpecial ? 'Special IPE' : 'IPE clearance'} requires ${requiredFeeDisplay}. Please fund your wallet.` });
      return;
    }

    if (isTestId) {
      setIsLoading(true);
      setStatusMsg({ type: 'info', text: 'Submitting IPE clearance (Test Mode)...' });
      setTimeout(() => {
        const testRef = 'IPE_TEST_' + Date.now().toString().slice(-6);
        const testRow = {
          id: 'test_' + Date.now(),
          created_at: new Date().toISOString(),
          query_value: cleanId,
          category: effectiveCategory,
          reference: testRef,
          amount_charged: 0,
          status: 'pending',
          reply: `[${effectiveCategory}] Test IPE Clearance request queued for processing.`,
          service_type: isSpecial ? 'ipe_special' : 'ipe_clearance',
          user_email: currentUser?.email || 'test@user.com',
        };
        setTestHistory((prev) => {
          const next = [testRow, ...prev.filter((r) => r.query_value !== cleanId)];
          try { sessionStorage.setItem('ipe_test_history', JSON.stringify(next)); } catch {}
          return next;
        });
        setStatusMsg({ type: 'success', text: `${isSpecial ? `Special IPE (${category})` : 'IPE Clearance'} submitted in Test Mode! Tracking ID: ${cleanId}`, ref: testRef });
        setTrackingId('');
        setIsLoading(false);
      }, 500);
      return;
    }

    setIsLoading(true);
    setStatusMsg({ type: 'info', text: 'Connecting to IPE Clearance Gateway...' });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const resp = await fetch('/api/ipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ tracking_id: cleanId, service_mode: isSpecial ? 'special' : 'standard', category: effectiveCategory, clearance_type: effectiveType }),
      });
      const result = await resp.json();
      if (result.success) {
        if (result.new_balance !== undefined) dispatch(updateWalletBalance(result.new_balance));
        setStatusMsg({ type: 'success', text: `${isSpecial ? `Special IPE (${category})` : 'IPE Clearance'} submitted! Tracking ID ${cleanId} forwarded for processing.`, ref: result.reference || cleanId });
        setTrackingId('');
        loadIpeHistory();
      } else {
        setStatusMsg({ type: 'error', text: result.error || 'Failed to submit IPE clearance request.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to submit IPE clearance request.' });
    } finally {
      setIsLoading(false);
    }
  };

  const isGenericReply = (msg?: string) => {
    if (!msg || typeof msg !== 'string') return true;
    const s = msg.trim().toLowerCase();
    return s.includes('ipe request status') || s.includes('connecting') || s === 'pending' || s === 'processing' || s === 'success' || s === 'ok';
  };

  const handleViewReply = async (row: any) => {
    const tid = (row.query_value || row.reference || '').replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
    if (!tid) return;

    // Check if row already has demographics or a structured report
    const fullName = [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(' ');
    const hasDemographics = !!(row.nin || fullName || row.date_of_birth);
    const constructedReport = hasDemographics
      ? `${row.reference || tid}${row.nin ? ` | NIN: ${row.nin}` : ''}${fullName ? ` | Name: ${fullName.toUpperCase()}` : ''}${row.date_of_birth ? ` | DOB: ${row.date_of_birth}` : ''}`
      : null;

    const existingReply = row.reply && !isGenericReply(row.reply)
      ? row.reply
      : null;

    const bestInitialReply = constructedReport || existingReply || 'Checking gateway for clearance report...';
    const isAlreadyCompleted = (row.status === 'cleared' || row.status === 'completed' || row.status === 'successful') && (!!constructedReport || !!existingReply);

    // Open modal with the best available report immediately
    setReplyModal({
      open: true,
      trackingId: tid,
      reply: bestInitialReply,
      status: row.status || 'pending',
      isLoading: !isAlreadyCompleted,
    });
    setCheckingRow(tid);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const resp = await fetch('/api/ipe-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ tracking_id: tid, reference: row.reference, batch_id: row.reference }),
      });
      const data = await resp.json();

      if (data.refund?.new_balance !== undefined) dispatch(updateWalletBalance(data.refund.new_balance));

      const hasNewValidReply = data.reply && !isGenericReply(data.reply);
      const liveReply = hasNewValidReply
        ? data.reply
        : (bestInitialReply !== 'Checking gateway for clearance report...' ? bestInitialReply : 'Request is queued and currently being processed.');
      const liveStatus = data.status || (data.success ? 'cleared' : row.status || 'pending');

      setHistoryRows((prev) =>
        prev.map((r) => (r.query_value === tid || r.reference === tid)
          ? { ...r, status: liveStatus, reply: liveReply, download_url: data.download_url || r.download_url }
          : r
        )
      );
      setReplyModal({ open: true, trackingId: tid, reply: liveReply, status: liveStatus, isLoading: false });
    } catch (err: any) {
      setReplyModal((prev) => ({
        ...prev,
        reply: prev.reply !== 'Checking gateway for clearance report...' ? prev.reply : 'Request is queued and currently being processed.',
        isLoading: false
      }));
    } finally {
      setCheckingRow(null);
    }
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    const allRows = [...testHistory, ...historyRows];
    const pendingRows = allRows.filter((r) => {
      const s = String(r.status || '').toLowerCase();
      return s === 'pending' || s === 'processing' || s === 'submitted';
    });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      for (const row of pendingRows) {
        const tid = (row.query_value || row.reference || '').replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
        if (!tid || tid.startsWith('IPE_TEST')) continue;
        try {
          const resp = await fetch('/api/ipe-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ tracking_id: tid, reference: row.reference, batch_id: row.reference }),
          });
          const data = await resp.json();
          if (data.refund?.new_balance !== undefined) dispatch(updateWalletBalance(data.refund.new_balance));
          const liveStatus = data.status || (data.success ? 'cleared' : row.status);
          const liveReply = data.reply && !isGenericReply(data.reply) ? data.reply : row.reply;
          setHistoryRows((prev) =>
            prev.map((r) => (r.query_value === tid || r.reference === tid)
              ? { ...r, status: liveStatus, reply: liveReply, download_url: data.download_url || r.download_url }
              : r
            )
          );
        } catch {}
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyReply = () => {
    if (!replyModal.reply) return;
    navigator.clipboard.writeText(replyModal.reply).then(() => {
      setCopiedReply(true);
      setTimeout(() => setCopiedReply(false), 2000);
    });
  };

  const getStatusBadge = (status?: string, reply?: string) => {
    const s = String(status || '').toLowerCase();
    const r = String(reply || '').toLowerCase();
    const isRefunded = s.includes('refund') || r.includes('refund') || r.includes('credited back');

    if (s.includes('clear') || s.includes('complete') || s.includes('success') || s.includes('approv') || s.includes('verified') || s.includes('passed')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
          Cleared
        </span>
      );
    }
    if (isRefunded || s.includes('fail') || s.includes('reject') || s.includes('cancel') || s.includes('declin')) {
      if (isRefunded) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#f3e8ff] text-[#7e22ce] border border-[#e9d5ff]">
            Refunded
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]">
          Failed
        </span>
      );
    }
    if (s.includes('process') || s.includes('in-progress') || s.includes('in progress') || s.includes('review') || s.includes('work')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
        Queued
      </span>
    );
  };

  const allRows = [...testHistory, ...historyRows];
  const filteredRows = searchQuery.trim()
    ? allRows.filter((r) =>
        (r.query_value || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.reference || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.user_email || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRows;

  return (
    <ContentWidthContainer variant="wide" className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1a7a4a] to-[#0d4f2f] text-white shadow-sm shrink-0">
            <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">IPE Services</h2>
              {isAdmin ? (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-bold">Admin Source Rate (₦350)</Badge>
              ) : isAgent ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold">Agent Rate (₦600)</Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-800 border-slate-200 text-xs font-bold">Operator Rate (₦1,500)</Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Submit your IPE Tracking ID for processing | Fee: <strong className="text-[#008751] font-extrabold">{costDisplay}</strong>
            </p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold self-start sm:self-auto">
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Session Switcher + Submission Form */}
      <div className="max-w-2xl mx-auto w-full space-y-4">
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-muted/70 border border-border">
          <button type="button" onClick={() => { setActiveSession('standard'); setStatusMsg(null); }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${activeSession === 'standard' ? 'bg-card text-foreground shadow-xs border border-border text-[#008751]' : 'text-muted-foreground hover:text-foreground'}`}>
            <ShieldCheck className="h-4 w-4 text-[#008751]" /><span>IPE Clearance</span>
          </button>
          <button type="button" onClick={() => { setActiveSession('special'); setStatusMsg(null); }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${activeSession === 'special' ? 'bg-card text-foreground shadow-xs border border-border text-amber-700 dark:text-amber-400' : 'text-muted-foreground hover:text-foreground'}`}>
            <Zap className="h-4 w-4 text-amber-500" /><span>Special IPE Clearance</span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">Special</span>
          </button>
        </div>

        <Card className="p-5 sm:p-7 rounded-2xl border border-border shadow-xs space-y-5">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                {activeSession === 'standard'
                  ? <><ShieldCheck className="h-4 w-4 text-[#008751]" /> Submit IPE Clearance</>
                  : <><Zap className="h-4 w-4 text-amber-600" /> Submit Special IPE Clearance</>}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {activeSession === 'standard'
                  ? 'Standard clearance for pending enrollment records.'
                  : 'Specialized clearance channel for HIT IPE, READY FOR ABIS, and BLOCKED IPE records.'}
              </p>
            </div>
            <Badge variant="secondary" className="font-bold text-xs text-[#008751] shrink-0">
              Fee: {activeSession === 'special' ? specialCostDisplay : costDisplay}
            </Badge>
          </div>

          <form onSubmit={handleSubmitIpe} className="space-y-4">
            {activeSession === 'special' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-foreground block mb-1.5">
                  Special IPE Category <span className="text-red-500">*</span>
                </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isLoading}
                  className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#008751] transition-all cursor-pointer">
                  <option value="HIT IPE">HIT IPE — {specialCostDisplay}</option>
                  <option value="READY FOR ABIS">READY FOR ABIS — {specialCostDisplay}</option>
                  <option value="BLOCKED IPE">BLOCKED IPE — {specialCostDisplay}</option>
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">Select your required special category (Fee: {specialCostDisplay} for your account tier).</p>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground block mb-1.5">
                15-Character Alphanumeric Tracking ID <span className="text-red-500">*</span>
              </label>
              <Input value={trackingId} onChange={(e) => setTrackingId(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 25))}
                placeholder="E.G. BTVX178050472NZ" maxLength={25} disabled={isLoading}
                className="h-12 font-mono text-base sm:text-sm uppercase font-semibold" required />
              <p className="text-[11px] text-muted-foreground mt-1">Enter your 15-character alphanumeric enrollment tracking ID.</p>
            </div>

            <Button type="submit" variant="default" fullWidth isLoading={isLoading} className="h-11 font-bold text-sm bg-[#008751] hover:bg-[#006b40]">
              {isLoading ? 'Submitting to Gateway...' : activeSession === 'standard'
                ? `Submit IPE Clearance (${costDisplay})`
                : `Submit Special IPE [${category}] (${specialCostDisplay})`}
            </Button>
          </form>

          {statusMsg && (
            <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2 ${statusMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : statusMsg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
              {statusMsg.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />}
              {statusMsg.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Submissions Table & Provider Cards */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-[#2563eb]" /> Recent Submissions
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Status and replies update when you refresh.</p>
            </div>
            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background hover:bg-muted/60 px-3.5 py-1.5 text-xs font-bold text-foreground transition-colors disabled:opacity-50 shadow-2xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-[#2563eb] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH TRACKING ID IN ALL RECORDS..."
                className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#2563eb] font-mono uppercase"
              />
            </div>
            <button
              type="button"
              onClick={() => {}}
              className="inline-flex items-center justify-center rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-1.5 text-xs font-bold transition-colors shadow-xs"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
              Showing 1–{filteredRows.length} of {allRows.length} total records
            </span>
            <div className="h-px bg-border flex-1" />
          </div>
        </div>

        {/* Individual Submission Cards matching screenshot */}
        <div className="p-3 sm:p-5 space-y-2.5 bg-muted/20">
          {filteredRows.length === 0 ? (
            <div className="p-10 text-center text-xs text-muted-foreground italic bg-card rounded-xl border border-border">
              {searchQuery ? 'No records match your search query.' : 'No IPE clearance requests submitted yet.'}
            </div>
          ) : (
            filteredRows.map((row, idx) => {
              const tid = row.query_value || row.reference || '—';
              const shortRef = (row.reference || '').toUpperCase().slice(-8) || '—';
              const isBusy = checkingRow === tid;
              const rowNum = 5820 - idx;

              return (
                <div
                  key={row.id || idx}
                  className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left Column: ID, Ref, Timestamp, Badge, Hash, Amount */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 flex-1 min-w-0">
                    <span className="font-mono font-black text-foreground text-xs sm:text-sm tracking-tight">
                      {tid}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground font-semibold">
                      #{rowNum}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3 text-muted-foreground/70" />
                      {new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })},{' '}
                      {new Date(row.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {getStatusBadge(row.status, row.reply)}
                    <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80">
                      <span className="inline-block h-2 w-2 rounded-2xs bg-muted-foreground/60" />
                      {shortRef}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {row.amount_charged === 0
                        ? <span className="text-muted-foreground">₦0.00</span>
                        : formatMoney(row.amount_charged || 0)}
                    </span>
                  </div>

                  {/* Right Column: View Reply Button */}
                  <button
                    type="button"
                    onClick={() => handleViewReply(row)}
                    disabled={isBusy}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 text-xs font-bold transition-all shadow-xs disabled:opacity-60 shrink-0 w-full sm:w-auto"
                  >
                    {isBusy ? (
                      <><RefreshCw className="h-3 w-3 animate-spin" /> Loading...</>
                    ) : (
                      <><Eye className="h-3.5 w-3.5" /> View Reply</>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reply Modal matching second screenshot */}
      {replyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setReplyModal((p) => ({ ...p, open: false }))}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Title */}
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              Reply
            </h3>

            {/* Tracking ID */}
            <div className="text-xs font-mono font-semibold text-muted-foreground tracking-wider">
              {replyModal.trackingId}
            </div>

            {/* Reply Content Card */}
            <div className="rounded-xl bg-muted/40 border border-border/80 p-4 min-h-[90px] flex flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap break-words select-all font-mono">
                {replyModal.reply || 'No reply recorded yet.'}
              </p>
              {replyModal.isLoading && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium mt-2">
                  <RefreshCw className="h-3 w-3 animate-spin text-[#2563eb]" />
                  <span>Checking gateway for latest updates...</span>
                </div>
              )}
            </div>

            {/* Modal Action Buttons matching screenshot */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyReply}
                disabled={!replyModal.reply}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2.5 text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
              >
                {copiedReply ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy Reply</>}
              </button>
              <button
                type="button"
                onClick={() => setReplyModal((p) => ({ ...p, open: false }))}
                className="flex-1 inline-flex items-center justify-center rounded-lg bg-[#64748b] hover:bg-[#475569] text-white px-4 py-2.5 text-xs font-bold transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </ContentWidthContainer>
  );
}
