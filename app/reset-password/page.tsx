import type { Metadata } from 'next';
import { ResetPasswordPage } from '@/components/modules/auth/ResetPasswordPage';

export const metadata: Metadata = {
  title: 'Reset Password | OFONITECH SOLUTIONZ',
  description: 'Set a new password for your OFONITECH operator portal account.',
};

export default function Page() {
  return <ResetPasswordPage />;
}
