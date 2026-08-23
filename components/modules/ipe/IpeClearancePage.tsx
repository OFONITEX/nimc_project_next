'use client';

import * as React from 'react';
import { CheckCircle2, ShieldCheck, Search } from 'lucide-react';
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
    <ContentWidthContainer variant="narrow" className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          IPE Clearance &amp; Passport Services
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Immigration and Passport Enrollment (IPE) verification and identity validation clearance.
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-t-4 border-t-teal-600 shadow-card">
        {result ? (
          <div className="text-center space-y-4 animate-in fade-in-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">IPE Clearance Status: ACTIVE</h3>
            <p className="text-xs text-muted-foreground">{result}</p>
            <Button variant="outline" size="sm" onClick={() => setResult(null)}>
              Clear Another NIN
            </Button>
          </div>
        ) : (
          <form onSubmit={handleClearance} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80 block mb-1.5">
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
              className="h-11 font-bold shadow-sm"
            >
              {isLoading ? 'Checking IPE Clearance...' : 'Perform IPE Clearance Check'}
            </Button>
          </form>
        )}
      </Card>
    </ContentWidthContainer>
  );
}
