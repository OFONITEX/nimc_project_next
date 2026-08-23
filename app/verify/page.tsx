import type { Metadata } from 'next';
import { VerifyNinPage } from '@/components/modules/verify/VerifyNinPage';

export const metadata: Metadata = {
  title: 'NIN Verification',
  description: 'Instant NIMC National Identity Number verification by NIN, phone number, or demographics.',
};

export default function Page() {
  return <VerifyNinPage />;
}
