import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const DEMO_SESSION_KEY = 'syncly:demoSession';

const AuthContext = createContext(null);

const readDemoSession = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.email) return null;

    return {
      id: parsed.email,
      email: parsed.email,
      user_metadata: {
        full_name: parsed.name || parsed.email,
      },
    };
  } catch {
    return null;
  }
};

const writeDemoSession = (email, name) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    DEMO_SESSION_KEY,
    JSON.stringify({
      email,
      name: name || email,
      signedInAt: new Date().toISOString(),
    })
  );
};

const clearDemoSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DEMO_SESSION_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      if (!isSupabaseConfigured || !supabase) {
        const demoUser = readDemoSession();
        if (mounted) {
          setUser(demoUser);
          setSession(demoUser ? { user: demoUser } : null);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session || null);
      setUser(data.session?.user || null);
      setLoading(false);
    };

    boot();

    if (!isSupabaseConfigured || !supabase) {
      return () => {
        mounted = false;
      };
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((_, nextSession) => {
      if (!mounted) return;
      setSession(nextSession || null);
      setUser(nextSession?.user || null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      writeDemoSession(email);
      const demoUser = readDemoSession();
      setUser(demoUser);
      setSession(demoUser ? { user: demoUser } : null);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error || null };
  }, []);

  const signUp = useCallback(async ({ email, password, name }) => {
    if (!isSupabaseConfigured || !supabase) {
      writeDemoSession(email, name);
      const demoUser = readDemoSession();
      setUser(demoUser);
      setSession(demoUser ? { user: demoUser } : null);
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    return { error: error || null };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      clearDemoSession();
      setUser(null);
      setSession(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error: error || null };
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAuthenticated: Boolean(user),
      isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [user, session, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export default AuthProvider;
