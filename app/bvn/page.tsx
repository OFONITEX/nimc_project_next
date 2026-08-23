import type { Metadata } from 'next';
import { BvnSelectionPage } from '@/components/modules/bvn/BvnSelectionPage';

export const metadata: Metadata = {
  title: 'BVN Services',
  description: 'Bank Verification Number slip and card lookup services with official download options.',
};

export default function Page() {
  return <BvnSelectionPage />;
}
