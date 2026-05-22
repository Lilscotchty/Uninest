import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase client failed to initialize: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from the environment configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
