'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormValues } from '@/schemas/auth';

export interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ResetPasswordForm({ onSubmit, isLoading }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            disabled={isLoading}
            {...register('password')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-base sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs font-semibold text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password_confirmation"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="password_confirmation"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat new password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register('password_confirmation')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-base sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password_confirmation && (
          <p className="mt-1 text-xs font-semibold text-red-500">
            {errors.password_confirmation.message}
          </p>
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
            Updating Password...
          </>
        ) : (
          'Update Password'
        )}
      </button>
    </form>
  );
}
