-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  phone text,
  account_type text,
  university text,
  level text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- Row Level Security policies for Profiles Table
-- ----------------------------------------------------

-- Allow public read access to all profiles (or you can restrict to authenticated users)
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- ----------------------------------------------------
-- Trigger to insert a profile on sign up
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, account_type, university, level, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(new.raw_user_meta_data->>'full_name', ' ', 1)),
    COALESCE(new.raw_user_meta_data->>'last_name', substring(new.raw_user_meta_data->>'full_name' from position(' ' in new.raw_user_meta_data->>'full_name') + 1)),
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'account_type', 'student'), -- Default Google signups to 'student' mostly
    new.raw_user_meta_data->>'university',
    new.raw_user_meta_data->>'level',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
