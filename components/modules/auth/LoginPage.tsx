'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { LoginFormValues } from '@/schemas/auth';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

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
        router.push('/dashboard');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#004d2e] via-[#007a47] to-[#00a85a] p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-7 sm:p-10 shadow-2xl border border-white/20">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="h-14 w-14 overflow-hidden rounded-xl border border-gray-100 shadow-md">
            <img
              src="/img/ofonitech_logo.jpg"
              alt="OFONiTech Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
              OFONiTech SOLUTIONZ
            </h2>
            <span className="text-xs font-bold text-[#008751] tracking-wide">
              myninverify.com
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-gray-900">Welcome back</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Sign in to your myninverify account
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
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
