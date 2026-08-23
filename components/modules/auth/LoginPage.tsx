'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { LoginFormValues } from '@/schemas/auth';
import { LoginForm } from './LoginForm';
import { Card } from '@/components/ui/atoms/Card';

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
            Welcome Back
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Log in to access your NIN &amp; BVN Verification Portal
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive-light/60 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

        <div className="mt-6 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-bold text-primary hover:underline hover:text-primary-hover"
          >
            Create Account
          </Link>
        </div>
      </Card>
    </div>
  );
}
