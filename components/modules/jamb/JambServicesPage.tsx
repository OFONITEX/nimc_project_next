'use client';

import * as React from 'react';
import { GraduationCap, CheckCircle2 } from 'lucide-react';
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
    <ContentWidthContainer variant="narrow" className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
          JAMB UTME Services
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
          Direct candidate profile code generation, UTME registration status, and NIMC validation.
        </p>
      </div>

      <Card className="p-3 sm:p-4 border-t-4 border-t-indigo-600 shadow-xs">
        {profileResult ? (
          <div className="text-center space-y-3 animate-in fade-in-50">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">Profile Code Generated</h3>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                10-Digit JAMB Profile Code
              </span>
              <div className="text-xl font-black text-indigo-600 tracking-widest font-mono mt-0.5">
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
