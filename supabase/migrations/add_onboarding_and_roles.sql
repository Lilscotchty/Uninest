-- =============================================================================
-- SKYCOBE — Onboarding & Role Separation Migration
-- File:    add_onboarding_and_roles.sql
-- Target:  Supabase SQL Editor (copy and run)
-- =============================================================================

BEGIN;

-- 1. Add onboarding_completed column to public.profiles if not exists
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- 2. Add owner_type column if not exists
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS owner_type text;

-- 3. Add account_type column if not exists
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS account_type text DEFAULT 'student';

-- 4. Update the handle_new_user trigger to support onboarding_completed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name text;
  v_first_name text;
  v_last_name text;
  v_avatar_url text;
  v_role text;
  v_onboarding_done boolean;
BEGIN
  -- Extract full name
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
    RAISE WARNING 'handle_new_user error for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

COMMIT;
