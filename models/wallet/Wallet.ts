export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  reference: string;
  status: 'successful' | 'pending' | 'failed';
  payment_method?: string;
  created_at: string;
}

export interface MonnifyPaymentOptions {
  amount: number;
  currency: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  apiKey: string;
  contractCode: string;
  paymentDescription: string;
  isTestMode: boolean;
  onComplete: (response: unknown) => void;
  onClose: (data: unknown) => void;
}

declare global {
  interface Window {
    MonnifySDK?: {
      initialize: (options: MonnifyPaymentOptions) => void;
    };
  }
}
