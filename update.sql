-- Updates to hostels table
ALTER TABLE public.hostels 
ADD COLUMN IF NOT EXISTS image_360_url text,
ADD COLUMN IF NOT EXISTS lat double precision,
ADD COLUMN IF NOT EXISTS lng double precision;

-- Updates to rooms table
ALTER TABLE public.rooms
ADD COLUMN IF NOT EXISTS image_url text;

-- Create Storage Bucket for hostel-media if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hostel-media', 'hostel-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Give public read access to hostel media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'hostel-media');

-- Allow all uploads to the bucket (for development purposes)
CREATE POLICY "Allow anonymous uploads to hostel media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'hostel-media');

-- Ensure RLS on storage.objects allows this (usually on by default, but we should drop any conflicting old policies if needed, or simply let this allow anon access)
