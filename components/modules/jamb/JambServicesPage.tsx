'use client';

import * as React from 'react';
import { GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { JambServiceFormValues } from '@/schemas/verification';
import { Card } from '@/components/ui/atoms/Card';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { JambProfileForm } from './JambProfileForm';

export function JambServicesPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileResult, setProfileResult] = React.useState<{ code: string; phone: string } | null>(null);

  if (!currentUser) return null;

  const handleJambSubmit = async (values: JambServiceFormValues) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Generate a mock 10-digit profile code
      const generatedCode = String(Math.floor(1000000000 + Math.random() * 9000000000));
      setProfileResult({
        code: generatedCode,
        phone: values.phoneNumber,
      });
    }, 1200);
  };

  return (
    <ContentWidthContainer variant="narrow" className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          JAMB UTME Services
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Direct candidate profile code generation, UTME registration status, and NIMC validation.
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-t-4 border-t-indigo-600 shadow-card">
        {profileResult ? (
          <div className="text-center space-y-4 animate-in fade-in-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Profile Code Generated</h3>
            <div className="p-4 rounded-xl bg-muted border border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                10-Digit JAMB Profile Code
              </span>
              <div className="text-2xl font-black text-indigo-600 tracking-widest font-mono mt-1">
                {profileResult.code}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Sent via SMS to candidate phone number: <strong>{profileResult.phone}</strong>.
            </p>
          </div>
        ) : (
          <JambProfileForm onSubmit={handleJambSubmit} isLoading={isLoading} />
        )}
      </Card>
    </ContentWidthContainer>
  );
}
