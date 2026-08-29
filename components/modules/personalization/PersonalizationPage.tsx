'use client';

import * as React from 'react';
import { IdCard, CheckCircle2, Printer } from 'lucide-react';
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
    <ContentWidthContainer variant="narrow" className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
          <IdCard className="h-6 w-6" />
        </div>
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
          NIN Slip Personalization
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
          Generate premium printable NIMC slips, color certificates, and wallet-sized plastic cards.
        </p>
      </div>

      <Card className="p-3 sm:p-4 border-t-4 border-t-amber-500 shadow-xs">
        {generatedSlip ? (
          <div className="text-center space-y-3.5 animate-in fade-in-50">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">Slip Generated Successfully</h3>
            <p className="text-xs text-muted-foreground">
              Personalized layout for NIN <strong className="font-mono">{generatedSlip.nin}</strong> ({generatedSlip.format.toUpperCase()}) is ready.
            </p>
            <div className="flex gap-2.5 justify-center pt-2">
              <Button variant="default" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs h-9">
                <Printer className="h-3.5 w-3.5" /> Print / Save PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => setGeneratedSlip(null)} className="text-xs h-9">
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
