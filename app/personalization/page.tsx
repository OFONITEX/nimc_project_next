import type { Metadata } from 'next';
import { PersonalizationPage } from '@/components/modules/personalization/PersonalizationPage';

export const metadata: Metadata = {
  title: 'Slip Personalization',
  description: 'Generate customized high-resolution standard, premium, and plastic card slips.',
};

export default function Page() {
  return <PersonalizationPage />;
}
