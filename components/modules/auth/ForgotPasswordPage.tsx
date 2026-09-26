'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ForgotPasswordFormValues } from '@/schemas/auth';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export function ForgotPasswordPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleForgotPasswordSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/reset-password/`;
      const { error } = await supabase.auth.resetPasswordForEmail(values.email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to send reset link. Please try again.');
      } else {
        setSuccessMessage(
          `Password reset link sent! Please check your email inbox (and spam folder) for the recovery link.`
        );
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

        <div className="text-center mb-4">
          <h3 className="text-lg font-black text-gray-900 leading-tight">Reset Password</h3>
          <p className="text-xs text-gray-500 mt-1">
            Enter your registered email address to receive a secure recovery link.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#008751] mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-green-800">Check your email</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit} isLoading={isLoading} />

        <div className="mt-4 border-t border-gray-100 pt-3 text-center text-xs text-gray-500">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-bold text-[#008751] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
