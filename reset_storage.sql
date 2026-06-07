-- Hard Reset for Supabase Storage Bucket 'hostel-media'

-- 1. Drop existing policies to prevent conflicts
DO $$
BEGIN
    DROP POLICY IF EXISTS "Give public read access to hostel media" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated uploads to hostel media" ON storage.objects;
    DROP POLICY IF EXISTS "Allow anonymous uploads to hostel media" ON storage.objects;
    DROP POLICY IF EXISTS "public_read_hostel_media" ON storage.objects;
    DROP POLICY IF EXISTS "public_insert_hostel_media" ON storage.objects;
    DROP POLICY IF EXISTS "public_update_hostel_media" ON storage.objects;
    DROP POLICY IF EXISTS "public_delete_hostel_media" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN
        -- Ignore errors if policies don't exist
END $$;

-- 2. Make sure the bucket exists and is set to PUBLIC
INSERT INTO storage.buckets (id, name, public)
VALUES ('hostel-media', 'hostel-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Create extremely permissive policies for development
-- Allow anyone to read (SELECT)
CREATE POLICY "public_read_hostel_media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'hostel-media');

-- Allow anyone to upload (INSERT)
CREATE POLICY "public_insert_hostel_media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'hostel-media');

-- Allow anyone to update existing files (UPDATE)
CREATE POLICY "public_update_hostel_media" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'hostel-media')
WITH CHECK (bucket_id = 'hostel-media');

-- Allow anyone to delete files (DELETE)
CREATE POLICY "public_delete_hostel_media" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'hostel-media');
