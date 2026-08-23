import type { Metadata } from 'next';
import { ValidationPage } from '@/components/modules/validation/ValidationPage';

export const metadata: Metadata = {
  title: 'NIN Validation & SIM Clearing',
  description: 'SIM card link validation, No-Record NIN clearing, and telecommunications backend sync.',
};

export default function Page() {
  return <ValidationPage />;
}
