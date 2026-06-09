/**
 * Review System Types
 * Comprehensive TypeScript types for property reviews with compliance and moderation
 */

export interface PropertyReview {
  id: string | number;
  property_id: string | number;
  user_id: string | number;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  content: string;
  aspects?: Record<string, number>; // e.g., {"cleanliness": 4, "location": 5}
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Engagement
  helpful_count: number;
  unhelpful_count: number;
  reply_count: number;
  
  // Verification (Compliance)
  is_verified_tenant: boolean;
  verification_date?: string;
  stay_duration_months?: number;
  
  // Publishing & Moderation
  is_published: boolean;
  flagged_for_review: boolean;
  moderation_status: 'approved' | 'pending' | 'rejected';
  moderation_reason?: string;
  moderated_by_user_id?: string;
  moderated_at?: string;
  
  // FTC Disclosure Compliance
  disclosure_status: 'standard' | 'incentivized' | 'affiliated';
  disclosure_text?: string;
  
  // Privacy (GDPR)
  reviewer_profile_visible: boolean;
  
  // Relationships
  user?: { id: string; email: string; user_metadata?: any };
  replies?: ReviewReply[];
  images?: ReviewImage[];
  helpful_votes?: ReviewHelpfulVote[];
}

export interface ReviewReply {
  id: string | number;
  review_id: string | number;
  user_id: string | number;
  content: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  user?: { id: string; email: string; username?: string };
}

export interface ReviewHelpfulVote {
  id: string | number;
  review_id: string | number;
  user_id: string | number;
  is_helpful: boolean;
  created_at: string;
}

export interface ReviewImage {
  id: string | number;
  review_id: string | number;
  image_url: string;
  caption?: string;
  created_at: string;
  is_flagged: boolean;
  flag_reason?: string;
}

export interface ReviewModerationLog {
  id: string | number;
  review_id: string | number;
  moderator_id: string | number;
  action: 'created' | 'approved' | 'rejected' | 'flagged' | 'restored';
  reason?: string;
  previous_status?: string;
  new_status?: string;
  created_at: string;
}

export interface PropertyReviewAnalytics {
  property_id: string | number;
  total_reviews: number;
  average_rating: number;
  distribution: Record<number, number>; // {1: 5, 2: 3, 3: 10, 4: 25, 5: 40}
  aspect_ratings?: Record<string, number>; // avg ratings per aspect
  total_helpful_votes: number;
  total_replies: number;
  verified_review_count: number;
  recent_review_count_7d: number;
  recent_review_count_30d: number;
}

export interface CreateReviewInput {
  property_id: string | number;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  content: string;
  aspects?: Record<string, number>;
  is_verified_tenant?: boolean;
  stay_duration_months?: number;
  disclosure_status?: 'standard' | 'incentivized' | 'affiliated';
  disclosure_text?: string;
}

export interface UpdateReviewInput {
  rating?: 1 | 2 | 3 | 4 | 5;
  title?: string;
  content?: string;
  aspects?: Record<string, number>;
}
