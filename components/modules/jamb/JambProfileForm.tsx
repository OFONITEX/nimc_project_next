'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jambServiceSchema, JambServiceFormValues } from '@/schemas/verification';
import { FormFieldInput } from '@/components/ui/molecules/FormFieldInput';
import { Button } from '@/components/ui/atoms/Button';

export interface JambProfileFormProps {
  onSubmit: (values: JambServiceFormValues) => Promise<void>;
  isLoading: boolean;
}

export function JambProfileForm({ onSubmit, isLoading }: JambProfileFormProps) {
  const { control, handleSubmit } = useForm<JambServiceFormValues>({
    resolver: zodResolver(jambServiceSchema),
    defaultValues: {
      nin: '',
      phoneNumber: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormFieldInput
        name="nin"
        control={control}
        label="Candidate National Identity Number (NIN)"
        placeholder="e.g. 12345678901"
        maxLength={11}
        disabled={isLoading}
        data-testid="jamb-nin-input"
      />

      <FormFieldInput
        name="phoneNumber"
        control={control}
        label="SIM / Registered Phone Number"
        placeholder="e.g. 08012345678"
        disabled={isLoading}
        data-testid="jamb-phone-input"
      />

      <Button
        type="submit"
        variant="default"
        fullWidth
        isLoading={isLoading}
        className="h-11 font-bold shadow-sm"
        data-testid="jamb-submit-button"
      >
        {isLoading ? 'Generating Profile Code...' : 'Generate JAMB Profile Code'}
      </Button>
    </form>
  );
}
