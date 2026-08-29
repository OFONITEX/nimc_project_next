'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ninVerifySchema,
  phoneVerifySchema,
  demoVerifySchema,
  NinVerifyFormValues,
  PhoneVerifyFormValues,
  DemoVerifyFormValues,
} from '@/schemas/verification';
import { FormFieldInput } from '@/components/ui/molecules/FormFieldInput';
import { Button } from '@/components/ui/atoms/Button';
import { VerifyPayload } from '@/redux/api/verificationApi';

export interface VerifyNinFormProps {
  activeTab: 'nin' | 'phone' | 'demo';
  onSubmit: (payload: VerifyPayload) => Promise<void>;
  isLoading: boolean;
}

export function VerifyNinForm({ activeTab, onSubmit, isLoading }: VerifyNinFormProps) {
  // 1. NIN Form
  const ninForm = useForm<NinVerifyFormValues>({
    resolver: zodResolver(ninVerifySchema),
    defaultValues: { nin: '' },
  });

  // 2. Phone Form
  const phoneForm = useForm<PhoneVerifyFormValues>({
    resolver: zodResolver(phoneVerifySchema),
    defaultValues: { phoneNumber: '' },
  });

  // 3. Demographics Form
  const demoForm = useForm<DemoVerifyFormValues>({
    resolver: zodResolver(demoVerifySchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      dob: '',
      gender: 'male',
    },
  });

  const handleNinSubmit = async (values: NinVerifyFormValues) => {
    await onSubmit({
      verification_type: 'nin',
      nin: values.nin.trim(),
    });
  };

  const handlePhoneSubmit = async (values: PhoneVerifyFormValues) => {
    await onSubmit({
      verification_type: 'phone',
      phone_number: values.phoneNumber.trim(),
    });
  };

  const handleDemoSubmit = async (values: DemoVerifyFormValues) => {
    await onSubmit({
      verification_type: 'demo',
      firstname: values.firstname.trim(),
      lastname: values.lastname.trim(),
      dob: values.dob,
      gender: values.gender,
    });
  };

  if (activeTab === 'nin') {
    return (
      <form onSubmit={ninForm.handleSubmit(handleNinSubmit)} className="space-y-4" noValidate>
        <FormFieldInput
          name="nin"
          control={ninForm.control}
          label="11-Digit National Identity Number (NIN)"
          placeholder="e.g. 12345678901"
          maxLength={11}
          disabled={isLoading}
          data-testid="verify-nin-input"
        />
        <Button
          type="submit"
          variant="default"
          isLoading={isLoading}
          className="h-11 px-6 font-bold"
          data-testid="verify-nin-submit-button"
        >
          {isLoading ? 'Verifying NIN...' : 'Perform NIN Verification'}
        </Button>
      </form>
    );
  }

  if (activeTab === 'phone') {
    return (
      <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4" noValidate>
        <FormFieldInput
          name="phoneNumber"
          control={phoneForm.control}
          label="Registered NIN Phone Number"
          placeholder="e.g. 08012345678"
          disabled={isLoading}
          data-testid="verify-phone-input"
        />
        <Button
          type="submit"
          variant="default"
          isLoading={isLoading}
          className="h-11 px-6 font-bold"
          data-testid="verify-phone-submit-button"
        >
          {isLoading ? 'Verifying Phone...' : 'Perform Phone Verification'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={demoForm.handleSubmit(handleDemoSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormFieldInput
          name="firstname"
          control={demoForm.control}
          label="First Name"
          placeholder="e.g. Adebayo"
          disabled={isLoading}
        />
        <FormFieldInput
          name="lastname"
          control={demoForm.control}
          label="Last Name / Surname"
          placeholder="e.g. Adeleke"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormFieldInput
          name="dob"
          control={demoForm.control}
          label="Date of Birth"
          type="date"
          disabled={isLoading}
        />

        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Gender
          </label>
          <select
            {...demoForm.register('gender')}
            disabled={isLoading}
            className="flex h-10 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        isLoading={isLoading}
        className="h-11 px-6 font-bold"
        data-testid="verify-demo-submit-button"
      >
        {isLoading ? 'Verifying Demographics...' : 'Perform Demographic Verification'}
      </Button>
    </form>
  );
}
