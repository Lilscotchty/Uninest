import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  '';

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Canonical application URL configured for the site
export const CANONICAL_SITE_URL = 'https://uninest-lyart.vercel.app';

/**
 * Returns the exact redirect URL to use for Supabase auth flows (OAuth and email confirmation).
 * Strict priority:
 * 1. If running on localhost in local dev, allow localhost.
 * 2. In any deployed environment (Vercel, preview, production), strictly use https://uninest-lyart.vercel.app.
 */
export const getAuthRedirectUrl = (path: string = '/student/dashboard'): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Keep localhost only during local development testing
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return `${window.location.origin}${cleanPath}`;
  }

  // Canonical production URL as explicitly requested
  return `${CANONICAL_SITE_URL}${cleanPath}`;
};
