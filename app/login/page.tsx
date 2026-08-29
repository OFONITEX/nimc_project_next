import type { Metadata } from 'next';
import { LoginPage } from '@/components/modules/auth/LoginPage';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your OFONITECH operator portal for instant NIN & BVN verification.',
};

export default function Page() {
  return <LoginPage />;
}
