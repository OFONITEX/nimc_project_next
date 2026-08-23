'use client';

import * as React from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Wallet, ShieldCheck, CreditCard, Banknote, AlertCircle } from 'lucide-react';
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
    <ContentWidthContainer variant="narrow" className="space-y-6">
      {/* Monnify SDK script */}
      <Script src="https://sdk.monnify.com/plugin/monnify.js" strategy="lazyOnload" />

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wallet className="h-7 w-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Fund User Wallet
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Instant automated deposit via Card, USSD, or Bank Transfer
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-6 sm:p-8 border-t-4 border-t-primary shadow-card">
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive-light/60 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <FundWalletForm onSubmit={handleFundSubmit} isLoading={isLoading} />

        {/* Security badges */}
        <div className="mt-8 pt-4 border-t border-border/60 grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-5 w-5 text-emerald-600 mb-1" />
            <span className="text-[11px] font-bold text-foreground">Bank Grade Security</span>
            <span className="text-[10px] text-muted-foreground">256-bit SSL encrypted</span>
          </div>
          <div className="flex flex-col items-center">
            <CreditCard className="h-5 w-5 text-sky-600 mb-1" />
            <span className="text-[11px] font-bold text-foreground">Instant Credit</span>
            <span className="text-[10px] text-muted-foreground">Automated wallet update</span>
          </div>
        </div>
      </Card>
    </ContentWidthContainer>
  );
}
