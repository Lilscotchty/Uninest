# Property Reviews Page - Integration Guide

## Overview
The Property Reviews page is a comprehensive review system for properties with full compliance and moderation features.

## Files Created

### 1. `src/types/review.ts`
- **Purpose**: TypeScript type definitions for all review-related data structures
- **Key Types**:
  - `PropertyReview`: Main review interface with compliance fields
  - `ReviewReply`: Landlord responses to reviews
  - `PropertyReviewAnalytics`: Statistics and aggregations
  - `CreateReviewInput`: Form submission input

### 2. `src/services/reviewService.ts`
- **Purpose**: API service layer for all review operations
- **Key Functions**:
  - `getPropertyReviews()`: Fetch reviews with pagination & sorting
  - `createReview()`: Post a new review with validation
  - `updateReview()`: Edit review (within 30 days, author only)
  - `deleteReview()`: Delete review (GDPR compliance)
  - `createReply()`: Landlord response to review
  - `voteHelpful()`: Mark review as helpful/unhelpful
  - `getReviewAnalytics()`: Get rating distribution & stats
  - `moderateReview()`: Admin moderation actions

**Usage**:
```typescript
import * as reviewService from '@/services/reviewService';

// Fetch reviews for a property
const { reviews, total, page } = await reviewService.getPropertyReviews(propertyId, {
  page: 1,
  pageSize: 10,
  sortBy: 'recent'
});

// Create a review
const review = await reviewService.createReview(userId, {
  property_id: propertyId,
  rating: 5,
  title: 'Great place!',
  content: 'Amazing property...',
  disclosure_status: 'standard'
});
```

### 3. `src/hooks/useReviews.ts`
- **Purpose**: React hook for managing review state and operations
- **Key Features**:
  - State management for reviews, analytics, loading, error
  - Pagination and sorting
  - CRUD operations (create, update, delete, vote)
  - Automatic refetch after mutations
  - TypeScript typing for all operations

**Usage**:
```typescript
import { useReviews } from '@/hooks/useReviews';

function MyComponent() {
  const {
    reviews,
    analytics,
    loading,
    error,
    page,
    setPage,
    sortBy,
    setSortBy,
    createReview,
    deleteReview,
    voteHelpful,
    refetch
  } = useReviews({
    propertyId: '123',
    pageSize: 10,
    sortBy: 'recent'
  });

  // Use reviews in your component
}
```

### 4. `src/pages/PropertyReviews.tsx`
- **Purpose**: Complete review page with UI components
- **Components**:
  - `StarRating`: Interactive star rating component
  - `RatingDistribution`: Chart showing rating breakdown
  - `ReviewCard`: Individual review display with replies
  - `CreateReviewForm`: Form for posting new reviews
  - `PropertyReviews`: Main page component

**Features**:
- ✅ Rating visualization (distribution chart)
- ✅ Create review with FTC disclosure fields
- ✅ Edit review (30-day window)
- ✅ Delete review (GDPR)
- ✅ Landlord replies to reviews
- ✅ Helpful/unhelpful voting
- ✅ Verified tenant badges
- ✅ Anonymous review option
- ✅ Multiple sorting options
- ✅ Pagination support
- ✅ Dark mode support

## Integration Steps

### Step 1: Add Database Tables to Supabase

Run these SQL migrations:

```sql
-- Property Reviews Table
CREATE TABLE property_reviews (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES hostels(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  aspects JSONB DEFAULT '{}'::jsonb,
  
  is_verified_tenant BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  stay_duration_months INT,
  
  is_published BOOLEAN DEFAULT TRUE,
  flagged_for_review BOOLEAN DEFAULT FALSE,
  moderation_status VARCHAR(50) DEFAULT 'approved',
  moderation_reason TEXT,
  moderated_by_user_id UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMP,
  
  disclosure_status VARCHAR(100) DEFAULT 'standard',
  disclosure_text TEXT,
  reviewer_profile_visible BOOLEAN DEFAULT TRUE,
  
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Review Replies Table
CREATE TABLE review_replies (
  id BIGSERIAL PRIMARY KEY,
  review_id BIGINT NOT NULL REFERENCES property_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Helpful Votes Table
CREATE TABLE review_helpful_votes (
  id BIGSERIAL PRIMARY KEY,
  review_id BIGINT NOT NULL REFERENCES property_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_property_reviews_property_id ON property_reviews(property_id);
CREATE INDEX idx_property_reviews_user_id ON property_reviews(user_id);
CREATE INDEX idx_property_reviews_created_at ON property_reviews(created_at DESC);
CREATE INDEX idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);
```

### Step 2: Add Route to App.tsx

```typescript
import { PropertyReviews } from './pages/PropertyReviews';

// In your Routes:
<Route path="/property/:propertyId/reviews" element={<PropertyReviews />} />
```

### Step 3: Add Link to Property Details Page

```typescript
// In Details.tsx or similar:
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const navigate = useNavigate();

// Add button to view reviews
<button
  onClick={() => navigate(`/property/${propertyId}/reviews`)}
  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  <MessageCircle size={18} />
  View Reviews ({totalReviews})
</button>
```

### Step 4: Update AppContext (Optional)

Add to `src/context/AppContext.tsx` if you want global review state:

```typescript
// Add to AppContextType interface
reviews: PropertyReview[];
setReviews: (reviews: PropertyReview[]) => void;
addReview: (review: PropertyReview) => void;

// Add to AppProvider
const [reviews, setReviews] = useState<PropertyReview[]>([]);

// Add to context value
value={{
  // ... existing values
  reviews,
  setReviews,
  addReview: (review) => setReviews(prev => [review, ...prev]),
}}
```

## Compliance Features

### FTC Endorsement Guides
- ✅ Disclosure fields for incentivized/affiliated reviews
- ✅ Required disclosure text for non-standard reviews
- ✅ Moderation system to catch fake reviews
- ✅ Audit logging for all moderation actions

### GDPR Compliance
- ✅ `reviewer_profile_visible` field for privacy
- ✅ Delete endpoint for "right to be forgotten"
- ✅ Data anonymization on delete
- ✅ Audit trail in moderation logs

### Review Verification
- ✅ Verified tenant badges
- ✅ Stay duration tracking
- ✅ Verification date logging
- ✅ Helpful vote tracking to identify spam

## TODO: Content Moderation (For Agent)

```typescript
// TODO: [AGENT] Implement in services/contentModerationService.ts

// 1. Profanity Filter
import { profanity } from 'better-profanity';
// or use Perspective API: https://www.perspectiveapi.com/

// 2. Spam Detection
// - Check for duplicate content (cosine similarity)
// - Flag competitor mentions
// - Detect URL patterns
// - Check for extreme aspect ratings (all 1s or 5s)

// 3. Rate Limiting
// - One review per property per user per 30 days
// - Track in Redis or database

// 4. Sentiment Analysis
// pip install textblob
// Flag extreme reviews (very negative or positive)
```

## Environment Variables

Add to `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

```bash
# Test review creation
npm run dev

# Navigate to a property
# Click "View Reviews"
# Fill out review form
# Submit and verify in Supabase
```

## Performance Considerations

- Pagination (10 items per page)
- Index on property_id, user_id, created_at
- Lazy load images
- Cache analytics for 5 minutes
- Limit replies fetched per review

## Next Steps

1. ✅ Review system infrastructure (done)
2. ⏳ Content moderation service
3. ⏳ Email notifications for replies
4. ⏳ Review analytics dashboard
5. ⏳ Bulk moderation tools for admins
6. ⏳ Review export for landlords

