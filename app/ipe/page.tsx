import type { Metadata } from 'next';
import { IpeClearancePage } from '@/components/modules/ipe/IpeClearancePage';

export const metadata: Metadata = {
  title: 'IPE Clearance',
  description: 'Immigration and Passport Enrollment (IPE) verification and biometric validation clearance.',
};

export default function Page() {
  return <IpeClearancePage />;
}
