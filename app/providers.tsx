'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { setAuthUser, setAuthLoading, clearAuth } from '@/redux/slices/authSlice';
import { supabase } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/models/user/User';

function AuthStateSync({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    async function fetchAndSetUser(userId: string, email: string) {
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

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
        store.dispatch(setAuthUser(userObj));
      } catch (err) {
        console.warn('Profile fetch fallback:', err);
        const fallbackObj: UserProfile = {
          id: userId,
          email: email,
          full_name: email,
          firstname: email.split('@')[0],
          lastname: '',
          role: 'operator',
          wallet_balance: 0,
        };
        store.dispatch(setAuthUser(fallbackObj));
      }
    }

    async function initSession() {
      try {
        store.dispatch(setAuthLoading(true));
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && session.user.email) {
          await fetchAndSetUser(session.user.id, session.user.email);
        } else {
          store.dispatch(clearAuth());
        }
      } catch (err) {
        console.warn('Session restore error:', err);
        store.dispatch(clearAuth());
      } finally {
        store.dispatch(setAuthLoading(false));
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && session.user && session.user.email) {
        await fetchAndSetUser(session.user.id, session.user.email);
      } else {
        store.dispatch(clearAuth());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthStateSync>
        {children}
      </AuthStateSync>
    </Provider>
  );
}
