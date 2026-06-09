/**
 * PropertyReviews Page
 * Complete review page component with React + TypeScript
 * Integrates with Uninest's existing architecture
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useReviews } from '../hooks/useReviews';
import { PageHeader } from '../components/layout/PageHeader';
import { Toast } from '../components/Toast';
import {
  Star,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';

const StarRating: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onRatingChange, interactive = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`${
            sizeClasses[size]
          } transition-colors ${
            interactive ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'
          } ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          <Star fill="currentColor" />
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
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-slate-900 dark:text-white">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Distribution Bars */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-8">
                  {stars}★
                </span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 w-10 text-right">
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
    <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6 last:border-b-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.rating} size="md" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {review.title}
            </h3>
          </div>

          {/* Reviewer Info */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>
              {review.reviewer_profile_visible ? review.user?.email || 'Anonymous' : 'Anonymous'}
            </span>

            {review.is_verified_tenant && (
              <span className="flex items-center gap-1 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                <CheckCircle size={12} />
                Verified Guest
              </span>
            )}
          </div>
        </div>

        <time className="text-xs text-slate-500 dark:text-slate-500">
          {new Date(review.created_at).toLocaleDateString()}
        </time>
      </div>

      {/* Content */}
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{review.content}</p>

      {/* FTC Disclosure */}
      {review.disclosure_status !== 'standard' && (
        <div className="mb-4 flex items-start gap-2 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 p-2 rounded text-xs text-amber-800 dark:text-amber-200">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            <strong>Disclosure:</strong> {review.disclosure_text}
          </p>
        </div>
      )}

      {/* Aspect Ratings */}
      {review.aspects && Object.keys(review.aspects).length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded">
          {Object.entries(review.aspects).map(([aspect, rating]: [string, any]) => (
            <div key={aspect} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                {aspect}
              </span>
              <StarRating rating={rating} size="sm" />
            </div>
          ))}
        </div>
      )}

      {/* Helpful Voting */}
      <div className="flex items-center gap-6 mb-4 py-3 border-t border-b border-slate-100 dark:border-slate-700">
        <span className="text-sm text-slate-600 dark:text-slate-400">Was this helpful?</span>
        <button
          onClick={() => handleVote(true)}
          disabled={loading}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            isHelpful === true
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ThumbsUp size={14} className="inline mr-1" /> Helpful ({review.helpful_count})
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={loading}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            isHelpful === false
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ThumbsDown size={14} className="inline mr-1" /> Not helpful ({review.unhelpful_count})
        </button>
      </div>

      {/* Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="ml-6 mb-4 p-4 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-300 dark:border-blue-700 rounded">
          {review.replies.map((reply: any) => (
            <div key={reply.id} className="mb-3 last:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-900 dark:text-blue-300">
                  {reply.user?.email || 'Property Owner'}
                </span>
                <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                  Property Owner
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{reply.content}</p>
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
    stay_duration_months: null as number | null,
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
      setError('Please log in to post a review');
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
      setError(err instanceof Error ? err.message : 'Failed to post review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Share Your Experience
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-red-800 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Rating
        </label>
        <StarRating
          rating={formData.rating}
          onRatingChange={(rating) => setFormData({ ...formData, rating })}
          interactive={true}
          size="lg"
        />
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Review Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Summarize your experience"
          maxLength={200}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formData.title.length}/200
        </p>
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Review
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Share details about your experience"
          rows={6}
          maxLength={5000}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formData.content.length}/5000
        </p>
      </div>

      {/* Verification */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_verified_tenant}
            onChange={(e) => setFormData({ ...formData, is_verified_tenant: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            I stayed/viewed this property
          </span>
        </label>
      </div>

      {/* FTC Disclosure */}
      <div className="mb-6 p-4 border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900 rounded">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-3">
          Disclosure (FTC Compliance)
        </label>
        <select
          value={formData.disclosure_status}
          onChange={(e) =>
            setFormData({
              ...formData,
              disclosure_status: e.target.value as 'standard' | 'incentivized' | 'affiliated',
            })
          }
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
        >
          <option value="standard">Standard Review</option>
          <option value="incentivized">Incentivized (Received compensation)</option>
          <option value="affiliated">Affiliated (Business relationship)</option>
        </select>

        {formData.disclosure_status !== 'standard' && (
          <div className="mt-3">
            <textarea
              value={formData.disclosure_text}
              onChange={(e) => setFormData({ ...formData, disclosure_text: e.target.value })}
              placeholder="Disclosure details (required)"
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 font-medium"
        >
          {loading ? 'Posting...' : 'Post Review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          Cancel
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

  if (loading || !analytics) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-app-bg">
      <PageHeader title="Guest Reviews" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Rating Distribution */}
          {analytics && (
            <RatingDistribution
              distribution={analytics.distribution}
              averageRating={analytics.average_rating}
              totalReviews={analytics.total_reviews}
            />
          )}

          {/* Create Review Button */}
          {user && !showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all"
            >
              Share Your Experience
            </button>
          )}

          {/* Create Form */}
          {showCreateForm && (
            <div className="mt-8">
              <CreateReviewForm
                propertyId={propertyId || ''}
                userId={user?.id}
                onSuccess={() => {
                  setShowCreateForm(false);
                  refetch();
                }}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          {/* Sort Controls */}
          <div className="mt-8 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              All Reviews ({analytics.total_reviews})
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating_high">Highest Rated</option>
              <option value="rating_low">Lowest Rated</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="mt-8">
            {reviews.length === 0 ? (
              <p className="text-center text-slate-600 dark:text-slate-400 py-12">
                No reviews yet. Be the first to share your experience!
              </p>
            ) : (
              <div>
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    userId={user?.id}
                    onVote={voteHelpful}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast />
    </div>
  );
};
