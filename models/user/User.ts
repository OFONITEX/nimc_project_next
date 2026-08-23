export type UserRole = 'admin' | 'agent' | 'operator';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  wallet_balance: number;
  agent_nin_price?: number;
  agent_bvn_price?: number;
  created_at?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
