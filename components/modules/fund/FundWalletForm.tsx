'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fundWalletSchema, FundWalletFormValues } from '@/schemas/wallet';
import { FormFieldInput } from '@/components/ui/molecules/FormFieldInput';
import { Button } from '@/components/ui/atoms/Button';

export interface FundWalletFormProps {
  onSubmit: (amount: number) => void;
  isLoading: boolean;
}

export function FundWalletForm({ onSubmit, isLoading }: FundWalletFormProps) {
  const { control, handleSubmit, setValue, watch } = useForm<FundWalletFormValues>({
    resolver: zodResolver(fundWalletSchema),
    defaultValues: {
      amount: 1000,
    },
  });

  const currentAmount = watch('amount');

  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  const handlePresetClick = (val: number) => {
    setValue('amount', val, { shouldValidate: true });
  };

  const handleFormSubmit = (data: FundWalletFormValues) => {
    onSubmit(data.amount);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Preset Pills */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80 block mb-2">
          Quick Amount Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={currentAmount === preset ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className="text-xs font-bold"
            >
              ₦{preset.toLocaleString()}
            </Button>
          ))}
        </div>
      </div>

      <FormFieldInput
        name="amount"
        control={control}
        label="Deposit Amount (₦)"
        type="number"
        placeholder="e.g. 1000"
        min={100}
        disabled={isLoading}
        data-testid="fund-amount-input"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setValue('amount', isNaN(val) ? 0 : val, { shouldValidate: true });
        }}
      />

      <Button
        type="submit"
        variant="default"
        fullWidth
        isLoading={isLoading}
        className="h-11 font-bold text-base shadow-sm"
        data-testid="fund-wallet-submit-button"
      >
        {isLoading ? 'Initializing Payment...' : 'Proceed to Secure Payment'}
      </Button>
    </form>
  );
}
