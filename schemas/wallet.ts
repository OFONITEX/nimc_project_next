import { z } from 'zod';

export const fundWalletSchema = z.object({
  amount: z
    .number({ message: 'Amount must be a number' })
    .min(100, { message: 'Minimum deposit amount is ₦100' })
    .max(10000000, { message: 'Amount exceeds maximum allowable deposit' }),
});

export type FundWalletFormValues = z.infer<typeof fundWalletSchema>;
