'use client';

import * as React from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Wallet, ShieldCheck, CreditCard, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { Card } from '@/components/ui/atoms/Card';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { FundWalletForm } from './FundWalletForm';

export function FundWalletPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const router = useRouter();

  if (!currentUser) return null;

  const handleFundSubmit = (depositAmount: number) => {
    setIsLoading(true);
    setErrorMessage(null);

    if (window.MonnifySDK) {
      window.MonnifySDK.initialize({
        amount: depositAmount,
        currency: 'NGN',
        reference: `MNF_NIMC_${Date.now()}`,
        customerName: currentUser.full_name || currentUser.email,
        customerEmail: currentUser.email,
        apiKey: 'MK_PROD_BE6J2GKVL3',
        contractCode: '8206123490',
        paymentDescription: 'Wallet Funding on myninverify.com',
        isTestMode: false,
        onComplete: function () {
          setIsLoading(false);
          router.push('/dashboard');
        },
        onClose: function () {
          setIsLoading(false);
        },
      });
    } else {
      setErrorMessage('Payment SDK is loading. Please wait a moment and try again.');
      setIsLoading(false);
    }
  };

  return (
    <ContentWidthContainer variant="narrow" className="space-y-5">
      {/* Monnify SDK script */}
      <Script src="https://sdk.monnify.com/plugin/monnify.js" strategy="lazyOnload" />

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Wallet className="h-6 w-6" />
        </div>
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
          Fund User Wallet
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
          Instant automated deposit via Card, USSD, or Bank Transfer
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-4 sm:p-6 border-t-4 border-t-primary shadow-xs">
        {errorMessage && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <FundWalletForm onSubmit={handleFundSubmit} isLoading={isLoading} />

        {/* Security badges */}
        <div className="mt-5 pt-3.5 border-t border-border/60 grid grid-cols-2 gap-3 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-4 w-4 text-emerald-600 mb-0.5" />
            <span className="text-[11px] font-bold text-foreground">Bank Grade Security</span>
            <span className="text-[10px] text-muted-foreground">256-bit SSL encrypted</span>
          </div>
          <div className="flex flex-col items-center">
            <CreditCard className="h-4 w-4 text-sky-600 mb-0.5" />
            <span className="text-[11px] font-bold text-foreground">Instant Credit</span>
            <span className="text-[10px] text-muted-foreground">Automated wallet update</span>
          </div>
        </div>
      </Card>
    </ContentWidthContainer>
  );
}
