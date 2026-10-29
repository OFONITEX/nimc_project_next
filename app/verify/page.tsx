import * as React from 'react';
import type { Metadata } from 'next';
import { VerifyNinPage } from '@/components/modules/verify/VerifyNinPage';

export const metadata: Metadata = {
  title: 'Identity Verification & BVN',
  description: 'Instant NIMC National Identity Number and BVN verification services.',
};

export default function Page() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading verification portal...</div>}>
      <VerifyNinPage />
    </React.Suspense>
  );
}
