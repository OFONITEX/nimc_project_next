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
  useUpdateUserRoleMutation,
  useUpdateAgentPricingMutation,
} = adminApi;
