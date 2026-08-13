'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserProfile(userId, email) {
    try {
      const { data: profile } = await supabase.from('users').select('*').eq('id', userId).single();
      const fullName = profile?.full_name || email;
      const nameParts = fullName.split(' ');
      const userObj = {
        id: userId,
        email: email,
        full_name: fullName,
        firstname: nameParts[0] || '',
        lastname: nameParts.slice(1).join(' ') || '',
        role: profile?.role || 'operator',
        wallet_balance: profile?.wallet_balance || 0,
        agent_nin_price: profile?.agent_nin_price,
        agent_bvn_price: profile?.agent_bvn_price
      };
      setCurrentUser(userObj);
      return userObj;
    } catch (err) {
      console.warn("Error loading profile:", err);
      const fallbackObj = {
        id: userId,
        email: email,
        full_name: email,
        firstname: email.split('@')[0],
        lastname: '',
        role: 'operator',
        wallet_balance: 0
      };
      setCurrentUser(fallbackObj);
      return fallbackObj;
    }
  }

  useEffect(() => {
    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          await fetchUserProfile(session.user.id, session.user.email);
        }
      } catch (e) {
        console.warn("Session restore error:", e);
      } finally {
        setLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        await fetchUserProfile(session.user.id, session.user.email);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    const user = await fetchUserProfile(data.user.id, data.user.email);
    return { success: true, user };
  };

  const signup = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    if (currentUser && currentUser.id) {
      await fetchUserProfile(currentUser.id, currentUser.email);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
