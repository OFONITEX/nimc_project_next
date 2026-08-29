'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addAgentSchema, AddAgentFormValues } from '@/schemas/admin';
import { FormFieldInput } from '@/components/ui/molecules/FormFieldInput';
import { Button } from '@/components/ui/atoms/Button';

export interface AddAgentFormProps {
  onSubmit: (values: AddAgentFormValues) => Promise<void>;
  isLoading: boolean;
}

export function AddAgentForm({ onSubmit, isLoading }: AddAgentFormProps) {
  const { control, handleSubmit, register, reset } = useForm<AddAgentFormValues>({
    resolver: zodResolver(addAgentSchema),
    defaultValues: {
      email: '',
      role: 'agent',
      agentNinPrice: 300,
      agentBvnPrice: 300,
    },
  });

  const handleFormSubmit = async (values: AddAgentFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <FormFieldInput
          name="email"
          control={control}
          label="User Email Address"
          placeholder="e.g. agent@example.com"
          disabled={isLoading}
          data-testid="add-agent-email-input"
        />

        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Account Role
          </label>
          <select
            {...register('role')}
            disabled={isLoading}
            className="flex h-10 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="agent">Agent (Special Pricing)</option>
            <option value="operator">Standard Operator</option>
            <option value="admin">System Admin</option>
          </select>
        </div>

        <FormFieldInput
          name="agentNinPrice"
          control={control}
          label="NIN Lookup Price (₦)"
          type="number"
          placeholder="300"
          disabled={isLoading}
        />

        <FormFieldInput
          name="agentBvnPrice"
          control={control}
          label="BVN Lookup Price (₦)"
          type="number"
          placeholder="300"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="default"
          isLoading={isLoading}
          className="font-bold px-6"
          data-testid="add-agent-submit-button"
        >
          {isLoading ? 'Saving Agent...' : 'Assign / Update Agent Role'}
        </Button>
      </div>
    </form>
  );
}
