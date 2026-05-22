import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_anon_key';

// @ts-ignore
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase client failed to initialize: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from the environment configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
