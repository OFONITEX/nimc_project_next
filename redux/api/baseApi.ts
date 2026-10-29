import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/lib/supabase/client';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: async (headers) => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers.set('authorization', `Bearer ${session.access_token}`);
        }
      } catch (e) {
        // Ignore header preparation error in client
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'VerificationHistory', 'AdminUsers', 'Wallet'],
  endpoints: () => ({}),
});
