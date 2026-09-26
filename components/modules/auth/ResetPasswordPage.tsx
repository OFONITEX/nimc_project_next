'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ResetPasswordFormValues } from '@/schemas/auth';
import { ResetPasswordForm } from './ResetPasswordForm';

export function ResetPasswordPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionChecked, setSessionChecked] = React.useState(false);
  const [isRecoveryReady, setIsRecoveryReady] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let mounted = true;

    // Listen for auth state change (e.g. PASSWORD_RECOVERY or established session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || (session && session.user)) {
        setIsRecoveryReady(true);
        setSessionChecked(true);
      }
    });

    async function checkRecoverySession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        // Check if hash or query parameters contain recovery indicators
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const hasRecoveryHash = hash.includes('type=recovery') || hash.includes('access_token');
        const hasCode = params?.has('code');

        if (session?.user || hasRecoveryHash || hasCode) {
          setIsRecoveryReady(true);
        } else {
          setIsRecoveryReady(false);
        }
      } catch {
        if (mounted) setIsRecoveryReady(false);
      } finally {
        if (mounted) setSessionChecked(true);
      }
    }

    checkRecoverySession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleResetSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to update password. Please try again.');
      } else {
        setSuccessMessage('Password updated successfully! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1800);
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#004d2e] via-[#007a47] to-[#00a85a] px-4 py-8 sm:py-12 font-sans">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 sm:p-7 shadow-xl border border-white/20">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-1.5 mb-4">
          <div className="h-11 w-11 overflow-hidden rounded-xl border border-gray-100 shadow-xs">
            <img
              src="/img/ofonitech_logo.jpg"
              alt="OFONiTech Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight leading-tight">
              OFONiTech SOLUTIONZ
            </h2>
            <span className="text-[11px] font-bold text-[#008751] tracking-wide block">
              myninverify.com
            </span>
          </div>
        </div>

        {!sessionChecked ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008751] border-t-transparent mb-3" />
            <p className="text-xs text-gray-500 font-medium">Verifying reset link...</p>
          </div>
        ) : !isRecoveryReady ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">
              Invalid or Expired Link
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 mb-5 leading-relaxed">
              This password reset link is invalid or has expired. Please request a fresh link to reset your password.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#008751] py-3 text-sm font-bold text-white uppercase tracking-wider shadow-sm transition-all hover:bg-[#006b40]"
            >
              Request New Link
            </Link>
            <div className="mt-4 border-t border-gray-100 pt-3 text-center text-xs text-gray-500">
              <Link href="/login" className="font-bold text-[#008751] hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-gray-900 leading-tight">
                Create New Password
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter your new password below to regain account access.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2.5 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#008751]" />
                <span>{successMessage}</span>
              </div>
            )}

            <ResetPasswordForm onSubmit={handleResetSubmit} isLoading={isLoading} />

            <div className="mt-4 border-t border-gray-100 pt-3 text-center text-xs text-gray-500">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-bold text-[#008751] hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
