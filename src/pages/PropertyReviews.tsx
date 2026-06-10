/**
 * PropertyReviews Page
 * Clean, professional review page component with React + TypeScript
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useReviews } from '../hooks/useReviews';
import { PageHeader } from '../components/layout/PageHeader';
import { Toast } from '../components/Toast';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  X,
  MessageCircle,
} from 'lucide-react';

const StarRating: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onRatingChange, interactive = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-7 h-7 sm:w-8 sm:h-8',
  };

  return (
    <div className="flex gap-1.5 sm:gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`${
            sizeClasses[size]
          } transition-transform ${
            interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
          } ${star <= rating ? 'text-amber-400 drop-shadow-sm' : 'text-slate-200'}`}
        >
          <Star fill="currentColor" className="w-full h-full" />
        </button>
      ))}
    </div>
  );
};

const RatingDistribution: React.FC<{
  distribution: Record<number, number>;
  averageRating: number;
  totalReviews: number;
}> = ({ distribution, averageRating, totalReviews }) => {
  return (
    <div className="bg-card-bg p-5 sm:p-8 rounded-[24px] border border-border-subtle shadow-sm mb-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center md:w-1/3 p-4 bg-app-bg rounded-[18px]">
          <div className="text-[3.5rem] sm:text-[4rem] font-bold text-[var(--color-heading)] leading-none mb-2 tracking-tight">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-[0.8rem] sm:text-[0.9rem] text-text-muted mt-3 font-medium">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Distribution Bars */}
        <div className="flex-1 w-full space-y-3 sm:space-y-4">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-10 shrink-0">
                  <span className="text-[0.85rem] font-bold text-text-primary">{stars}</span>
                  <Star size={12} className="text-amber-400" fill="currentColor" />
                </div>
                <div className="flex-1 h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[0.85rem] text-text-muted font-medium w-10 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ReviewCard: React.FC<{
  review: any;
  userId?: string;
  onVote: (reviewId: string | number, userId: string, helpful: boolean) => Promise<void>;
}> = ({ review, userId, onVote }) => {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useAppContext();

  const handleVote = async (helpful: boolean) => {
    if (!userId) {
      showToast('Please log in to vote');
      return;
    }

    try {
      setLoading(true);
      setIsHelpful(helpful);
      await onVote(review.id, userId, helpful);
    } catch (error) {
      showToast('Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card-bg p-5 sm:p-6 rounded-[20px] border border-border-subtle shadow-sm mb-5 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
            <StarRating rating={review.rating} size="sm" />
            <h3 className="text-[1.05rem] font-bold text-[var(--color-heading)] leading-tight">
              {review.title}
            </h3>
          </div>

          {/* Reviewer Info */}
          <div className="flex flex-wrap items-center gap-2 text-[0.8rem] text-text-muted font-medium">
            <span className="text-text-primary font-bold">
              {review.reviewer_profile_visible ? review.user?.email || 'Anonymous' : 'Anonymous Guest'}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>

            {review.is_verified_tenant && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-[6px] text-[0.7rem] font-bold uppercase tracking-wide">
                  <CheckCircle size={12} strokeWidth={2.5} />
                  Verified Stay
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-[0.95rem] text-text-primary leading-[1.6] mb-5">{review.content}</p>

      {/* FTC Disclosure */}
      {review.disclosure_status !== 'standard' && (
        <div className="mb-5 flex items-start gap-2 bg-amber-50/50 border border-amber-200/60 p-3 rounded-[12px] text-[0.8rem] text-amber-800">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
          <p>
            <strong className="font-bold">Disclosure:</strong> {review.disclosure_text}
          </p>
        </div>
      )}

      {/* Aspect Ratings */}
      {review.aspects && Object.keys(review.aspects).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 mb-5 p-4 bg-app-bg rounded-[14px]">
          {Object.entries(review.aspects).map(([aspect, rating]: [string, any]) => (
            <div key={aspect} className="flex items-center justify-between gap-2">
              <span className="text-[0.8rem] text-text-muted font-medium capitalize">
                {aspect}
              </span>
              <StarRating rating={rating} size="sm" />
            </div>
          ))}
        </div>
      )}

      {/* Helpful Voting */}
      <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-border-subtle">
        <span className="text-[0.8rem] text-text-muted font-medium mr-2">Helpful?</span>
        <button
          onClick={() => handleVote(true)}
          disabled={loading}
          className={`text-[0.8rem] font-bold px-3 py-1.5 rounded-[8px] transition-all flex items-center gap-1.5 ${
            isHelpful === true
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-app-bg text-text-primary border border-border-subtle hover:bg-slate-100'
          }`}
        >
          <ThumbsUp size={14} className={isHelpful === true ? 'fill-blue-600' : ''} /> 
          Yes ({review.helpful_count})
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={loading}
          className={`text-[0.8rem] font-bold px-3 py-1.5 rounded-[8px] transition-all flex items-center gap-1.5 ${
            isHelpful === false
              ? 'bg-slate-200 text-slate-700 border border-slate-300'
              : 'bg-app-bg text-text-primary border border-border-subtle hover:bg-slate-100'
          }`}
        >
          <ThumbsDown size={14} className={isHelpful === false ? 'fill-slate-700' : ''} /> 
          No ({review.unhelpful_count})
        </button>
      </div>

      {/* Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="mt-5 ml-4 sm:ml-6 pl-4 border-l-[3px] border-[var(--color-accent)]/30 space-y-4">
          {review.replies.map((reply: any) => (
            <div key={reply.id} className="bg-app-bg p-4 rounded-[14px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-[0.85rem] text-[var(--color-heading)]">
                  {reply.user?.email || 'Property Manager'}
                </span>
                <span className="text-[0.65rem] bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Response
                </span>
              </div>
              <p className="text-[0.85rem] text-text-primary leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateReviewForm: React.FC<{
  propertyId: string | number;
  userId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ propertyId, userId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
    is_verified_tenant: false,
    disclosure_status: 'standard' as 'standard' | 'incentivized' | 'affiliated',
    disclosure_text: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useAppContext();
  const { createReview } = useReviews({ propertyId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('Please sign in to post a review.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await createReview(userId, {
        property_id: propertyId,
        ...formData,
      });

      showToast('Review posted successfully!');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card-bg border border-[var(--color-accent)]/20 shadow-[0_8px_30px_rgba(192,132,60,0.06)] rounded-[24px] p-6 sm:p-8 mb-8 relative animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <button 
        type="button" 
        onClick={onCancel}
        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-app-bg text-text-muted rounded-full hover:bg-slate-200 transition-colors"
      >
        <X size={18} />
      </button>

      <h3 className="text-[1.3rem] font-bold text-[var(--color-heading)] mb-1">
        Share Your Experience
      </h3>
      <p className="text-[0.85rem] text-text-muted mb-6">
        Your feedback helps future students make better living decisions.
      </p>

      {error && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-[12px] text-red-700 text-[0.85rem] font-bold flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-[0.85rem] font-bold text-text-primary mb-3">
          Overall Rating
        </label>
        <div className="bg-app-bg inline-block p-3 px-4 rounded-[16px] border border-border-subtle">
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => setFormData({ ...formData, rating })}
            interactive={true}
            size="lg"
          />
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-[0.85rem] font-bold text-text-primary mb-2 ml-1">
          Review Headline
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="E.g., Great location, quiet study spaces"
          maxLength={100}
          className="w-full px-4 py-3 border border-border-subtle rounded-[14px] bg-app-bg focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none text-[0.95rem]"
          required
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-[0.85rem] font-bold text-text-primary mb-2 ml-1">
          Detailed Review
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="What did you love? What could be better? Consider mentioning noise levels, management responsiveness, and cleanliness."
          rows={5}
          maxLength={1000}
          className="w-full px-4 py-3 border border-border-subtle rounded-[14px] bg-app-bg focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none text-[0.95rem] resize-y"
          required
        />
        <div className="flex justify-end mt-1.5">
          <span className="text-[0.7rem] text-text-muted font-medium">
            {formData.content.length} / 1000
          </span>
        </div>
      </div>

      {/* Verification */}
      <div className="mb-6">
        <label className="flex items-center gap-3 p-4 border border-border-subtle rounded-[14px] cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={formData.is_verified_tenant}
              onChange={(e) => setFormData({ ...formData, is_verified_tenant: e.target.checked })}
              className="w-5 h-5 border-2 border-slate-300 rounded-[6px] appearance-none checked:bg-green-500 checked:border-green-500 transition-colors"
            />
            {formData.is_verified_tenant && (
              <CheckCircle size={14} className="absolute inset-0 m-auto text-white" strokeWidth={3} />
            )}
          </div>
          <div>
            <span className="block text-[0.9rem] font-bold text-text-primary leading-tight">
              I actually stayed here
            </span>
            <span className="block text-[0.75rem] text-text-muted mt-0.5">
              Verified reviews display a special badge and help others trust your feedback.
            </span>
          </div>
        </label>
      </div>

      {/* Buttons */}
      <div className="pt-2 border-t border-border-subtle flex gap-3 justify-end mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-app-bg text-text-primary font-bold text-[0.9rem] rounded-[14px] hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.title || !formData.content}
          className="px-8 py-3 bg-[var(--color-accent)] text-white font-bold text-[0.9rem] rounded-[14px] hover:bg-[#a66c2d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
        >
          {loading ? 'Posting...' : 'Post Review'}
        </button>
      </div>
    </form>
  );
};

export const PropertyReviews: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user, showToast } = useAppContext();
  const { reviews, analytics, loading, sortBy, setSortBy, voteHelpful, refetch } = useReviews({
    propertyId: propertyId || '',
    sortBy: 'recent',
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-app-bg">
      <PageHeader 
        title="Property Reviews" 
        actions={[{
          label: "Back",
          icon: <ChevronLeft />,
          onClick: () => navigate(-1)
        }]}
      />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {loading && !analytics ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-slate-200 border-t-[var(--color-accent)] rounded-full animate-spin mb-4" />
              <p className="text-[0.9rem] text-text-muted font-bold text-center animate-pulse">
                Loading reviews...
              </p>
            </div>
          ) : (
            <>
              {/* Rating Distribution */}
              {analytics && (
                <RatingDistribution
                  distribution={analytics.distribution}
                  averageRating={analytics.average_rating}
                  totalReviews={analytics.total_reviews}
                />
              )}

              {/* Create Form / Call to Action */}
              {showCreateForm ? (
                <CreateReviewForm
                  propertyId={propertyId || ''}
                  userId={user?.id}
                  onSuccess={() => {
                    setShowCreateForm(false);
                    refetch();
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              ) : (
                <div className="mb-8 flex flex-col sm:flex-row items-center justify-between bg-card-bg p-5 rounded-[20px] border border-border-subtle shadow-sm gap-4">
                  <div>
                    <h4 className="text-[1.05rem] font-bold text-[var(--color-heading)] leading-tight">
                      Have you stayed here?
                    </h4>
                    <p className="text-[0.8rem] text-text-muted font-medium mt-0.5">
                      Your review helps others find their perfect space.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) {
                        showToast("Please sign in to write a review");
                        // Consider navigating to login or showing a modal here
                        return;
                      }
                      setShowCreateForm(true);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-[12px] font-bold text-[0.85rem] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Write a Review
                  </button>
                </div>
              )}

              {/* Filter / Sort Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-[1.2rem] font-bold text-[var(--color-heading)] tracking-tight">
                  Guest Feedback ({analytics?.total_reviews || 0})
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[0.8rem] text-text-muted font-bold tracking-wide uppercase">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-border-subtle rounded-[10px] bg-card-bg text-[0.85rem] font-bold text-text-primary outline-none focus:border-[var(--color-accent)] cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="rating_high">Highest Rated</option>
                    <option value="rating_low">Lowest Rated</option>
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-1">
                {reviews.length === 0 ? (
                  <div className="text-center py-16 bg-card-bg rounded-[20px] border border-border-subtle px-4">
                    <MessageCircle size={40} className="mx-auto text-slate-300 mb-4" />
                    <h4 className="text-[1.1rem] font-bold text-text-primary mb-2">No reviews yet</h4>
                    <p className="text-[0.9rem] text-text-muted max-w-[280px] mx-auto">
                      Be the first to share your experience staying at this property!
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      userId={user?.id}
                      onVote={voteHelpful}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Toast />
    </div>
  );
};
