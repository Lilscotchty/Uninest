import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log only the first 5 characters to check if it's there, without revealing the whole key
console.log("DEBUG: URL starts with:", url?.substring(0, 10));
console.log("DEBUG: Key starts with:", key?.substring(0, 5));
console.log("DEBUG: Is Key undefined?", key === undefined);

export const supabase = createClient(url, key);
