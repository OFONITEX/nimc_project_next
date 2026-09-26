import type { Metadata } from 'next';
import { ForgotPasswordPage } from '@/components/modules/auth/ForgotPasswordPage';

export const metadata: Metadata = {
  title: 'Forgot Password | OFONITECH SOLUTIONZ',
  description: 'Reset your OFONITECH operator portal account password securely.',
};

export default function Page() {
  return <ForgotPasswordPage />;
}
