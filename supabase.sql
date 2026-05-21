-- Create table for Hostels
CREATE TABLE hostels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id uuid, -- Reference to auth.users or profiles if implemented
  name text NOT NULL,
  description text,
  digital_address text,
  location text,
  distance_to_campus text,
  amenities text[],
  policies text,
  image_url text, -- Main display image
  video_url text, -- Virtual tour video url
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for Rooms (linked to Hostels)
CREATE TABLE rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hostel_id uuid REFERENCES hostels(id) ON DELETE CASCADE,
  room_type text NOT NULL, -- e.g., 'Single', 'Double', '2 in a room'
  price numeric NOT NULL, -- Price per semester
  capacity integer, -- Number of people
  quantity integer, -- Number of this room type available
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) if needed.
-- For now, allowing open access for development purposes. 
-- IN PRODUCTION, make sure to set appropriate policies!
ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on hostels" ON hostels FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on hostels" ON hostels FOR INSERT WITH CHECK (true); -- Usually auth.uid() = manager_id

CREATE POLICY "Allow public read access on rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on rooms" ON rooms FOR INSERT WITH CHECK (true);

-- Set up Storage for Hostel Media
insert into storage.buckets (id, name, public) values ('hostel-media', 'hostel-media', true);

CREATE POLICY "Give public read access to hostel media" ON storage.objects FOR SELECT USING (bucket_id = 'hostel-media');
CREATE POLICY "Allow authenticated uploads to hostel media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hostel-media');
