-- Clean up existing policies for recreate
DROP POLICY IF EXISTS "Allow public read access on hostels" ON public.hostels;
DROP POLICY IF EXISTS "Allow authenticated insert on hostels" ON public.hostels;
DROP POLICY IF EXISTS "Allow creator update on hostels" ON public.hostels;
DROP POLICY IF EXISTS "Allow creator delete on hostels" ON public.hostels;
DROP POLICY IF EXISTS "Allow public read access on rooms" ON public.rooms;
DROP POLICY IF EXISTS "Allow authenticated insert on rooms" ON public.rooms;
DROP POLICY IF EXISTS "Allow manager full access on rooms" ON public.rooms;
DROP POLICY IF EXISTS "Give public read access to hostel media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to hostel media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous uploads to hostel media" ON storage.objects;
DROP POLICY IF EXISTS "Lock uploads to authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Lock update to authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Lock delete to authenticated users" ON storage.objects;

-- Ensure tables are using row level security
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- Row Level Security policies for Hostels Table
-- ----------------------------------------------------

-- SELECT: Open to the public (true)
CREATE POLICY "Allow public read access on hostels" 
ON public.hostels FOR SELECT 
USING (true);

-- INSERT: Only authenticated users WITH CHECK (auth.uid() = manager_id)
CREATE POLICY "Allow authenticated insert on hostels" 
ON public.hostels FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = manager_id);

-- UPDATE & DELETE: Only the creator USING (auth.uid() = manager_id)
CREATE POLICY "Allow creator update on hostels" 
ON public.hostels FOR UPDATE 
TO authenticated
USING (auth.uid() = manager_id);

CREATE POLICY "Allow creator delete on hostels" 
ON public.hostels FOR DELETE 
TO authenticated
USING (auth.uid() = manager_id);


-- ----------------------------------------------------
-- Row Level Security policies for Rooms Table
-- ----------------------------------------------------

-- SELECT: Open to the public (true)
CREATE POLICY "Allow public read access on rooms" 
ON public.rooms FOR SELECT 
USING (true);

-- ALL (Insert, Update, Delete): Locked to the hostel manager by checking the parent table
CREATE POLICY "Allow manager full access on rooms" 
ON public.rooms FOR ALL 
TO authenticated
USING (
  hostel_id IN (
    SELECT id FROM public.hostels WHERE manager_id = auth.uid()
  )
)
WITH CHECK (
  hostel_id IN (
    SELECT id FROM public.hostels WHERE manager_id = auth.uid()
  )
);


-- ----------------------------------------------------
-- Row Level Security policies for Storage Bucket ('hostel-media')
-- ----------------------------------------------------

-- Ensure bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hostel-media', 'hostel-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public READ (SELECT) access to bucket objects
CREATE POLICY "Give public read access to hostel media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'hostel-media');

-- Lock INSERT uploads to authenticated users
CREATE POLICY "Lock uploads to authenticated users" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'hostel-media');

-- Add UPDATE policy allowing users to modify images, locked to authenticated users
CREATE POLICY "Lock update to authenticated users" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'hostel-media');

-- Add DELETE policy allowing users to remove images, locked to authenticated users
CREATE POLICY "Lock delete to authenticated users" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'hostel-media');
