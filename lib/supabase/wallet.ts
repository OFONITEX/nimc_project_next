import { getSupabaseServer } from './server';

export interface WalletOperationResult {
  success: boolean;
  new_balance?: number;
  error?: string;
}

/**
 * Deducts an amount from a user's wallet.
 * Uses atomic Postgres RPC 'debit_wallet' if available, otherwise performs
 * a checked database update on the users table.
 */
export async function deductUserWallet(
  userId: string,
  amount: number
): Promise<WalletOperationResult> {
  if (amount <= 0) {
    return { success: true };
  }

  const supabase = getSupabaseServer();

  // 1. Try atomic PostgreSQL RPC function if installed
  try {
    const { data: rpcBalance, error: rpcError } = await supabase.rpc('debit_wallet', {
      p_user_id: userId,
      p_amount: amount,
    });

    if (!rpcError && rpcBalance !== null && rpcBalance !== undefined) {
      return { success: true, new_balance: parseFloat(rpcBalance) };
    }
  } catch {
    // Continue to fallback
  }

  // 2. Fallback: Fetch current balance, check sufficiency, and update
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return { success: false, error: 'User wallet record not found' };
    }

    const currentBalance = parseFloat(user.wallet_balance) || 0;
    if (currentBalance < amount) {
      return {
        success: false,
        error: `Insufficient wallet balance (₦${currentBalance.toLocaleString()} available, ₦${amount.toLocaleString()} required)`,
      };
    }

    const newBalance = Math.max(0, currentBalance - amount);
    const { error: updateError } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, new_balance: newBalance };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Wallet deduction failed';
    return { success: false, error: msg };
  }
}

/**
 * Refunds an amount back to a user's wallet.
 * Uses atomic Postgres RPC 'credit_wallet' if available, otherwise performs
 * a checked database update on the users table.
 */
export async function refundUserWallet(
  userId: string,
  amount: number,
  reason: string
): Promise<WalletOperationResult> {
  if (amount <= 0) {
    return { success: true };
  }

  const supabase = getSupabaseServer();

  // 1. Try atomic PostgreSQL RPC function if installed
  try {
    const { data: rpcBalance, error: rpcError } = await supabase.rpc('credit_wallet', {
      p_user_id: userId,
      p_amount: amount,
    });

    if (!rpcError && rpcBalance !== null && rpcBalance !== undefined) {
      console.log(`[Wallet Refund] User ${userId} refunded ₦${amount} via RPC. Reason: ${reason}`);
      return { success: true, new_balance: parseFloat(rpcBalance) };
    }
  } catch {
    // Continue to fallback
  }

  // 2. Fallback: Direct database credit
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return { success: false, error: 'User wallet record not found for refund' };
    }

    const currentBalance = parseFloat(user.wallet_balance) || 0;
    const newBalance = currentBalance + amount;

    const { error: updateError } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    console.log(`[Wallet Refund] User ${userId} refunded ₦${amount} via direct update. Reason: ${reason}`);
    return { success: true, new_balance: newBalance };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Wallet refund failed';
    return { success: false, error: msg };
  }
}

