import type { Metadata } from 'next';
import { SignupPage } from '@/components/modules/auth/SignupPage';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Register for an OFONITECH identity verification operator account.',
};

export default function Page() {
  return <SignupPage />;
}
