'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  PenTool,
  ArrowLeft,
  Clock,
  AlertCircle,
  Send,
  RotateCcw,
  CheckCircle2,
  Download,
  FileCheck,
  Loader2,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateWalletBalance } from '@/redux/slices/authSlice';
import { formatMoney } from '@/helpers/format/formatMoney';
import { supabase } from '@/lib/supabase/client';

export function PersonalizationPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // Submit form state
  const [trackingId, setTrackingId] = React.useState('');
  const [slipType, setSlipType] = React.useState('premium');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState<{
    tracking_id: string;
    category?: string;
    slip_type?: string;
    provider_message?: string;
  } | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Check status state
  const [checkTrackingId, setCheckTrackingId] = React.useState('');
  const [isChecking, setIsChecking] = React.useState(false);
  const [statusResult, setStatusResult] = React.useState<{
    success: boolean;
    status: string;
    message?: string;
    download_url?: string;
    personalized?: boolean;
    data?: {
      firstName?: string;
      lastName?: string;
      idNumber?: string;
      dateOfBirth?: string;
    };
  } | null>(null);
  const [checkError, setCheckError] = React.useState<string | null>(null);

  if (!currentUser) return null;

  const handleSubmitPersonalization = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTracking = trackingId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
    if (!cleanTracking || cleanTracking.length < 5) {
      setSubmitError('Please enter a valid 15-character NIMC Tracking ID.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        authHeaders['Authorization'] = `Bearer ${session.access_token}`;
      }

      const resp = await fetch('/api/personalization', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          tracking_id: cleanTracking,
          slip_type: slipType,
        }),
      });

      const data = await resp.json();

      if (data.success) {
        setSubmitSuccess({
          tracking_id: data.tracking_id || cleanTracking,
          category: data.category || 'Adult',
          slip_type: data.slip_type || slipType,
          provider_message:
            data.provider_message ||
            'Personalization request successfully received and queued.',
        });
        setCheckTrackingId(cleanTracking);
        setTrackingId('');

        if (data.new_balance !== undefined) {
          dispatch(updateWalletBalance(data.new_balance));
        }
      } else {
        setSubmitError(data.error || 'Failed to submit personalization request.');
      }
    } catch (err: any) {
      setSubmitError(
        err.message || 'Network error submitting personalization request.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTracking = checkTrackingId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
    if (!cleanTracking) {
      setCheckError('Please enter a Tracking ID to check status.');
      return;
    }

    setIsChecking(true);
    setCheckError(null);
    setStatusResult(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        authHeaders['Authorization'] = `Bearer ${session.access_token}`;
      }

      const resp = await fetch('/api/personalization-status', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          tracking_id: cleanTracking,
        }),
      });

      const data = await resp.json();

      if (data.success) {
        setStatusResult(data);
      } else {
        setCheckError(data.error || 'Failed to retrieve personalization status.');
      }
    } catch (err: any) {
      setCheckError(
        err.message || 'Network error checking personalization status.'
      );
    } finally {
      setIsChecking(false);
    }
  };

  const isCompleted =
    statusResult &&
    (String(statusResult.status).toLowerCase() === 'completed' ||
      statusResult.personalized);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── 1. Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a7a4a] to-[#0d4f2f] text-white shadow-sm">
            <PenTool className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              NIN Personalization
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Generate &amp; download personalized NIN slips using Tracking ID | Fee: <strong className="text-[#008751]">₦1,000</strong>
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back to Dashboard
        </Link>
      </div>

      {/* ── 2. Notice Banners ── */}
      <div className="space-y-2.5">
        {/* Blue Info Notice Box */}
        <div className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-sky-800">
          <Clock className="h-4 w-4 shrink-0 mt-0.5 text-sky-600" />
          <div>
            If you sent a personalization refresh request, please wait <strong>1–5 mins</strong> and then check again. Your updated result should be available.
          </div>
        </div>

        {/* Red Warning Notice Box */}
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <strong>Please note:</strong> Refunds are no longer available for this service, because we ourselves no longer receive refunds for failed services from the source.
          </div>
        </div>
      </div>

      {/* ── 3. Dual Forms Layout (Submit + Check Status) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Card 1: Submit Request */}
        <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Send className="h-5 w-5 text-[#008751]" />
            <h3 className="font-extrabold text-base text-gray-900">
              Request Personalization (₦1,000)
            </h3>
          </div>

          <form onSubmit={handleSubmitPersonalization} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                15-Character NIMC Tracking ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 25))}
                placeholder="e.g. S7Y0OG319000HEI"
                maxLength={25}
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 text-base sm:text-sm font-mono uppercase text-gray-900 placeholder:text-gray-400 focus:border-[#008751] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008751]/15 transition-all"
                required
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Enter your 15-character NIMC enrollment tracking ID (e.g. S7Y0OG319000HEI).
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                Slip Type
              </label>
              <select
                value={slipType}
                onChange={(e) => setSlipType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 text-base sm:text-sm text-gray-900 focus:border-[#008751] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008751]/15 transition-all"
              >
                <option value="premium">Premium Slip (Recommended)</option>
                <option value="standard">Standard Slip</option>
                <option value="regular">Regular Slip</option>
                <option value="vnin">VNIN Slip</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#008751] px-4 py-3 text-sm font-bold text-white hover:bg-[#007043] disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <PenTool className="h-4 w-4" /> Submit Personalization (₦1,000)
                </>
              )}
            </button>
          </form>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-xs text-green-900 space-y-1.5 animate-in fade-in-50">
              <div className="flex items-center gap-1.5 font-bold text-green-800 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Submitted Successfully!
              </div>
              <div>
                Tracking ID: <strong className="font-mono">{submitSuccess.tracking_id}</strong>
              </div>
              <div>
                Category: <strong>{submitSuccess.category}</strong> | Slip:{' '}
                <strong>{submitSuccess.slip_type}</strong>
              </div>
              <div className="text-gray-600 text-[11px] pt-1">
                {submitSuccess.provider_message}
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Check Status & Download Slip */}
        <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileCheck className="h-5 w-5 text-sky-600" />
            <h3 className="font-extrabold text-base text-gray-900">
              Check Status &amp; Download Slip
            </h3>
          </div>

          <form onSubmit={handleCheckStatus} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                15-Character Tracking ID
              </label>
              <input
                type="text"
                value={checkTrackingId}
                onChange={(e) => setCheckTrackingId(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 25))}
                placeholder="e.g. S7Y0OG319000HEI"
                maxLength={25}
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 text-base sm:text-sm font-mono uppercase text-gray-900 placeholder:text-gray-400 focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600/15 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-sky-600 bg-white px-4 py-3 text-sm font-bold text-sky-600 hover:bg-sky-50 disabled:opacity-50 transition-colors shadow-2xs"
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Checking Status...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" /> Check Status &amp; Get Slip URL
                </>
              )}
            </button>
          </form>

          {checkError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {checkError}
            </div>
          )}

          {statusResult && (
            <div
              className={`rounded-xl border p-4 text-xs space-y-2.5 animate-in fade-in-50 ${
                isCompleted
                  ? 'border-green-200 bg-green-50/90 text-green-900'
                  : 'border-sky-200 bg-sky-50/90 text-sky-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-sky-600" />
                  )}
                  Status: {String(statusResult.status).toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    isCompleted
                      ? 'bg-green-200 text-green-800'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {isCompleted ? 'COMPLETED' : 'PROCESSING'}
                </span>
              </div>

              {statusResult.message && (
                <div className="text-gray-700">{statusResult.message}</div>
              )}

              {statusResult.data && (
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-[11px] text-gray-800 space-y-1">
                  <div>
                    Name:{' '}
                    <strong>
                      {[
                        statusResult.data.firstName,
                        statusResult.data.lastName,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    </strong>
                  </div>
                  <div>
                    NIN:{' '}
                    <strong className="font-mono">
                      {statusResult.data.idNumber || '—'}
                    </strong>{' '}
                    | DOB:{' '}
                    <strong>{statusResult.data.dateOfBirth || '—'}</strong>
                  </div>
                </div>
              )}

              {statusResult.download_url ? (
                <a
                  href={`/api/download-pdf?url=${encodeURIComponent(
                    statusResult.download_url
                  )}`}
                  download={`Personalized NIN Slip ${checkTrackingId}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#008751] px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#007043] transition-colors shadow-xs"
                >
                  <Download className="h-4 w-4" /> Download Personalized Slip PDF
                </a>
              ) : (
                !isCompleted && (
                  <div className="text-[11px] text-gray-500 italic">
                    Download link will appear here once processing completes.
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
