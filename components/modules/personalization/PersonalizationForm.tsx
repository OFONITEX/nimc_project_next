'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalizationSchema, PersonalizationFormValues } from '@/schemas/verification';
import { FormFieldInput } from '@/components/ui/molecules/FormFieldInput';
import { Button } from '@/components/ui/atoms/Button';

export interface PersonalizationFormProps {
  onSubmit: (values: PersonalizationFormValues) => Promise<void>;
  isLoading: boolean;
}

export function PersonalizationForm({ onSubmit, isLoading }: PersonalizationFormProps) {
  const { control, handleSubmit, register } = useForm<PersonalizationFormValues>({
    resolver: zodResolver(personalizationSchema),
    defaultValues: {
      nin: '',
      format: 'v2_premium',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormFieldInput
        name="nin"
        control={control}
        label="National Identity Number (NIN)"
        placeholder="e.g. 12345678901"
        maxLength={11}
        disabled={isLoading}
        data-testid="personalization-nin-input"
      />

      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
          Select Slip Format / Layout
        </label>
        <select
          {...register('format')}
          disabled={isLoading}
          className="flex h-10 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="v2_premium">Premium Color Slip (V2 Full Page with QR)</option>
          <option value="v1_standard">Standard Official Slip (V1 Green Border)</option>
          <option value="plastic_card">Wallet-Sized Laminated Plastic Card ID</option>
        </select>
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        isLoading={isLoading}
        className="h-11 font-bold shadow-sm"
        data-testid="personalization-submit-button"
      >
        {isLoading ? 'Generating Customized Slip...' : 'Personalize &amp; Download Slip'}
      </Button>
    </form>
  );
}
