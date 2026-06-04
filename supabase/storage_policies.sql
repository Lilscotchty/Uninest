-- Supabase Storage Policies for 'hostel-media' bucket
-- These policies control who can upload and view images from the manager dashboard.

-- 1. Ensure the bucket exists and is set to public (so images can be viewed freely on the frontend)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hostel-media', 'hostel-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if you're updating them (prevents conflicts)
DROP POLICY IF EXISTS "Public Read Access for Properties Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Managers Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Managers Rewrite Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Managers Delete Access" ON storage.objects;

-- 2. POLICY TO PULL IMAGES: Allow anyone (public) to view/pull images to display on property cards
CREATE POLICY "Public Read Access for Properties Media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'hostel-media' );

-- 3. POLICY TO PUSH IMAGES: Allow authenticated users (managers) to upload new images
CREATE POLICY "Authenticated Managers Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'hostel-media' );

-- 4. POLICY TO UPDATE: Allow authenticated managers to modify existing media files
CREATE POLICY "Authenticated Managers Rewrite Access"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'hostel-media' );

-- 5. POLICY TO DELETE: Allow authenticated managers to remove media they no longer need
CREATE POLICY "Authenticated Managers Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'hostel-media' );
