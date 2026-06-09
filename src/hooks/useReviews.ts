/**
 * useReviews Hook
 * React hook for managing reviews state and logic
 * TypeScript implementation with proper typing
 */

import { useState, useCallback, useEffect } from 'react';
import * as reviewService from '../services/reviewService';
import type { PropertyReview, PropertyReviewAnalytics, CreateReviewInput } from '../types/review';

interface UseReviewsOptions {
  propertyId: string | number;
  initialPage?: number;
  pageSize?: number;
  sortBy?: 'recent' | 'helpful' | 'rating_high' | 'rating_low';
}

export function useReviews({
  propertyId,
  initialPage = 1,
  pageSize = 10,
  sortBy = 'recent',
}: UseReviewsOptions) {
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [analytics, setAnalytics] = useState<PropertyReviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentSort, setCurrentSort] = useState(sortBy);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await reviewService.getPropertyReviews(propertyId, {
        page,
        pageSize,
        sortBy: currentSort,
      });

      setReviews(result.reviews);
      setTotalReviews(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [propertyId, page, pageSize, currentSort]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const analyticsData = await reviewService.getReviewAnalytics(propertyId);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, [propertyId]);

  // Initial load
  useEffect(() => {
    fetchReviews();
    fetchAnalytics();
  }, [fetchReviews, fetchAnalytics]);

  // Create review
  const createReview = useCallback(
    async (userId: string, input: CreateReviewInput) => {
      try {
        const newReview = await reviewService.createReview(userId, input);
        setReviews((prev) => [newReview, ...prev]);
        await fetchAnalytics(); // Refresh analytics
        return newReview;
      } catch (err) {
        throw err;
      }
    },
    [fetchAnalytics]
  );

  // Delete review
  const deleteReview = useCallback(
    async (reviewId: string | number, userId: string) => {
      try {
        await reviewService.deleteReview(reviewId, userId);
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        await fetchAnalytics();
      } catch (err) {
        throw err;
      }
    },
    [fetchAnalytics]
  );

  // Vote helpful
  const voteHelpful = useCallback(
    async (reviewId: string | number, userId: string, isHelpful: boolean) => {
      try {
        await reviewService.voteHelpful(reviewId, userId, isHelpful);
        // Refetch reviews to update counts
        await fetchReviews();
      } catch (err) {
        throw err;
      }
    },
    [fetchReviews]
  );

  return {
    reviews,
    analytics,
    loading,
    error,
    page,
    setPage,
    totalReviews,
    sortBy: currentSort,
    setSortBy: setCurrentSort,
    createReview,
    deleteReview,
    voteHelpful,
    refetch: fetchReviews,
  };
}
