'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { setAuthUser, setAuthLoading, clearAuth } from '@/redux/slices/authSlice';
import { supabase } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/models/user/User';
import {
  InactivityTracker,
  INACTIVITY_TIMEOUT_MS,
  LAST_ACTIVITY_KEY,
  INACTIVITY_FLAG_KEY,
} from '@/components/layout/InactivityTracker';

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

        // Check 12-hour inactivity timeout on initial session restore
        if (typeof window !== 'undefined') {
          const storedActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
          if (storedActivity) {
            const elapsed = Date.now() - parseInt(storedActivity, 10);
            if (elapsed >= INACTIVITY_TIMEOUT_MS) {
              console.log('[Auth] Session expired due to 12 hours of inactivity.');
              localStorage.removeItem(LAST_ACTIVITY_KEY);
              sessionStorage.setItem(INACTIVITY_FLAG_KEY, 'true');
              await supabase.auth.signOut();
              store.dispatch(clearAuth());
              store.dispatch(setAuthLoading(false));
              return;
            }
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && session.user.email) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
          }
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && typeof window !== 'undefined') {
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
        sessionStorage.removeItem(INACTIVITY_FLAG_KEY);
      }
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
        <InactivityTracker />
        {children}
      </AuthStateSync>
    </Provider>
  );
}
