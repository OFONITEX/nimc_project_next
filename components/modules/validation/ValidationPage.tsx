'use client';

import * as React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { NinValidationFormValues } from '@/schemas/verification';
import { Card } from '@/components/ui/atoms/Card';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { ValidationForm } from './ValidationForm';

export function ValidationPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [isLoading, setIsLoading] = React.useState(false);
  const [successResult, setSuccessResult] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  if (!currentUser) return null;

  const handleValidationSubmit = async (values: NinValidationFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessResult(null);

    // Simulate validation request
    setTimeout(() => {
      setIsLoading(false);
      setSuccessResult(
        `NIN ${values.nin} has been queued for ${values.validationType.toUpperCase()} validation. Status: SYNCHRONIZED`
      );
    }, 1200);
  };

  return (
    <ContentWidthContainer variant="narrow" className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          NIN Validation &amp; Clearing
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Perform SIM link clearing, No-Record verification, and telecommunications backend sync.
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-t-4 border-t-emerald-600 shadow-card">
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive-light/60 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successResult && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-success/20 bg-success-light/60 p-3 text-xs text-success">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successResult}</span>
          </div>
        )}

        <ValidationForm onSubmit={handleValidationSubmit} isLoading={isLoading} />
      </Card>
    </ContentWidthContainer>
  );
}
