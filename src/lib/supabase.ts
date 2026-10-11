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

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Canonical application URL configured for the site
export const CANONICAL_SITE_URL = 'https://uninest-lyart.vercel.app';

/**
 * Returns the exact redirect URL to use for Supabase auth flows (OAuth and email confirmation).
 * Defaults to '/auth/callback' for smooth code exchange before navigating to the dashboard.
 * Preserves the originating host so PKCE code_verifier in localStorage matches the domain.
 */
export const getAuthRedirectUrl = (path: string = '/auth/callback'): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (typeof window !== 'undefined') {
    // If testing on localhost or local dev
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `${window.location.origin}${cleanPath}`;
    }

    // If on the canonical Vercel site
    if (window.location.hostname.includes('uninest-lyart.vercel.app')) {
      return `${CANONICAL_SITE_URL}${cleanPath}`;
    }

    // For any other preview or custom origin, keep origin to prevent PKCE code_verifier loss
    return `${window.location.origin}${cleanPath}`;
  }

  return `${CANONICAL_SITE_URL}${cleanPath}`;
};
