import type { Metadata } from 'next';
import { FundWalletPage } from '@/components/modules/fund/FundWalletPage';

export const metadata: Metadata = {
  title: 'Fund Wallet',
  description: 'Deposit funds into your operator wallet for instant identity verifications.',
};

export default function Page() {
  return <FundWalletPage />;
}
