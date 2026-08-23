import type { Metadata } from 'next';
import { VerificationLogsPage } from '@/components/modules/logs/VerificationLogsPage';

export const metadata: Metadata = {
  title: 'Verification Logs',
  description: 'Search and inspect verification history and transaction audit logs.',
};

export default function Page() {
  return <VerificationLogsPage />;
}
