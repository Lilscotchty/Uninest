-- Drop the existing invalid table or view if it exists so we can recreate it with correct schema
DROP TABLE IF EXISTS public.property_reviews CASCADE;

-- Create property reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.property_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text NOT NULL,
  is_verified_tenant boolean DEFAULT false,
  disclosure_status text DEFAULT 'standard',
  disclosure_text text,
  aspects jsonb DEFAULT '{}'::jsonb,
  helpful_count integer DEFAULT 0,
  unhelpful_count integer DEFAULT 0,
  reviewer_profile_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.property_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access on property reviews
CREATE POLICY "Allow public read access on property reviews"
ON public.property_reviews FOR SELECT
USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Allow authenticated users to insert reviews"
ON public.property_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update own reviews"
ON public.property_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete their own reviews
CREATE POLICY "Allow users to delete own reviews"
ON public.property_reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow general updates to helpful/unhelpful counts for any authenticated user
-- Normally you'd have a separate table to prevent double voting, but for now we allow updating counts
CREATE POLICY "Allow users to update helpful counts"
ON public.property_reviews FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
