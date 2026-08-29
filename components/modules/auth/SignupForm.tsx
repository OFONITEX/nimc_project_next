'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { signupSchema, SignupFormValues } from '@/schemas/auth';
import { FormFieldInput } from '@/components/ui/molecules/FormFieldInput';
import { Button } from '@/components/ui/atoms/Button';

export interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<void>;
  isLoading: boolean;
}

export function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormFieldInput
        name="fullName"
        control={control}
        label="Full Name"
        type="text"
        placeholder="e.g. John Doe"
        autoComplete="name"
        disabled={isLoading}
        data-testid="signup-fullname-input"
      />

      <FormFieldInput
        name="email"
        control={control}
        label="Email Address"
        type="email"
        placeholder="e.g. user@example.com"
        autoComplete="email"
        disabled={isLoading}
        data-testid="signup-email-input"
      />

      <div className="relative">
        <FormFieldInput
          name="password"
          control={control}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          disabled={isLoading}
          data-testid="signup-password-input"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        isLoading={isLoading}
        className="mt-2 h-11 text-base font-bold shadow-sm"
        data-testid="signup-submit-button"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
