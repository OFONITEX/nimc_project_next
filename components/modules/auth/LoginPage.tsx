'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { LoginFormValues } from '@/schemas/auth';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [sessionTimedOut, setSessionTimedOut] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTimeout = sessionStorage.getItem('portal_inactivity_logout');
      if (isTimeout === 'true') {
        setSessionTimedOut(true);
        // Clear immediately so refreshing or manual revisit does not persist the banner
        sessionStorage.removeItem('portal_inactivity_logout');
      }
    }
  }, []);

  const handleLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        setErrorMessage(error.message || 'Invalid email or password');
      } else if (data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('portal_last_activity_timestamp', Date.now().toString());
          sessionStorage.removeItem('portal_inactivity_logout');
        }
        router.push('/dashboard');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#004d2e] via-[#007a47] to-[#00a85a] p-4 font-sans">
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
          <h3 className="text-lg font-black text-gray-900 leading-tight">Welcome back</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Sign in to your myninverify account
          </p>
        </div>

        {sessionTimedOut && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/90 p-3.5 text-amber-900 shadow-xs">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-950 leading-tight">Session Timed Out</h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                You were logged out after 12 hours of inactivity for account security. Please sign in again.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

        <div className="mt-4 border-t border-gray-100 pt-3 text-center text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-bold text-[#008751] hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
