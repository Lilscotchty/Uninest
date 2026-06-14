import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export function useReviews({ propertyId, sortBy: initialSort = 'recent' }: { propertyId: string | number; sortBy?: 'recent' | 'helpful' | 'rating_high' | 'rating_low' }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(initialSort);
  const { user } = useAppContext();

  const fetchReviews = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('property_reviews')
        .select(`
          *,
          user:profiles!user_id(first_name, last_name, avatar_url)
        `)
        .eq('property_id', propertyId);

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
          break;
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setReviews(data || []);

      // Calculate analytics
      if (data && data.length > 0) {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
        let totalRating = 0;
        
        data.forEach(r => {
          dist[r.rating as keyof typeof dist] = (dist[r.rating as keyof typeof dist] || 0) + 1;
          totalRating += r.rating;
        });

        setAnalytics({
          distribution: dist,
          average_rating: totalRating / data.length,
          total_reviews: data.length
        });
      } else {
        setAnalytics({
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          average_rating: 0,
          total_reviews: 0
        });
      }

    } catch (err: any) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId, sortBy]);

  const createReview = async (userId: string, data: any) => {
    const { error } = await supabase
      .from('property_reviews')
      .insert({
        ...data,
        user_id: userId
      });

    if (error) throw error;
  };

  const voteHelpful = async (reviewId: string | number, userId: string, helpful: boolean) => {
    // Basic implementation: update helpful count directly. 
    // In a real app we'd need a a 'property_reviews_votes' table to track users and prevent multiple votes.
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    const countUpdate = helpful 
      ? { helpful_count: (review.helpful_count || 0) + 1 }
      : { unhelpful_count: (review.unhelpful_count || 0) + 1 };

    const { error } = await supabase
      .from('property_reviews')
      .update(countUpdate)
      .eq('id', reviewId);

    if (error) throw error;
    
    // Optimistic update
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ...countUpdate } : r));
  };

  const deleteReview = async (reviewId: string | number) => {
    const { error } = await supabase
      .from('property_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  return {
    reviews,
    analytics,
    loading,
    sortBy,
    setSortBy,
    createReview,
    deleteReview,
    voteHelpful,
    refetch: fetchReviews
  };
}
