'use client';

import * as React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <ContentWidthContainer variant="narrow" className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
          NIN Validation &amp; Clearing
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
          Perform SIM link clearing, No-Record verification, and telecommunications backend sync.
        </p>
      </div>

      <Card className="p-4 sm:p-6 border-t-4 border-t-emerald-600 shadow-xs">
        {errorMessage && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successResult && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2.5 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successResult}</span>
          </div>
        )}

        <ValidationForm onSubmit={handleValidationSubmit} isLoading={isLoading} />
      </Card>
    </ContentWidthContainer>
  );
}
