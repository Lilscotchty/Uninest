-- =============================================================================
-- SKYCOBE — Profile Photos (Cover & Avatar) & Storage Setup Migration
-- File:    add_profile_photos_and_storage.sql
-- Target:  Supabase SQL Editor (copy and run)
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Add cover_url and avatar_url columns to public.profiles
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_url text;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2: Configure Storage Buckets for Profile & Property Media
-- ─────────────────────────────────────────────────────────────────────────────

-- 2a. Create / update 'profile-media' bucket (Public, 10MB cap)
INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'profile-media',
    'profile-media',
    true,
    10485760, -- 10MB in bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
    SET public             = true,
        file_size_limit    = 10485760,
        allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2b. Ensure 'property-media' bucket exists as well
INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'property-media',
    'property-media',
    true,
    15728640, -- 15MB in bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE
    SET public             = true,
        file_size_limit    = 15728640,
        allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3: Storage Row Level Security (RLS) Policies
-- ─────────────────────────────────────────────────────────────────────────────

-- Clean up any existing policies
DROP POLICY IF EXISTS "Public can view profile media" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile media" ON storage.objects;

-- SELECT policy: Anyone can view profile media publicly
CREATE POLICY "Public can view profile media"
ON storage.objects
FOR SELECT
USING (
    bucket_id IN ('profile-media', 'property-media')
);

-- INSERT policy: Authenticated users can upload files into their own user folder: {auth.uid()}/...
CREATE POLICY "Users can upload their own profile media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id IN ('profile-media', 'property-media')
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4')
);

-- UPDATE policy: Only the file owner can overwrite
CREATE POLICY "Users can update their own profile media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id IN ('profile-media', 'property-media')
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id IN ('profile-media', 'property-media')
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE policy: Only the file owner can delete
CREATE POLICY "Users can delete their own profile media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id IN ('profile-media', 'property-media')
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 4: Ensure permissions on public.profiles table
-- ─────────────────────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

COMMIT;
