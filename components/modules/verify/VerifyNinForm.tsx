'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Hash, ShieldCheck } from 'lucide-react';
import {
  ninVerifySchema,
  phoneVerifySchema,
  demoVerifySchema,
  bvnVerifySchema,
  NinVerifyFormValues,
  PhoneVerifyFormValues,
  DemoVerifyFormValues,
  BvnVerifyFormValues,
} from '@/schemas/verification';
import { FormFieldInput } from '@/components/ui/molecules/FormFieldInput';
import { Button } from '@/components/ui/atoms/Button';
import { Badge } from '@/components/ui/atoms/Badge';
import { VerifyPayload } from '@/redux/api/verificationApi';

export interface VerifyNinFormProps {
  activeTab: 'nin' | 'phone' | 'demo' | 'bvn';
  initialSlip?: string;
  onSubmit: (payload: VerifyPayload) => Promise<void>;
  isLoading: boolean;
}

export function VerifyNinForm({ activeTab, initialSlip, onSubmit, isLoading }: VerifyNinFormProps) {
  const [bvnMode, setBvnMode] = React.useState<'phone' | 'bvn'>('phone');

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

  // 4. BVN Form
  const bvnForm = useForm<BvnVerifyFormValues>({
    resolver: zodResolver(bvnVerifySchema),
    defaultValues: {
      mode: 'phone',
      phoneNumber: '',
      bvn: '',
      slipType: (initialSlip as any) || 'basic',
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

  const handleBvnSubmit = async (values: BvnVerifyFormValues) => {
    if (bvnMode === 'phone') {
      const phone = (values.phoneNumber || '').trim();
      if (!phone || phone.length < 11) {
        bvnForm.setError('phoneNumber', { message: 'Please enter a valid 11-digit phone number' });
        return;
      }
      await onSubmit({
        verification_type: 'bvn',
        phone_number: phone,
        slip_type: values.slipType || initialSlip || 'basic',
      });
    } else {
      const bvnNum = (values.bvn || '').trim();
      if (!bvnNum || bvnNum.length !== 11) {
        bvnForm.setError('bvn', { message: 'BVN must be exactly 11 digits' });
        return;
      }
      await onSubmit({
        verification_type: 'bvn',
        bvn: bvnNum,
        slip_type: values.slipType || initialSlip || 'basic',
      });
    }
  };

  if (activeTab === 'bvn') {
    return (
      <form onSubmit={bvnForm.handleSubmit(handleBvnSubmit)} className="space-y-4" noValidate>
        {/* Sub-Tabs: Retrieve by Phone vs Verify by BVN */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <Button
            type="button"
            variant={bvnMode === 'phone' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setBvnMode('phone');
              bvnForm.setValue('mode', 'phone');
              bvnForm.clearErrors();
            }}
            className="text-xs h-7 gap-1.5"
          >
            <Phone className="h-3 w-3" /> Retrieve with Phone Number
          </Button>

          <Button
            type="button"
            variant={bvnMode === 'bvn' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setBvnMode('bvn');
              bvnForm.setValue('mode', 'bvn');
              bvnForm.clearErrors();
            }}
            className="text-xs h-7 gap-1.5"
          >
            <Hash className="h-3 w-3" /> Verify by BVN Number
          </Button>
        </div>

        {bvnMode === 'phone' ? (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Retrieve linked BVN using customer registered phone number.
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                <ShieldCheck className="h-3 w-3" /> Auto-Refund Protection
              </Badge>
            </div>
            <FormFieldInput
              name="phoneNumber"
              control={bvnForm.control}
              label="Registered Phone Number for BVN"
              placeholder="e.g. 08012345678"
              maxLength={14}
              disabled={isLoading}
              data-testid="verify-bvn-phone-input"
            />
          </div>
        ) : (
          <div>
            <div className="mb-2 text-xs text-muted-foreground">
              Lookup and generate slips for an existing 11-digit BVN.
            </div>
            <FormFieldInput
              name="bvn"
              control={bvnForm.control}
              label="11-Digit Bank Verification Number (BVN)"
              placeholder="e.g. 22233344455"
              maxLength={11}
              disabled={isLoading}
              data-testid="verify-bvn-input"
            />
          </div>
        )}

        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Slip Format
          </label>
          <select
            {...bvnForm.register('slipType')}
            disabled={isLoading}
            className="flex h-10 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="basic">Basic Slip (₦200)</option>
            <option value="plastic">Plastic Card (₦300)</option>
            <option value="regular_pro">Regular Pro Slip (₦300)</option>
          </select>
        </div>

        <Button
          type="submit"
          variant="default"
          isLoading={isLoading}
          className="h-11 px-6 font-bold"
          data-testid="verify-bvn-submit-button"
        >
          {isLoading
            ? 'Retrieving BVN Records...'
            : bvnMode === 'phone'
            ? 'Retrieve BVN by Phone'
            : 'Perform BVN Lookup'}
        </Button>
      </form>
    );
  }

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
