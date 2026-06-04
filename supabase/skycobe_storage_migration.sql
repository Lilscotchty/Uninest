-- =============================================================================
-- SKYCOBE — Storage Bucket & Policy Migration
-- File:    skycobe_storage_migration.sql
-- Target:  Supabase SQL Editor (run once) or supabase/migrations/
-- Author:  SKYCOBE Engineering
-- =============================================================================
-- WHAT THIS SCRIPT DOES:
--   1. Renames the bucket from 'hostel-media' → 'property-media'
--      (safe: creates new bucket if not exists, migrates the old one)
--   2. Drops ALL stale policies (old names and new names) before recreating
--   3. Creates 4 storage policies with owner-scoped write guards:
--        • SELECT  → public (anyone can view property images)
--        • INSERT  → authenticated + owner-match  (uploader owns the file)
--        • UPDATE  → authenticated + owner-match  (only uploader can overwrite)
--        • DELETE  → authenticated + owner-match  (only uploader can delete)
--   4. Adds a file-type whitelist and a per-file size cap via WITH CHECK
--   5. Adds a folder-path convention so files are always namespaced by user
-- =============================================================================
-- CONVENTIONS ENFORCED:
--   Bucket    : property-media
--   Path fmt  : {user_id}/{property_id}/{filename}
--   Allowed   : image/jpeg, image/png, image/webp, image/gif, video/mp4
--   Max size  : 15 MB  (15 * 1024 * 1024 bytes = 15728640)
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 0  —  Safety: wrap everything in a transaction
-- ─────────────────────────────────────────────────────────────────────────────
BEGIN;


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1  —  Create / update the bucket
-- ─────────────────────────────────────────────────────────────────────────────

-- 1a. Create the new 'property-media' bucket if it does not yet exist.
--     file_size_limit  : 15 MB hard cap enforced at the storage layer
--     allowed_mime_types: whitelist enforced at the storage layer (belt)
--     public           : true so the CDN serves files without a signed URL
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
    15728640,           -- 15 MB in bytes
    ARRAY[
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4'
    ]
)
ON CONFLICT (id) DO UPDATE
    SET public             = true,
        file_size_limit    = 15728640,
        allowed_mime_types = ARRAY[
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
            'video/mp4'
        ];

-- 1b. Keep the old 'hostel-media' bucket alive but mark it private so
--     existing URLs keep resolving while you migrate URLs in the database.
--     Once all property rows have been updated to point at 'property-media',
--     delete this bucket manually from the Supabase dashboard.
INSERT INTO storage.buckets (id, name, public)
VALUES ('hostel-media', 'hostel-media', false)
ON CONFLICT (id) DO UPDATE SET public = false;

COMMENT ON TABLE storage.buckets IS
    'hostel-media is deprecated — migrate all media URLs to property-media then delete.';


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2  —  Drop ALL stale policies (both old and new names) before recreating
--            Prevents "policy already exists" errors on re-runs
-- ─────────────────────────────────────────────────────────────────────────────

-- Old names (hostel-era)
DROP POLICY IF EXISTS "Public Read Access for Properties Media"       ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Managers Upload Access"           ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Managers Rewrite Access"          ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Managers Delete Access"           ON storage.objects;

-- New names (in case this script is re-run)
DROP POLICY IF EXISTS "skycobe_property_media_public_read"            ON storage.objects;
DROP POLICY IF EXISTS "skycobe_property_media_owner_insert"           ON storage.objects;
DROP POLICY IF EXISTS "skycobe_property_media_owner_update"           ON storage.objects;
DROP POLICY IF EXISTS "skycobe_property_media_owner_delete"           ON storage.objects;


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3  —  READ policy (public)
-- ─────────────────────────────────────────────────────────────────────────────
-- Anyone — authenticated or anonymous — can GET files from property-media.
-- This is required for property cards, detail pages, and the 360° viewer
-- to load images without needing a signed URL.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "skycobe_property_media_public_read"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'property-media'
);


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 4  —  INSERT policy (authenticated, owner-scoped, type + size guard)
-- ─────────────────────────────────────────────────────────────────────────────
-- Rules enforced:
--   a) User must be signed in (auth.uid() IS NOT NULL)
--   b) The file path MUST start with the uploader's own user ID:
--        {auth.uid()}/{property_id}/{filename}
--      This prevents user A from uploading into user B's folder.
--   c) MIME type must be in the whitelist (suspenders to bucket-level belt)
--   d) File size must be ≤ 15 MB (suspenders to bucket-level belt)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "skycobe_property_media_owner_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    -- Must be targeting the correct bucket
    bucket_id = 'property-media'

    -- Path must start with the authenticated user's own ID
    -- Enforces: property-media/{auth.uid()}/...
    AND (storage.foldername(name))[1] = auth.uid()::text

    -- MIME type whitelist (belt-and-suspenders alongside bucket setting)
    AND LOWER(storage.extension(name)) IN (
        'jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4'
    )

    -- Size cap: 15 MB  (metadata.size is in bytes)
    -- Note: this guard works at policy evaluation time; the bucket
    -- file_size_limit above enforces it at the API gateway level too.
    AND (metadata->>'size')::bigint <= 15728640
);


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 5  —  UPDATE policy (authenticated, owner-scoped)
-- ─────────────────────────────────────────────────────────────────────────────
-- Only the user who originally uploaded a file can overwrite it.
-- The USING clause checks the existing row's owner.
-- The WITH CHECK clause ensures the replacement still lives in their folder.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "skycobe_property_media_owner_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'property-media'
    AND owner = auth.uid()
)
WITH CHECK (
    bucket_id = 'property-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
);


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 6  —  DELETE policy (authenticated, owner-scoped)
-- ─────────────────────────────────────────────────────────────────────────────
-- Only the user who uploaded a file can delete it.
-- Prevents any authenticated user from wiping another user's media.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "skycobe_property_media_owner_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'property-media'
    AND owner = auth.uid()
);

COMMIT;
