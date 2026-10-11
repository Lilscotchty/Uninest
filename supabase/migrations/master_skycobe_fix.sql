-- =============================================================================
-- SKYCOBE — Master Database Fix: Users, Roles, Media, & Onboarding
-- Target: Supabase SQL Editor (Copy all and click "Run")
-- =============================================================================

BEGIN;

-- 1. Ensure required columns exist on public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_type text DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS owner_type text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 2. Enable Row Level Security and configure safe policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

-- 3. Bulletproof Trigger Function to create profile on sign up without errors
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
  v_onboarding_done boolean;
BEGIN
  -- Extract full name safely from Google OAuth or standard email/password metadata
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

  -- Avatar URL
  v_avatar_url := COALESCE(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  );

  -- Role: prioritizes role, account_type or defaults to 'student'
  v_role := COALESCE(
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'account_type',
    'student'
  );

  v_onboarding_done := COALESCE(
    (new.raw_user_meta_data->>'onboarding_completed')::boolean,
    false
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
    onboarding_completed,
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
    v_onboarding_done,
    new.raw_user_meta_data->>'university',
    new.raw_user_meta_data->>'level',
    v_avatar_url,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name            = COALESCE(EXCLUDED.full_name, profiles.full_name),
    first_name           = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name            = COALESCE(EXCLUDED.last_name, profiles.last_name),
    email                = COALESCE(EXCLUDED.email, profiles.email),
    avatar_url           = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    role                 = COALESCE(EXCLUDED.role, profiles.role),
    account_type         = COALESCE(EXCLUDED.account_type, profiles.account_type),
    onboarding_completed = COALESCE(EXCLUDED.onboarding_completed, profiles.onboarding_completed),
    updated_at           = now();

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Prevent signup failure even if profile insert encounters an edge case
    RAISE WARNING 'handle_new_user exception for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- Ensure auth trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Configure Storage Buckets for Profile & Hostel Media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-media',
    'profile-media',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'property-media',
    'property-media',
    true,
    15728640, -- 15MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('hostel-media', 'hostel-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Storage RLS policies
DROP POLICY IF EXISTS "Public can view profile-media" ON storage.objects;
CREATE POLICY "Public can view profile-media"
ON storage.objects FOR SELECT
USING (bucket_id IN ('profile-media', 'property-media', 'hostel-media'));

DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('profile-media', 'property-media', 'hostel-media'));

DROP POLICY IF EXISTS "Users can update media" ON storage.objects;
CREATE POLICY "Users can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('profile-media', 'property-media', 'hostel-media'));

DROP POLICY IF EXISTS "Users can delete media" ON storage.objects;
CREATE POLICY "Users can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('profile-media', 'property-media', 'hostel-media'));

COMMIT;
