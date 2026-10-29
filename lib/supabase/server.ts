import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynljwateongqgbgfzpkg.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_CyhLcKzUf6AwJDGF-6tApQ_xTPFwMdL';

export const getSupabaseServer = () => {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  wallet_balance: number;
  agent_nin_price?: number;
  agent_bvn_price?: number;
  full_name?: string;
}

/**
 * Validates request Bearer token and returns the authenticated user profile.
 */
export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  try {
    const supabase = getSupabaseServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('id, email, role, wallet_balance, agent_nin_price, agent_bvn_price, full_name')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || profile?.email || '',
      role: profile?.role || 'operator',
      wallet_balance: parseFloat(profile?.wallet_balance) || 0,
      agent_nin_price: profile?.agent_nin_price,
      agent_bvn_price: profile?.agent_bvn_price,
      full_name: profile?.full_name,
    };
  } catch (err) {
    console.warn('Error fetching authenticated user in server route:', err);
    return null;
  }
}

/**
 * Determines whether the given email is the target admin account for auto-refunds.
 * Only brinoekanem@gmail.com is targeted for this refund policy as requested.
 */
export function isAdminRefundTarget(email?: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === 'brinoekanem@gmail.com';
}

