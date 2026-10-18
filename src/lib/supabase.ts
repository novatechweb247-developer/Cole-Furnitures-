import { createClient } from '@supabase/supabase-js';

// This is the public browser key, protected by Supabase Auth and Row Level Security.
// It is intentionally not a service-role/secret key.
const url =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://fopixhlloehlkxpngust.supabase.co';
const key =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  'sb_publishable_SX1CuaGUKJ0KQUdkfn5d4w_gg0BztMI';

export const isSupabaseConfigured = Boolean(url && key);
export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
    })
  : null;
