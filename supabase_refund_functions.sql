-- ==============================================================================
-- SUPABASE POSTGRES FUNCTIONS FOR AUTOMATIC WALLET REFUND & DEBIT
-- Run this in your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. Ensure verification_history has status, refunded, refunded_at, and refund_reason columns
ALTER TABLE verification_history
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refund_reason TEXT,
  ADD COLUMN IF NOT EXISTS reference TEXT,
  ADD COLUMN IF NOT EXISTS reply TEXT;

-- 2. Atomic Wallet Deduction Function
CREATE OR REPLACE FUNCTION debit_wallet(
  p_user_id UUID,
  p_amount NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance NUMERIC;
BEGIN
  -- Row-level lock to prevent race conditions & double-spending
  SELECT wallet_balance INTO v_balance
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'USER_NOT_FOUND';
  END IF;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'INSUFFICIENT_BALANCE';
  END IF;

  UPDATE users
  SET wallet_balance = wallet_balance - p_amount
  WHERE id = p_user_id
  RETURNING wallet_balance INTO v_balance;

  RETURN v_balance;
END;
$$;

-- 3. Atomic Wallet Credit / Refund Function
CREATE OR REPLACE FUNCTION credit_wallet(
  p_user_id UUID,
  p_amount NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance NUMERIC;
BEGIN
  UPDATE users
  SET wallet_balance = wallet_balance + p_amount
  WHERE id = p_user_id
  RETURNING wallet_balance INTO v_balance;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'USER_NOT_FOUND';
  END IF;

  RETURN v_balance;
END;
$$;

