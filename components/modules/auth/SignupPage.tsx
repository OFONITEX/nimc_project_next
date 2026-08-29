'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { SignupForm } from './SignupForm';

export interface FullSignupValues {
  surname: string;
  firstname: string;
  othername?: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function SignupPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSignupSubmit = async (values: FullSignupValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullName = `${values.firstname.trim()} ${values.othername ? values.othername.trim() + ' ' : ''}${values.surname.trim()}`.trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: {
            full_name: fullName,
            firstname: values.firstname.trim(),
            surname: values.surname.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to create account');
      } else if (data.user) {
        // Upsert user profile record in users table
        await supabase.from('users').upsert({
          id: data.user.id,
          email: values.email.trim(),
          full_name: fullName,
          role: 'operator',
          wallet_balance: 0.0,
        });

        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#004d2e] via-[#007a47] to-[#00a85a] p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[540px] rounded-3xl bg-white p-7 sm:p-10 shadow-2xl border border-white/20">
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
          <h3 className="text-xl font-black text-gray-900">Create your account</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Sign up to start verifying identities
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <SignupForm onSubmit={handleSignupSubmit} isLoading={isLoading} />

        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#008751] hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
