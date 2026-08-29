import { baseApi } from './baseApi';
import { ApiResponse } from '@/models/common/ApiResponse';
import { NinVerificationData, BvnVerificationData, VerificationHistoryItem } from '@/models/verification/Verification';
import { supabase } from '@/lib/supabase/client';

export interface VerifyPayload {
  verification_type: 'nin' | 'phone' | 'demo' | 'bvn';
  nin?: string;
  phone_number?: string;
  firstname?: string;
  lastname?: string;
  dob?: string;
  gender?: string;
  bvn?: string;
  slip_type?: string;
  download_type?: string;
}

export const verificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyIdentity: builder.mutation<ApiResponse<NinVerificationData | BvnVerificationData>, VerifyPayload>({
      query: (payload) => ({
        url: 'api/verify',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['VerificationHistory', 'User'],
    }),

    getVerificationHistory: builder.query<VerificationHistoryItem[], string>({
      queryFn: async (userId) => {
        try {
          if (!userId) return { data: [] };
          const { data, error } = await supabase
            .from('verification_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

          if (error) {
            return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          }
          return { data: (data as VerificationHistoryItem[]) || [] };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to fetch verification history';
          return { error: { status: 'CUSTOM_ERROR', error: message } };
        }
      },
      providesTags: ['VerificationHistory'],
    }),
  }),
});

export const { useVerifyIdentityMutation, useGetVerificationHistoryQuery } = verificationApi;
