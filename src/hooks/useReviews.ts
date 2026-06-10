import { useState, useEffect } from 'react';

export function useReviews({ propertyId, sortBy: initialSort = 'recent' }: { propertyId: string | number; sortBy?: 'recent' | 'helpful' | 'rating_high' | 'rating_low' }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(initialSort);

  const fetchReviews = async () => {
    setLoading(true);
    // Mock data for reviews
    const mockReviews = [
      {
        id: '1',
        rating: 5,
        title: 'Amazing experience!',
        content: 'I stayed here for a year and it was fantastic. The amenities are great and the location is perfect.',
        created_at: new Date().toISOString(),
        reviewer_profile_visible: true,
        user: { email: 'student@example.com' },
        is_verified_tenant: true,
        disclosure_status: 'standard',
        disclosure_text: '',
        aspects: { cleanliness: 5, location: 5, value: 5 },
        helpful_count: 12,
        unhelpful_count: 0,
        replies: []
      }
    ];

    setTimeout(() => {
      setReviews(mockReviews);
      setAnalytics({
        distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
        average_rating: 5,
        total_reviews: 1
      });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchReviews();
  }, [propertyId, sortBy]);

  const createReview = async (userId: string, data: any) => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  const voteHelpful = async (reviewId: string | number, userId: string, helpful: boolean) => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  return {
    reviews,
    analytics,
    loading,
    sortBy,
    setSortBy,
    createReview,
    voteHelpful,
    refetch: fetchReviews
  };
}
