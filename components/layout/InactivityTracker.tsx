'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearAuth } from '@/redux/slices/authSlice';

// 12 hours = 12 * 60 * 60 * 1000 = 43,200,000 milliseconds
export const INACTIVITY_TIMEOUT_MS = 12 * 60 * 60 * 1000;
export const LAST_ACTIVITY_KEY = 'portal_last_activity_timestamp';
export const INACTIVITY_FLAG_KEY = 'portal_inactivity_logout';

export function InactivityTracker() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const lastRecordedRef = React.useRef<number>(Date.now());
  const logoutInProgressRef = React.useRef<boolean>(false);

  const performLogout = React.useCallback(async () => {
    if (logoutInProgressRef.current) return;
    logoutInProgressRef.current = true;

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        sessionStorage.setItem(INACTIVITY_FLAG_KEY, 'true');
      }
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Inactivity signout error:', e);
    } finally {
      dispatch(clearAuth());
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isAuthPage =
          path.startsWith('/login') ||
          path.startsWith('/signup') ||
          path.startsWith('/forgot-password') ||
          path.startsWith('/reset-password');

        if (!isAuthPage) {
          window.location.href = '/login';
        }
      }
    }
  }, [dispatch]);

  const updateActivity = React.useCallback(() => {
    if (!currentUser) return;
    const now = Date.now();
    // Throttle writes to localStorage to at most once every 15 seconds
    if (now - lastRecordedRef.current > 15000) {
      lastRecordedRef.current = now;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
      }
    }
  }, [currentUser]);

  const checkInactivity = React.useCallback(() => {
    if (!currentUser || logoutInProgressRef.current) return;
    if (typeof window === 'undefined') return;

    const storedStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!storedStr) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      lastRecordedRef.current = Date.now();
      return;
    }

    const lastTime = parseInt(storedStr, 10);
    if (isNaN(lastTime)) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      return;
    }

    const elapsed = Date.now() - lastTime;
    if (elapsed >= INACTIVITY_TIMEOUT_MS) {
      console.log(
        `[InactivityTracker] Logging out after 12 hours of inactivity (${Math.round(
          elapsed / 1000 / 60
        )} mins elapsed).`
      );
      performLogout();
    }
  }, [currentUser, performLogout]);

  // Check on mount and whenever currentUser state changes
  React.useEffect(() => {
    if (currentUser && !isLoading) {
      checkInactivity();
    }
  }, [currentUser, isLoading, checkInactivity]);

  // Activity event listeners
  React.useEffect(() => {
    if (!currentUser) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleEvent = () => updateActivity();

    events.forEach((ev) => window.addEventListener(ev, handleEvent, { passive: true }));

    // Re-check on tab visibility and focus (e.g. computer woke up from sleep or user switched back)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkInactivity();
        updateActivity();
      }
    };
    const handleFocus = () => {
      checkInactivity();
      updateActivity();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    // Periodic check every 30 seconds
    const intervalId = window.setInterval(() => {
      checkInactivity();
    }, 30000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleEvent));
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
      window.clearInterval(intervalId);
    };
  }, [currentUser, updateActivity, checkInactivity]);

  return null;
}

