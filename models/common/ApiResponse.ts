export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  amount_charged?: number;
  new_balance?: number;
  refunded?: boolean;
  refund?: {
    amount?: number;
    new_balance?: number;
    reason?: string;
  };
}
