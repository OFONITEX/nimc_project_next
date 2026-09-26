'use client';

import * as React from 'react';
import {
  ShieldCheck,
  FileX,
  Smartphone,
  Camera,
  UserCheck,
  Info,
  AlertTriangle,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  RefreshCw,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateWalletBalance } from '@/redux/slices/authSlice';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { Badge } from '@/components/ui/atoms/Badge';
import { Input } from '@/components/ui/atoms/Input';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { formatMoney } from '@/helpers/format/formatMoney';
import { supabase } from '@/lib/supabase/client';

export type ValidationType = 'no-record' | 'sim' | 'photo' | 'modification';

export function ValidationPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [activeType, setActiveType] = React.useState<ValidationType>('no-record');
  const [ninNumber, setNinNumber] = React.useState('');
  const [refCode, setRefCode] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [checkingRef, setCheckingRef] = React.useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = React.useState<{ type: 'success' | 'error'; text: string; ref?: string } | null>(null);
  const [statusResult, setStatusResult] = React.useState<{ ref: string; status: string; date?: string; note?: string } | null>(null);
  const [historyRows, setHistoryRows] = React.useState<any[]>([]);

  const isAdmin = currentUser?.email === 'brinoekanem@gmail.com' || currentUser?.role === 'admin';
  const isAgent = currentUser?.role === 'agent';
  const valPrice = isAdmin ? 750 : (isAgent ? 1000 : 1500);
  const priceDisplay = formatMoney(valPrice);

  const validationOptions = [
    {
      id: 'no-record' as const,
      title: 'No record found',
      label: 'No Record Found',
      desc: 'Resolve no-record lookup errors',
      icon: <FileX className="h-5 w-5 text-[#f57c00]" />,
      bg: 'bg-[#fff3e0]',
    },
    {
      id: 'sim' as const,
      title: 'SIM Registration',
      label: 'SIM Registration',
      desc: 'Fix SIM-NIN linkage issues',
      icon: <Smartphone className="h-5 w-5 text-[#00897b]" />,
      bg: 'bg-[#e0f7f4]',
    },
    {
      id: 'photo' as const,
      title: 'Photograph error',
      label: 'Photograph Error',
      desc: 'Correct NIN photograph issues',
      icon: <Camera className="h-5 w-5 text-[#c2185b]" />,
      bg: 'bg-[#fce4ec]',
    },
    {
      id: 'modification' as const,
      title: 'Modification validation',
      label: 'Modification Validation',
      desc: 'Validate NIN demographic modifications',
      icon: <UserCheck className="h-5 w-5 text-[#283593]" />,
      bg: 'bg-[#e8eaf6]',
    },
  ];

  const activeOption = validationOptions.find((o) => o.id === activeType) || validationOptions[0];

  // Load history
  const loadValidationHistory = React.useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      let query = supabase
        .from('verification_history')
        .select('*')
        .ilike('service_type', '%validation%')
        .order('created_at', { ascending: false })
        .limit(25);

      if (!isAdmin) {
        query = query.eq('user_id', currentUser.id);
      }
      const { data } = await query;
      setHistoryRows(data || []);
    } catch (e) {
      console.warn('Validation history load error:', e);
    }
  }, [currentUser?.id, isAdmin]);

  React.useEffect(() => {
    loadValidationHistory();
  }, [loadValidationHistory]);

  const handleSubmitValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    const cleanNin = ninNumber.replace(/\D/g, '').trim();
    if (!cleanNin || cleanNin.length !== 11 || !/^\d{11}$/.test(cleanNin)) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid 11-digit NIN Number.' });
      return;
    }

    const balance = currentUser?.wallet_balance || 0;
    if (balance < valPrice) {
      setSubmitMessage({
        type: 'error',
        text: `Insufficient wallet balance (${formatMoney(balance)}). Validation requires ${priceDisplay}. Please fund your wallet.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const resp = await fetch('/api/validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nin: cleanNin,
          validation_type: activeOption.title,
        }),
      });

      const result = await resp.json();

      if (result.success) {
        if (result.new_balance !== undefined) {
          dispatch(updateWalletBalance(result.new_balance));
        }

        setSubmitMessage({
          type: 'success',
          text: `Validation request submitted successfully to NIMC Gateway! Reference: ${result.reference}. Progress: Pending NIMC Processing.`,
          ref: result.reference,
        });
        setRefCode(result.reference || '');
        setNinNumber('');
        loadValidationHistory();
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error || 'Validation request was rejected by provider gateway.',
        });
      }
    } catch (err: any) {
      setSubmitMessage({ type: 'error', text: err.message || 'Validation request failed to submit.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (e?: React.FormEvent, targetRef?: string) => {
    if (e) e.preventDefault();
    const cleanRef = (targetRef || refCode).trim();
    if (!cleanRef) return;

    setIsChecking(true);
    setCheckingRef(cleanRef);
    setStatusResult(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const resp = await fetch('/api/validation-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reference: cleanRef }),
      });

      const data = await resp.json();

      if (data.success) {
        setStatusResult({
          ref: data.reference || cleanRef,
          status: (data.status || 'PENDING').toUpperCase(),
          date: new Date().toLocaleTimeString(),
          note: data.reply || 'Validation is in progress with NIMC services.',
        });
        loadValidationHistory();
      } else {
        setStatusResult({
          ref: cleanRef,
          status: 'NOT FOUND',
          note: data.error || 'No active validation found with this reference code.',
        });
      }
    } catch (err: any) {
      setStatusResult({
        ref: cleanRef,
        status: 'ERROR',
        note: err.message || 'Unable to check status at this time. Please retry shortly.',
      });
    } finally {
      setIsChecking(false);
      setCheckingRef(null);
    }
  };

  const getProgressBadge = (status?: string) => {
    const s = String(status || 'pending').toLowerCase();
    if (s.includes('success') || s.includes('complete')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="h-3 w-3" /> Step 3/3: COMPLETED
        </span>
      );
    }
    if (s.includes('process')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-black text-sky-800 border border-sky-300">
          <RefreshCw className="h-3 w-3 animate-spin" /> Step 2/3: PROCESSING
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
        <Clock className="h-3 w-3" /> Step 1/3: PENDING REVIEW
      </span>
    );
  };

  return (
    <ContentWidthContainer variant="wide" className="space-y-6">
      {/* ── 1. Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1a7a4a] to-[#0d4f2f] text-white shadow-sm shrink-0">
            <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                NIN Validation Services
              </h2>
              {isAdmin ? (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-bold">
                  Admin Source Cost (₦750)
                </Badge>
              ) : isAgent ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold">
                  Agent Rate (₦1,000)
                </Badge>
              ) : null}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Submit your NIN for validation &amp; check live processing status | Fee:{' '}
              <strong className="text-[#008751] font-extrabold">{priceDisplay}</strong>
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* ── 2. Validation Sub-service Options ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {validationOptions.map((opt) => {
          const isSelected = activeType === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setActiveType(opt.id);
                setSubmitMessage(null);
              }}
              className={`text-left rounded-xl sm:rounded-2xl bg-card p-3 sm:p-4 border-2 transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 hover:shadow-md flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 ${
                isSelected
                  ? 'border-[#008751] ring-2 ring-[#008751]/20 bg-[#008751]/5'
                  : 'border-border hover:border-gray-300'
              }`}
            >
              <div className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl ${opt.bg} sm:mb-3 shadow-2xs`}>
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground text-xs sm:text-sm sm:mb-0.5 truncate sm:whitespace-normal">
                  {opt.label}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-none">
                  {opt.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 3. Dual Forms Layout: Submit Request + Check Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Form 1: Submit Validation */}
        <Card className="p-4 sm:p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-[#008751]" />
              Submit {activeOption.label} Request
            </h3>
            <Badge variant="secondary" className="font-bold text-xs text-[#008751]">
              Fee: {priceDisplay}
            </Badge>
          </div>

          {submitMessage && (
            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs sm:text-sm font-semibold leading-relaxed ${
                submitMessage.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}
            >
              {submitMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              )}
              <div>
                <span>{submitMessage.text}</span>
                {submitMessage.ref && (
                  <div className="mt-1 text-[11px] text-green-700 font-mono">
                    Ref: <strong>{submitMessage.ref}</strong> (Use this below to track status)
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitValidation} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                11-Digit National Identity Number (NIN) <span className="text-red-500">*</span>
              </label>
              <Input
                value={ninNumber}
                onChange={(e) => setNinNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="e.g. 12345678901 (11 digits)"
                maxLength={11}
                inputMode="numeric"
                disabled={isSubmitting}
                className="h-11 font-mono text-sm"
                required
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter your exact 11-digit NIN. Submitting for: <strong>{activeOption.label}</strong>
              </p>
            </div>

            <Button
              type="submit"
              variant="default"
              isLoading={isSubmitting}
              className="w-full h-11 font-bold text-sm bg-[#008751] hover:bg-[#007043]"
            >
              {isSubmitting ? 'Submitting to NIMC Gateway...' : `Submit Request (${priceDisplay})`}
            </Button>
          </form>
        </Card>

        {/* Form 2: Check Validation Status */}
        <Card className="p-4 sm:p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Search className="h-4 w-4 text-sky-600" />
              Check Live Validation Status
            </h3>
            <Badge variant="outline" className="text-[10px] text-sky-700 border-sky-200 bg-sky-50">
              Live Gateway Query
            </Badge>
          </div>

          <form onSubmit={(e) => handleCheckStatus(e)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Validation Reference Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={refCode}
                onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                placeholder="e.g. VALXYZ123 or VAL_1725..."
                disabled={isChecking}
                className="h-11 font-mono uppercase text-sm"
                required
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter your reference code to check real-time progress from the provider.
              </p>
            </div>

            <Button
              type="submit"
              variant="outline"
              isLoading={isChecking}
              className="w-full h-11 font-bold text-sm border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              {isChecking ? 'Checking Live Status...' : 'Check Status'}
            </Button>
          </form>

          {statusResult && (
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-mono font-bold text-foreground">{statusResult.ref}</span>
                {getProgressBadge(statusResult.status)}
              </div>
              <p className="text-foreground leading-relaxed pt-1 font-medium">{statusResult.note}</p>
              {statusResult.date && (
                <div className="text-[10px] text-muted-foreground">Checked at: {statusResult.date}</div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ── 4. Notice Banners ── */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5 rounded-xl bg-sky-50 border border-sky-200 p-3 sm:p-3.5 text-xs text-sky-900">
          <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>Processing Timeline:</strong> NIN Validation requests are processed through NIMC backend channels within <strong>2–3 business days</strong>.
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3 sm:p-3.5 text-xs text-rose-900 leading-relaxed">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Please note:</strong> NIN validation fees are non-refundable upon provider acceptance. Please ensure the NIN submitted is accurate.
          </div>
        </div>
      </div>

      {/* ── 5. Validation History & Real-Time Progress Tracker Table ── */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden mt-6">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#008751]" /> Validation Requests &amp; Live Progress
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live status tracking for all submitted NIN validation records.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-bold text-muted-foreground">
            {historyRows.length} requests logged
          </Badge>
        </div>

        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          {historyRows.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground italic">
              No validation requests logged yet.
            </div>
          ) : (
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-bold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">NIN</th>
                  <th className="px-4 py-3">Validation Type</th>
                  <th className="px-4 py-3">Progress / Status</th>
                  <th className="px-4 py-3">Latest Response / Reply</th>
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
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">
                      {row.query_value || '—'}
                    </td>
                    <td className="px-4 py-3 font-medium uppercase text-foreground">
                      {(row.service_type || '').replace('validation_', '').replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3">
                      {getProgressBadge(row.status)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate" title={row.reply || ''}>
                      {row.reply || 'Pending processing'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.reference ? (
                        <button
                          type="button"
                          onClick={() => handleCheckStatus(undefined, row.reference)}
                          disabled={checkingRef === row.reference}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008751] hover:underline cursor-pointer disabled:opacity-50"
                        >
                          {checkingRef === row.reference ? (
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
