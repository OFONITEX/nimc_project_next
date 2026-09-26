'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/schemas/auth';

export interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ForgotPasswordForm({ onSubmit, isLoading }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register('email')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
        />
        {errors.email && (
          <p className="mt-1 text-xs font-semibold text-red-500">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 rounded-xl bg-[#008751] py-3.5 text-sm font-bold text-white uppercase tracking-wider shadow-sm transition-all hover:bg-[#006b40] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending Link...
          </>
        ) : (
          'Send Reset Link'
        )}
      </button>
    </form>
  );
}
