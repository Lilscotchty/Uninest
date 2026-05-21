import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://placeholder.supabase.co';
// @ts-ignore
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || 'dummy_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
