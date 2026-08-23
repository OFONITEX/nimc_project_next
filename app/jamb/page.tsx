import type { Metadata } from 'next';
import { JambServicesPage } from '@/components/modules/jamb/JambServicesPage';

export const metadata: Metadata = {
  title: 'JAMB Services',
  description: 'JAMB UTME profile code generation, candidate record validation, and NIMC sync.',
};

export default function Page() {
  return <JambServicesPage />;
}
