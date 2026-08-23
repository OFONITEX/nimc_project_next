import { baseApi } from './baseApi';
import { UserProfile, UserRole } from '@/models/user/User';
import { supabase } from '@/lib/supabase/client';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile | null, { userId: string; email: string }>({
      queryFn: async ({ userId, email }) => {
        try {
          if (!userId) return { data: null };
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.warn('Error fetching profile from Supabase:', error.message);
          }

          const fullName = profile?.full_name || email;
          const nameParts = fullName.split(' ');
          const userObj: UserProfile = {
            id: userId,
            email: email,
            full_name: fullName,
            firstname: nameParts[0] || email.split('@')[0],
            lastname: nameParts.slice(1).join(' ') || '',
            role: (profile?.role as UserRole) || 'operator',
            wallet_balance: profile?.wallet_balance || 0,
            agent_nin_price: profile?.agent_nin_price,
            agent_bvn_price: profile?.agent_bvn_price,
            created_at: profile?.created_at,
          };

          return { data: userObj };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to fetch user profile';
          return { error: { status: 'CUSTOM_ERROR', error: message } };
        }
      },
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserProfileQuery, useLazyGetUserProfileQuery } = authApi;
