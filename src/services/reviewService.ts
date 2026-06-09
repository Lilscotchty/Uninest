/**
 * Review Service
 * Handles all review API calls with Supabase integration
 * TypeScript implementation with proper error handling
 */

import { supabase } from '../lib/supabase';
import type {
  PropertyReview,
  ReviewReply,
  PropertyReviewAnalytics,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewHelpfulVote,
} from '../types/review';

const REVIEWS_TABLE = 'property_reviews';
const REPLIES_TABLE = 'review_replies';
const VOTES_TABLE = 'review_helpful_votes';
const IMAGES_TABLE = 'review_images';
const LOGS_TABLE = 'review_moderation_logs';

/**
 * Fetch all reviews for a property with pagination
 */
export async function getPropertyReviews(
  propertyId: string | number,
  options: {
    page?: number;
    pageSize?: number;
    sortBy?: 'recent' | 'helpful' | 'rating_high' | 'rating_low';
  } = {}
) {
  const { page = 1, pageSize = 10, sortBy = 'recent' } = options;
  const start = (page - 1) * pageSize;

  let query = supabase
    .from(REVIEWS_TABLE)
    .select(`
      *,
      user:user_id(*),
      replies:${REPLIES_TABLE}(*),
      images:${IMAGES_TABLE}(*),
      helpful_votes:${VOTES_TABLE}(*)
    `)
    .eq('property_id', propertyId)
    .eq('is_published', true);

  // Apply sorting
  switch (sortBy) {
    case 'helpful':
      query = query.order('helpful_count', { ascending: false });
      break;
    case 'rating_high':
      query = query.order('rating', { ascending: false });
      break;
    case 'rating_low':
      query = query.order('rating', { ascending: true });
      break;
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error, count } = await query.range(start, start + pageSize - 1);

  if (error) throw new Error(`Failed to fetch reviews: ${error.message}`);

  return {
    reviews: data as PropertyReview[],
    total: count || 0,
    page,
    pageSize,
  };
}

/**
 * Get a single review by ID
 */
export async function getReviewById(reviewId: string | number) {
  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .select(`
      *,
      user:user_id(*),
      replies:${REPLIES_TABLE}(*),
      images:${IMAGES_TABLE}(*),
      helpful_votes:${VOTES_TABLE}(*)
    `)
    .eq('id', reviewId)
    .single();

  if (error) throw new Error(`Failed to fetch review: ${error.message}`);
  return data as PropertyReview;
}

/**
 * Create a new review
 * Includes validation and compliance checks
 */
export async function createReview(
  userId: string,
  input: CreateReviewInput
): Promise<PropertyReview> {
  // Validation
  if (!input.title || input.title.length < 5 || input.title.length > 200) {
    throw new Error('Title must be between 5 and 200 characters');
  }
  if (!input.content || input.content.length < 20 || input.content.length > 5000) {
    throw new Error('Content must be between 20 and 5000 characters');
  }
  if (input.rating < 1 || input.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  // FTC Compliance: Check disclosure
  if (
    input.disclosure_status &&
    input.disclosure_status !== 'standard' &&
    !input.disclosure_text
  ) {
    throw new Error(
      'Disclosure text is required for incentivized or affiliated reviews (FTC compliance)'
    );
  }

  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .insert([
      {
        property_id: input.property_id,
        user_id: userId,
        rating: input.rating,
        title: input.title,
        content: input.content,
        aspects: input.aspects || {},
        is_verified_tenant: input.is_verified_tenant || false,
        stay_duration_months: input.stay_duration_months || null,
        disclosure_status: input.disclosure_status || 'standard',
        disclosure_text: input.disclosure_text || null,
        is_published: true,
        moderation_status: 'approved', // TODO: Add profanity/spam detection
        flagged_for_review: false,
        reviewer_profile_visible: true,
        helpful_count: 0,
        unhelpful_count: 0,
        reply_count: 0,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create review: ${error.message}`);

  // Log moderation action
  await supabase.from(LOGS_TABLE).insert([
    {
      review_id: data.id,
      moderator_id: userId,
      action: 'created',
      new_status: 'approved',
    },
  ]);

  return data as PropertyReview;
}

/**
 * Update a review (author only, within 30 days)
 */
export async function updateReview(
  reviewId: string | number,
  userId: string,
  input: UpdateReviewInput
): Promise<PropertyReview> {
  // Get existing review
  const existing = await getReviewById(reviewId);

  // Authorization
  if (existing.user_id !== userId) {
    throw new Error('Unauthorized: You can only edit your own reviews');
  }

  // Time check: Can only edit within 30 days
  const createdDate = new Date(existing.created_at);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  if (createdDate < thirtyDaysAgo) {
    throw new Error('Reviews can only be edited within 30 days of creation');
  }

  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update review: ${error.message}`);
  return data as PropertyReview;
}

/**
 * Delete a review (GDPR right to be forgotten)
 */
export async function deleteReview(
  reviewId: string | number,
  userId: string,
  isAdmin: boolean = false
): Promise<void> {
  // Authorization check
  if (!isAdmin) {
    const review = await getReviewById(reviewId);
    if (review.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own reviews');
    }
  }

  const { error } = await supabase
    .from(REVIEWS_TABLE)
    .delete()
    .eq('id', reviewId);

  if (error) throw new Error(`Failed to delete review: ${error.message}`);
}

/**
 * Create a reply to a review (landlord/owner)
 */
export async function createReply(
  reviewId: string | number,
  userId: string,
  propertyId: string | number,
  content: string
): Promise<ReviewReply> {
  if (!content || content.length < 10 || content.length > 2000) {
    throw new Error('Reply must be between 10 and 2000 characters');
  }

  // TODO: Verify user is landlord of property
  // const landlordProfile = await getLandlordProfile(userId, propertyId);
  // if (!landlordProfile) throw new Error('Not authorized to reply');

  const { data, error } = await supabase
    .from(REPLIES_TABLE)
    .insert([
      {
        review_id: reviewId,
        user_id: userId,
        content,
        is_published: true,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create reply: ${error.message}`);

  // Increment reply count
  await supabase.rpc('increment_reply_count', { review_id: reviewId });

  return data as ReviewReply;
}

/**
 * Get all replies for a review
 */
export async function getReviewReplies(
  reviewId: string | number
): Promise<ReviewReply[]> {
  const { data, error } = await supabase
    .from(REPLIES_TABLE)
    .select(`
      *,
      user:user_id(*)
    `)
    .eq('review_id', reviewId)
    .eq('is_published', true)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch replies: ${error.message}`);
  return data as ReviewReply[];
}

/**
 * Vote on review helpfulness
 * One vote per user per review (replaces previous vote)
 */
export async function voteHelpful(
  reviewId: string | number,
  userId: string,
  isHelpful: boolean
): Promise<ReviewHelpfulVote> {
  // Check for existing vote
  const { data: existingVote } = await supabase
    .from(VOTES_TABLE)
    .select()
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .single();

  if (existingVote) {
    // Update existing vote if different
    if (existingVote.is_helpful !== isHelpful) {
      // Adjust counts
      const updateData: Record<string, number> = {};
      if (existingVote.is_helpful) {
        updateData.helpful_count = supabase.rpc('decrement_helpful', {
          review_id: reviewId,
        });
      } else {
        updateData.unhelpful_count = supabase.rpc('decrement_unhelpful', {
          review_id: reviewId,
        });
      }

      await supabase
        .from(VOTES_TABLE)
        .update({ is_helpful: isHelpful })
        .eq('id', existingVote.id);
    }
  } else {
    // Create new vote
    await supabase.from(VOTES_TABLE).insert([
      {
        review_id: reviewId,
        user_id: userId,
        is_helpful: isHelpful,
      },
    ]);
  }

  // Update helpful/unhelpful counts
  if (isHelpful) {
    await supabase.rpc('increment_helpful', { review_id: reviewId });
  } else {
    await supabase.rpc('increment_unhelpful', { review_id: reviewId });
  }

  // Re-fetch the vote
  const { data } = await supabase
    .from(VOTES_TABLE)
    .select()
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .single();

  return data as ReviewHelpfulVote;
}

/**
 * Get analytics for property reviews
 */
export async function getReviewAnalytics(
  propertyId: string | number
): Promise<PropertyReviewAnalytics> {
  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .select('rating, is_verified_tenant, reply_count, helpful_count')
    .eq('property_id', propertyId)
    .eq('is_published', true);

  if (error) throw new Error(`Failed to fetch analytics: ${error.message}`);

  const reviews = data || [];
  const total = reviews.length;

  if (total === 0) {
    return {
      property_id: propertyId,
      total_reviews: 0,
      average_rating: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      total_helpful_votes: 0,
      total_replies: 0,
      verified_review_count: 0,
      recent_review_count_7d: 0,
      recent_review_count_30d: 0,
    };
  }

  // Calculate distribution
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;
  let verifiedCount = 0;
  let totalHelpful = 0;
  let totalReplies = 0;

  reviews.forEach((review: any) => {
    distribution[review.rating]++;
    totalRating += review.rating;
    if (review.is_verified_tenant) verifiedCount++;
    totalHelpful += review.helpful_count || 0;
    totalReplies += review.reply_count || 0;
  });

  // Recent counts
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { data: recent7d } = await supabase
    .from(REVIEWS_TABLE)
    .select('id', { count: 'exact' })
    .eq('property_id', propertyId)
    .eq('is_published', true)
    .gte('created_at', sevenDaysAgo.toISOString());

  const { data: recent30d } = await supabase
    .from(REVIEWS_TABLE)
    .select('id', { count: 'exact' })
    .eq('property_id', propertyId)
    .eq('is_published', true)
    .gte('created_at', thirtyDaysAgo.toISOString());

  return {
    property_id: propertyId,
    total_reviews: total,
    average_rating: parseFloat((totalRating / total).toFixed(2)),
    distribution,
    total_helpful_votes: totalHelpful,
    total_replies: totalReplies,
    verified_review_count: verifiedCount,
    recent_review_count_7d: recent7d?.length || 0,
    recent_review_count_30d: recent30d?.length || 0,
  };
}

/**
 * Moderate a review (admin/moderator only)
 */
export async function moderateReview(
  reviewId: string | number,
  moderatorId: string,
  action: 'approved' | 'rejected' | 'flagged',
  reason?: string
): Promise<PropertyReview> {
  const review = await getReviewById(reviewId);
  const oldStatus = review.moderation_status;

  let newStatus: 'approved' | 'pending' | 'rejected' = 'approved';
  let isPublished = true;
  let flagged = false;

  switch (action) {
    case 'approved':
      newStatus = 'approved';
      isPublished = true;
      break;
    case 'rejected':
      newStatus = 'rejected';
      isPublished = false;
      break;
    case 'flagged':
      newStatus = 'pending';
      flagged = true;
      break;
  }

  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .update({
      moderation_status: newStatus,
      is_published: isPublished,
      flagged_for_review: flagged,
      moderated_by_user_id: moderatorId,
      moderated_at: new Date().toISOString(),
      moderation_reason: reason,
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw new Error(`Failed to moderate review: ${error.message}`);

  // Log moderation action
  await supabase.from(LOGS_TABLE).insert([
    {
      review_id: reviewId,
      moderator_id: moderatorId,
      action,
      reason,
      previous_status: oldStatus,
      new_status: newStatus,
    },
  ]);

  return data as PropertyReview;
}
