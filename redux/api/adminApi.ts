import { baseApi } from './baseApi';
import { UserProfile, UserRole } from '@/models/user/User';
import { supabase } from '@/lib/supabase/client';

export interface UpdateUserRolePayload {
  userId: string;
  role: UserRole;
}

export interface UpdateAgentPricingPayload {
  userId: string;
  agentNinPrice: number;
  agentBvnPrice: number;
}

export interface AdminVerificationItem {
  id: string;
  user_id: string;
  user_email: string;
  service_type: string;
  query_value: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string;
  amount_charged?: number;
  success?: boolean;
  created_at: string;
  expires_at?: string;
  operator_name?: string;
}

export interface AdminVerificationStats {
  totalLookups: number;
  todayLookups: number;
  totalRevenue: number;
  totalUsers: number;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<UserProfile[], void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id, email, full_name, role, wallet_balance, agent_nin_price, agent_bvn_price, created_at')
            .order('created_at', { ascending: false })
            .limit(100);

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }

          const mapped: UserProfile[] = (data || []).map((u) => {
            const fullName = u.full_name || u.email || '';
            const nameParts = fullName.split(' ');
            return {
              id: u.id,
              email: u.email,
              full_name: fullName,
              firstname: nameParts[0] || '',
              lastname: nameParts.slice(1).join(' ') || '',
              role: (u.role as UserRole) || 'operator',
              wallet_balance: u.wallet_balance || 0,
              agent_nin_price: u.agent_nin_price,
              agent_bvn_price: u.agent_bvn_price,
              created_at: u.created_at,
            };
          });

          return { data: mapped };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to fetch admin users';
          return { error: { status: 'CUSTOM_ERROR', error: message } };
        }
      },
      providesTags: ['AdminUsers'],
    }),

    getAdminVerificationHistory: builder.query<AdminVerificationItem[], { allTime?: boolean }>({
      queryFn: async ({ allTime = true } = {}) => {
        try {
          // 1. Try querying via Supabase client directly
          let query = supabase
            .from('verification_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(allTime ? 500 : 100);

          const { data, error } = await query;

          if (!error && data && data.length > 0) {
            return { data: (data as AdminVerificationItem[]) || [] };
          }

          // 2. Fallback to /api/history endpoint if client query returns empty or is restricted by RLS
          const session = await supabase.auth.getSession();
          const token = session.data.session?.access_token;
          if (token) {
            const res = await fetch(`/api/history?all_time=true`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            });
            if (res.ok) {
              const json = await res.json();
              if (json.success && Array.isArray(json.rows)) {
                return { data: (json.rows as AdminVerificationItem[]) || [] };
              }
            }
          }

          return { data: (data as AdminVerificationItem[]) || [] };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to fetch admin verification history';
          return { error: { status: 'CUSTOM_ERROR', error: message } };
        }
      },
      providesTags: ['VerificationHistory'],
    }),

    getAdminVerificationStats: builder.query<AdminVerificationStats, void>({
      queryFn: async () => {
        try {
          const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

          // 1. Total lookups count
          const { count: totalCount } = await supabase
            .from('verification_history')
            .select('id', { count: 'exact', head: true });

          // 2. Today's lookups count
          const { count: todayCount } = await supabase
            .from('verification_history')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', since);

          // 3. Total registered users count
          const { count: usersCount } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true });

          // 4. Revenue calculation from recent records
          const { data: recentRevenue } = await supabase
            .from('verification_history')
            .select('amount_charged')
            .limit(1000);

          const totalRev = (recentRevenue || []).reduce(
            (sum, row) => sum + (parseFloat(row.amount_charged) || 0),
            0
          );

          return {
            data: {
              totalLookups: totalCount || 0,
              todayLookups: todayCount || 0,
              totalRevenue: totalRev,
              totalUsers: usersCount || 0,
            },
          };
        } catch (err: unknown) {
          return {
            data: {
              totalLookups: 0,
              todayLookups: 0,
              totalRevenue: 0,
              totalUsers: 0,
            },
          };
        }
      },
      providesTags: ['VerificationHistory', 'AdminUsers'],
    }),

    updateUserRole: builder.mutation<boolean, UpdateUserRolePayload>({
      queryFn: async ({ userId, role }) => {
        try {
          const { error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', userId);

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }
          return { data: true };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to update user role';
          return { error: { status: 'CUSTOM_ERROR', error: message } };
        }
      },
      invalidatesTags: ['AdminUsers'],
    }),

    updateAgentPricing: builder.mutation<boolean, UpdateAgentPricingPayload>({
      queryFn: async ({ userId, agentNinPrice, agentBvnPrice }) => {
        try {
          const { error } = await supabase
            .from('users')
            .update({
              agent_nin_price: agentNinPrice,
              agent_bvn_price: agentBvnPrice,
            })
            .eq('id', userId);

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }
          return { data: true };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to update agent pricing';
          return { error: { status: 'CUSTOM_ERROR', error: message } };
        }
      },
      invalidatesTags: ['AdminUsers'],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminVerificationHistoryQuery,
  useGetAdminVerificationStatsQuery,
  useUpdateUserRoleMutation,
  useUpdateAgentPricingMutation,
} = adminApi;
