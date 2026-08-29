'use client';

import * as React from 'react';
import { IdCard, CheckCircle2, AlertCircle, Printer, Download } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { PersonalizationFormValues } from '@/schemas/verification';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { PersonalizationForm } from './PersonalizationForm';

export function PersonalizationPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [isLoading, setIsLoading] = React.useState(false);
  const [generatedSlip, setGeneratedSlip] = React.useState<{ nin: string; format: string } | null>(null);

  if (!currentUser) return null;

  const handlePersonalizationSubmit = async (values: PersonalizationFormValues) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setGeneratedSlip({
        nin: values.nin,
        format: values.format,
      });
    }, 1200);
  };

  return (
    <ContentWidthContainer variant="narrow" className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
          <IdCard className="h-7 w-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          NIN Slip Personalization
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Generate premium printable NIMC slips, color certificates, and wallet-sized plastic cards.
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-t-4 border-t-amber-500 shadow-card">
        {generatedSlip ? (
          <div className="text-center space-y-4 animate-in fade-in-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Slip Generated Successfully</h3>
            <p className="text-xs text-muted-foreground">
              Personalized layout for NIN <strong className="font-mono">{generatedSlip.nin}</strong> ({generatedSlip.format.toUpperCase()}) is ready.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="default" size="sm" onClick={() => window.print()} className="gap-2">
                <Printer className="h-4 w-4" /> Print / Save PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => setGeneratedSlip(null)}>
                Generate Another
              </Button>
            </div>
          </div>
        ) : (
          <PersonalizationForm onSubmit={handlePersonalizationSubmit} isLoading={isLoading} />
        )}
      </Card>
    </ContentWidthContainer>
  );
}
