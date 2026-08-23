import type { Metadata } from 'next';
import { AdminDashboardPage } from '@/components/modules/admin/AdminDashboardPage';

export const metadata: Metadata = {
  title: 'Admin Management',
  description: 'Administrator management dashboard for portal users and custom agent pricing.',
};

export default function Page() {
  return <AdminDashboardPage />;
}
