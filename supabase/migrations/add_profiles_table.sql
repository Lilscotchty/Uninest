-- =============================================================================
-- SKYCOBE — Profiles Table & Auth Trigger Migration
-- Fixes: "Database error saving new user"
-- =============================================================================

-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  first_name text,
  last_name text,
  phone text,
  role text default 'student',
  account_type text default 'student',
  owner_type text,
  university text,
  student_id text,
  level text,
  bio text,
  avatar_url text,
  cover_url text,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist in case the table was created with an older schema
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_type text DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS owner_type text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 4. Permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

-- 5. Bulletproof Trigger Function to create a profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_full_name text;
  v_avatar_url text;
  v_role text;
BEGIN
  -- Extract full_name / names safely from Google OAuth or standard metadata
  v_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    CONCAT_WS(' ', new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name'),
    CONCAT_WS(' ', new.raw_user_meta_data->>'given_name', new.raw_user_meta_data->>'family_name')
  );

  v_first_name := COALESCE(
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'given_name',
    split_part(v_full_name, ' ', 1)
  );

  v_last_name := COALESCE(
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'family_name',
    CASE 
      WHEN position(' ' in v_full_name) > 0 
      THEN substring(v_full_name from position(' ' in v_full_name) + 1)
      ELSE NULL 
    END
  );

  -- Avatar: Google sends 'picture', standard sends 'avatar_url'
  v_avatar_url := COALESCE(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  );

  -- Role: 'account_type' or 'role', default to 'student'
  v_role := COALESCE(
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'account_type',
    'student'
  );

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    phone,
    role,
    account_type,
    university,
    level,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    v_full_name,
    v_first_name,
    v_last_name,
    new.raw_user_meta_data->>'phone',
    v_role,
    v_role,
    new.raw_user_meta_data->>'university',
    new.raw_user_meta_data->>'level',
    v_avatar_url,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name   = COALESCE(EXCLUDED.full_name, profiles.full_name),
    first_name  = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name   = COALESCE(EXCLUDED.last_name, profiles.last_name),
    email       = COALESCE(EXCLUDED.email, profiles.email),
    avatar_url  = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at  = now();

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Never abort user signup in auth.users if profile insertion encounters an issue
    RAISE WARNING 'handle_new_user error for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- 6. Trigger registration on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

