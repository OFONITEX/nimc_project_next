import type { Metadata } from 'next';
import { LandingPage } from '@/components/modules/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Identity Verification & Technology Solutions',
  description: 'Enterprise NIN Verification, BVN Services, Identity APIs, and Custom Technology Solutions in Nigeria.',
};

export default function Page() {
  return <LandingPage />;
}
