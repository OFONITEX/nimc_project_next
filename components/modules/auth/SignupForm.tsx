'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { FullSignupValues } from './SignupPage';

const fullSignupSchema = z
  .object({
    surname: z.string().min(1, 'Surname is required'),
    firstname: z.string().min(1, 'First name is required'),
    othername: z.string().optional(),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    password_confirmation: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  });

export interface SignupFormProps {
  onSubmit: (values: FullSignupValues) => Promise<void>;
  isLoading: boolean;
}

export function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FullSignupValues>({
    resolver: zodResolver(fullSignupSchema),
    defaultValues: {
      surname: '',
      firstname: '',
      othername: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Surname & First Name Side-by-Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="surname"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Surname <span className="text-red-500">*</span>
          </label>
          <input
            id="surname"
            type="text"
            placeholder="e.g. Okafor"
            disabled={isLoading}
            {...register('surname')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
          />
          {errors.surname && (
            <p className="mt-1 text-xs font-semibold text-red-500">{errors.surname.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="firstname"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstname"
            type="text"
            placeholder="e.g. Emeka"
            disabled={isLoading}
            {...register('firstname')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
          />
          {errors.firstname && (
            <p className="mt-1 text-xs font-semibold text-red-500">{errors.firstname.message}</p>
          )}
        </div>
      </div>

      {/* Other Name */}
      <div>
        <label
          htmlFor="othername"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Other Name <span className="text-gray-400 font-normal normal-case">(optional)</span>
        </label>
        <input
          id="othername"
          type="text"
          placeholder="Middle name"
          disabled={isLoading}
          {...register('othername')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="suEmail"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="suEmail"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register('email')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
        />
        {errors.email && (
          <p className="mt-1 text-xs font-semibold text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password & Confirm Password Side-by-Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="suPassword"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="suPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 chars"
              autoComplete="new-password"
              disabled={isLoading}
              {...register('password')}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
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
            htmlFor="suConfirm"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="suConfirm"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register('password_confirmation')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#008751] focus:bg-white focus:ring-2 focus:ring-[#008751]/20 disabled:opacity-60"
          />
          {errors.password_confirmation && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 rounded-xl bg-[#008751] py-3.5 text-sm font-bold text-white uppercase tracking-wider shadow-sm transition-all hover:bg-[#006b40] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Creating Account...
          </>
        ) : (
          'Sign Up'
        )}
      </button>
    </form>
  );
}
