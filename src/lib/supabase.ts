import { createClient } from '@supabase/supabase-js';

// Retrieve Vite-specific environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail loudly if variables are missing so you don't get malformed JWS errors
if (!supabaseUrl) {
  throw new Error(
    'Supabase Client Error: VITE_SUPABASE_URL is missing. Please check your .env local file or Vercel dashboard environment variables.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Supabase Client Error: VITE_SUPABASE_ANON_KEY is missing. Please check your .env local file or Vercel dashboard environment variables.'
  );
}

// Safely initialize the client using the validated keys
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
