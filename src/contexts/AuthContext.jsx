import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const DEMO_SESSION_KEY = 'syncly:demoSession';
const ACTIVE_LOGIN_SESSION_KEY = 'syncly:activeLoginSession';
const AUTH_SESSION_KEY = 'syncly:authSession';
const DEMO_EMAIL = 'demo@syncly.app';
const DEMO_PASSWORD = 'DemoPass123!';
const DEMO_RESET_CODE = '123456';

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

const clearActiveLoginSession = () => {
  if (typeof window === 'undefined') return;

  // Remove both sessionStorage and localStorage keys to ensure full cleanup
  try { window.sessionStorage.removeItem(ACTIVE_LOGIN_SESSION_KEY); } catch {}
  try { window.sessionStorage.removeItem('syncly:loginWelcomeNotice'); } catch {}
  try { window.localStorage.removeItem(ACTIVE_LOGIN_SESSION_KEY); } catch {}
  try { window.localStorage.removeItem('syncly:loginWelcomeNotice'); } catch {}
};

const readAuthSnapshot = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.user ? parsed : null;
  } catch {
    return null;
  }
};

const writeAuthSnapshot = (snapshot) => {
  if (typeof window === 'undefined') return;

  try {
    if (!snapshot?.user) {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
      return;
    }

    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore storage errors
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugMessage, setDebugMessage] = useState(null);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      // Debug: surface config status at boot
      try {
        // eslint-disable-next-line no-console
        if (typeof window !== 'undefined') console.log('[AuthContext] boot isSupabaseConfigured=', isSupabaseConfigured);
        if (typeof window !== 'undefined') setDebugMessage(`boot: isSupabaseConfigured=${isSupabaseConfigured}`);
      } catch (e) {}

      if (!isSupabaseConfigured || !supabase) {
        const demoUser = readDemoSession();
        const storedAuth = readAuthSnapshot();
        if (mounted) {
          const nextSession = storedAuth?.session || (demoUser ? { user: demoUser } : null);
          const nextUser = storedAuth?.user || demoUser || null;

          setUser(nextUser);
          setSession(nextSession);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const activeSession = data.session || null;
      const storedAuth = readAuthSnapshot();
      const demoUser = activeSession || storedAuth ? null : readDemoSession();
      const nextSession = activeSession || storedAuth?.session || (demoUser ? { user: demoUser } : null);
      const nextUser = activeSession?.user || storedAuth?.user || demoUser || null;

      setSession(nextSession);
      setUser(nextUser);

      if (nextSession && nextUser) {
        writeAuthSnapshot({ session: nextSession, user: nextUser });
      }
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

      // If Supabase reports no active session but we have a locally persisted
      // auth snapshot, prefer the local snapshot instead of clearing it. This
      // avoids an immediate sign-out on refresh when Supabase session is
      // temporarily unavailable (network, CORS, or race conditions).
      const storedAuth = readAuthSnapshot();

      if (!nextSession && storedAuth) {
        setSession(storedAuth.session || null);
        setUser(storedAuth.user || null);
        // ensure snapshot remains present
        writeAuthSnapshot(storedAuth);
        setLoading(false);
        return;
      }

      setSession(nextSession || null);
      setUser(nextSession?.user || null);
      writeAuthSnapshot(nextSession ? { session: nextSession, user: nextSession.user || null } : null);
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
      writeAuthSnapshot(demoUser ? { session: { user: demoUser }, user: demoUser } : null);
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      const nextSession = data?.session || null;
      const nextUser = data?.user || nextSession?.user || null;

      setSession(nextSession);
      setUser(nextUser);
      writeAuthSnapshot(nextSession && nextUser ? { session: nextSession, user: nextUser } : null);
      return { error: null, session: data?.session || null, user: data?.user || null };
    }

    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      writeDemoSession(email, 'Demo User');
      const demoUser = readDemoSession();
      setUser(demoUser);
      setSession(demoUser ? { user: demoUser } : null);
      writeAuthSnapshot(demoUser ? { session: { user: demoUser }, user: demoUser } : null);
      return { error: null, session: demoUser ? { user: demoUser } : null, user: demoUser };
    }

    return { error: error || null };
  }, []);

  const signUp = useCallback(async ({ email, password, name }) => {
    // Debug: indicate which signup path is used
    try {
      // eslint-disable-next-line no-console
      if (typeof window !== 'undefined') console.log('[AuthContext] signUp called, isSupabaseConfigured=', isSupabaseConfigured, 'email=', email);
      if (typeof window !== 'undefined') setDebugMessage(`signUp called: isSupabaseConfigured=${isSupabaseConfigured} email=${email}`);
    } catch (e) {}

    if (!isSupabaseConfigured || !supabase) {
      writeDemoSession(email, name);
      const demoUser = readDemoSession();
      setUser(demoUser);
      setSession(demoUser ? { user: demoUser } : null);
      writeAuthSnapshot(demoUser ? { session: { user: demoUser }, user: demoUser } : null);
      return { error: null, session: demoUser ? { user: demoUser } : null, user: demoUser };
    }

    const emailRedirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/confirm-email`
      : undefined;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: name,
        },
      },
    });

    // Log Supabase signup response for debugging (do not log secrets)
    try {
      // eslint-disable-next-line no-console
      if (typeof window !== 'undefined') console.log('[AuthContext] signUp response error=', error ? (error.message || error) : null, 'hasData=', Boolean(data));
      if (typeof window !== 'undefined') setDebugMessage(`signUp response: error=${error ? (error.message || error) : 'none'} hasData=${Boolean(data)}`);
    } catch (e) {}

    return { error: error || null, session: data?.session || null, user: data?.user || null };
  }, []);

  const requestPasswordReset = useCallback(async ({ email }) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: null, demoCode: DEMO_RESET_CODE };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
    });

    return { error: error || null };
  }, []);

  const verifyPasswordResetOtp = useCallback(async ({ email, token }) => {
    if (!isSupabaseConfigured || !supabase) {
      if (token !== DEMO_RESET_CODE) {
        return { error: { message: 'Invalid demo reset code.' } };
      }

      return { error: null };
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });

    if (!error && data?.session) {
      setSession(data.session);
      setUser(data.session.user || null);
      writeAuthSnapshot(data.session?.user ? { session: data.session, user: data.session.user } : null);
    }

    return { error: error || null, session: data?.session || null, user: data?.user || null };
  }, []);

  const updatePassword = useCallback(async ({ password }) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: null };
    }

    const { data, error } = await supabase.auth.updateUser({ password });

    return { error: error || null, user: data?.user || null };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      clearDemoSession();
      clearActiveLoginSession();
      writeAuthSnapshot(null);
      setUser(null);
      setSession(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    clearActiveLoginSession();
    writeAuthSnapshot(null);
    return { error: error || null };
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAuthenticated: Boolean(user),
      isSupabaseConfigured,
      debugMessage,
      signIn,
      signUp,
      requestPasswordReset,
      verifyPasswordResetOtp,
      updatePassword,
      signOut,
    }),
    [user, session, loading, isSupabaseConfigured, debugMessage, signIn, signUp, requestPasswordReset, verifyPasswordResetOtp, updatePassword, signOut]
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
