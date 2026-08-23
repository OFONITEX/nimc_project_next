'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { SignupFormValues } from '@/schemas/auth';
import { SignupForm } from './SignupForm';
import { Card } from '@/components/ui/atoms/Card';

export function SignupPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSignupSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: {
            full_name: values.fullName.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to create account');
      } else if (data.user) {
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-card border border-border bg-card">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-2xl border border-border shadow-xs">
            <img
              src="/img/ofonitech_logo.jpg"
              alt="OFONITECH Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Create Account
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Sign up to start verifying NIN, BVN &amp; Identity records
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive-light/60 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-success/20 bg-success-light/60 p-3 text-xs text-success">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <SignupForm onSubmit={handleSignupSubmit} isLoading={isLoading} />

        <div className="mt-6 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline hover:text-primary-hover"
          >
            Log In
          </Link>
        </div>
      </Card>
    </div>
  );
}
