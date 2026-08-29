'use client';

import * as React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { Input } from '@/components/ui/atoms/Input';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';

export function IpeClearancePage() {
  const [ninInput, setNinInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const handleClearance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ninInput || ninInput.length !== 11) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResult(`NIN ${ninInput} is cleared for international passport and biometric enrollment.`);
    }, 1200);
  };

  return (
    <ContentWidthContainer variant="narrow" className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
          IPE Clearance &amp; Passport Services
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
          Immigration and Passport Enrollment (IPE) verification and identity validation clearance.
        </p>
      </div>

      <Card className="p-3 sm:p-4 border-t-4 border-t-teal-600 shadow-xs">
        {result ? (
          <div className="text-center space-y-3 animate-in fade-in-50">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">IPE Clearance Status: ACTIVE</h3>
            <p className="text-xs text-muted-foreground">{result}</p>
            <Button variant="outline" size="sm" onClick={() => setResult(null)} className="text-xs h-9">
              Clear Another NIN
            </Button>
          </div>
        ) : (
          <form onSubmit={handleClearance} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                Candidate 11-Digit NIN
              </label>
              <Input
                value={ninInput}
                onChange={(e) => setNinInput(e.target.value)}
                placeholder="e.g. 12345678901"
                maxLength={11}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              fullWidth
              isLoading={isLoading}
              className="h-10 font-bold shadow-xs text-xs"
            >
              {isLoading ? 'Checking IPE Clearance...' : 'Perform IPE Clearance Check'}
            </Button>
          </form>
        )}
      </Card>
    </ContentWidthContainer>
  );
}
