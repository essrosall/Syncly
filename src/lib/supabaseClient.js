import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Lightweight runtime debug info (does not print secret values)
try {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[supabaseClient] isSupabaseConfigured=', isSupabaseConfigured, 'supabaseUrlPresent=', Boolean(supabaseUrl));
  }
} catch (e) {
  // ignore
}
