'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ninValidationSchema, NinValidationFormValues } from '@/schemas/verification';
import { FormFieldInput } from '@/components/ui/molecules/FormFieldInput';
import { Button } from '@/components/ui/atoms/Button';

export interface ValidationFormProps {
  onSubmit: (values: NinValidationFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ValidationForm({ onSubmit, isLoading }: ValidationFormProps) {
  const { control, handleSubmit, register } = useForm<NinValidationFormValues>({
    resolver: zodResolver(ninValidationSchema),
    defaultValues: {
      nin: '',
      validationType: 'sim',
      trackingId: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormFieldInput
        name="nin"
        control={control}
        label="11-Digit NIN to Validate"
        placeholder="e.g. 12345678901"
        maxLength={11}
        disabled={isLoading}
        data-testid="validation-nin-input"
      />

      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
          Validation Type
        </label>
        <select
          {...register('validationType')}
          disabled={isLoading}
          className="flex h-10 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="sim">SIM Card / Telco Validation</option>
          <option value="no_record">No-Record NIN Clearing</option>
          <option value="modification">Modification &amp; Data Update Synchronization</option>
        </select>
      </div>

      <FormFieldInput
        name="trackingId"
        control={control}
        label="Tracking ID (Optional)"
        placeholder="e.g. TRK-984728"
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="default"
        fullWidth
        isLoading={isLoading}
        className="h-11 font-bold shadow-sm"
        data-testid="validation-submit-button"
      >
        {isLoading ? 'Processing Validation...' : 'Submit NIN for Validation'}
      </Button>
    </form>
  );
}
