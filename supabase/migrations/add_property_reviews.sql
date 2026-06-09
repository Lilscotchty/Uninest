-- ─────────────────────────────────────────────────────────────────────────────
-- Property Reviews Migration
-- Adds review management system with proper RLS policies
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Create Reviews Table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.property_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES public.hostels(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Create Landlord Replies Table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.landlord_replies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id uuid NOT NULL REFERENCES public.property_reviews(id) ON DELETE CASCADE,
  landlord_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Create Helpful Votes Table (tracks who found a review helpful)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id uuid NOT NULL REFERENCES public.property_reviews(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Prevent duplicate votes from same user
  UNIQUE(review_id, voter_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Enable RLS on all tables
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlord_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. RLS Policies for property_reviews
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Anyone can read reviews (public viewing)
CREATE POLICY "Anyone can view property reviews"
ON public.property_reviews FOR SELECT
USING (true);

-- INSERT: Only authenticated students can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON public.property_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- UPDATE: Only the review author can edit their own review
CREATE POLICY "Users can update their own reviews"
ON public.property_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- DELETE: Only the review author can delete their own review
CREATE POLICY "Users can delete their own reviews"
ON public.property_reviews FOR DELETE
TO authenticated
USING (auth.uid() = student_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. RLS Policies for landlord_replies
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Anyone can read landlord replies
CREATE POLICY "Anyone can view landlord replies"
ON public.landlord_replies FOR SELECT
USING (true);

-- INSERT: Only the property landlord/manager can reply to reviews on their property
CREATE POLICY "Landlord can reply to reviews on their property"
ON public.landlord_replies FOR INSERT
TO authenticated
WITH CHECK (
  -- Verify the landlord owns the property being reviewed
  landlord_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.property_reviews pr
    JOIN public.hostels h ON pr.property_id = h.id
    WHERE pr.id = review_id AND h.manager_id = auth.uid()
  )
);

-- UPDATE: Only the reply author can edit their reply
CREATE POLICY "Landlord can update their own replies"
ON public.landlord_replies FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

-- DELETE: Only the reply author can delete their reply
CREATE POLICY "Landlord can delete their own replies"
ON public.landlord_replies FOR DELETE
TO authenticated
USING (auth.uid() = landlord_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. RLS Policies for review_helpful_votes
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: Anyone can view vote counts (for UI display)
CREATE POLICY "Anyone can view helpful votes"
ON public.review_helpful_votes FOR SELECT
USING (true);

-- INSERT: Only authenticated users can mark reviews as helpful
CREATE POLICY "Authenticated users can mark reviews as helpful"
ON public.review_helpful_votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = voter_id);

-- DELETE: Only the voter can remove their helpful vote
CREATE POLICY "Users can remove their helpful vote"
ON public.review_helpful_votes FOR DELETE
TO authenticated
USING (auth.uid() = voter_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Create Indexes for Performance
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON public.property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_student_id ON public.property_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.property_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_review_id ON public.landlord_replies(review_id);
CREATE INDEX IF NOT EXISTS idx_votes_review_id ON public.review_helpful_votes(review_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Create Functions for helpful_count Updates
-- ─────────────────────────────────────────────────────────────────────────────

-- Function to update helpful_count when a vote is added
CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.property_reviews 
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.property_reviews 
    SET helpful_count = GREATEST(helpful_count - 1, 0)
    WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
DROP TRIGGER IF EXISTS trigger_update_helpful_count ON public.review_helpful_votes;
CREATE TRIGGER trigger_update_helpful_count
AFTER INSERT OR DELETE ON public.review_helpful_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_review_helpful_count();

COMMIT;
