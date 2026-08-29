'use client';

import * as React from 'react';
import { FileCheck2, Hash, Phone, AlertCircle } from 'lucide-react';
import { useVerifyIdentityMutation, VerifyPayload } from '@/redux/api/verificationApi';
import { NinVerificationData } from '@/models/verification/Verification';
import { parseApiError } from '@/helpers/api/errorParser';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { VerifyNinForm } from './VerifyNinForm';
import { VerifyResultCard } from './VerifyResultCard';

export function VerifyNinPage() {
  const [activeTab, setActiveTab] = React.useState<'nin' | 'phone' | 'demo'>('nin');
  const [resultData, setResultData] = React.useState<NinVerificationData | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [verifyIdentity, { isLoading, isError, error, reset }] = useVerifyIdentityMutation();

  React.useEffect(() => {
    if (isError && error) {
      setErrorMessage(parseApiError(error, 'Verification lookup failed'));
    }
  }, [isError, error]);

  const handleVerifySubmit = async (payload: VerifyPayload) => {
    setErrorMessage(null);
    setResultData(null);
    reset();

    try {
      const response = await verifyIdentity(payload).unwrap();
      if (response.success && response.data) {
        setResultData(response.data as NinVerificationData);
      } else {
        setErrorMessage(response.error || 'Verification query was not successful');
      }
    } catch (err) {
      setErrorMessage(parseApiError(err, 'Failed to perform verification lookup'));
    }
  };

  const handleReset = () => {
    setResultData(null);
    setErrorMessage(null);
    reset();
  };

  return (
    <ContentWidthContainer variant="wide" className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <FileCheck2 className="h-6 w-6 text-primary shrink-0" />
          National Identity Number (NIN) Verification
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Perform instant NIMC verification by NIN Number, Registered Phone Number, or Demographics.
        </p>
      </div>

      {resultData ? (
        <VerifyResultCard data={resultData} onReset={handleReset} />
      ) : (
        <div className="space-y-6">
          {/* Verification Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
            <Button
              variant={activeTab === 'nin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('nin');
                setErrorMessage(null);
              }}
              className="gap-2 text-xs"
            >
              <Hash className="h-3.5 w-3.5" /> Verify by NIN
            </Button>
            <Button
              variant={activeTab === 'phone' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('phone');
                setErrorMessage(null);
              }}
              className="gap-2 text-xs"
            >
              <Phone className="h-3.5 w-3.5" /> Verify by Phone
            </Button>
            <Button
              variant={activeTab === 'demo' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('demo');
                setErrorMessage(null);
              }}
              className="gap-2 text-xs"
            >
              <FileCheck2 className="h-3.5 w-3.5" /> Verify by Demographics
            </Button>
          </div>

          {/* Form Card */}
          <Card className="p-6 border-t-4 border-t-primary shadow-card">
            {errorMessage && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive-light/60 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <VerifyNinForm
              activeTab={activeTab}
              onSubmit={handleVerifySubmit}
              isLoading={isLoading}
            />
          </Card>
        </div>
      )}
    </ContentWidthContainer>
  );
}
