import type { Metadata } from 'next';
import { DashboardPage } from '@/components/modules/dashboard/DashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of wallet balance, verification metrics, and identity services.',
};

export default function Page() {
  return <DashboardPage />;
}
