/**
 * PropertyReviews Page
 * Clean, high-fidelity design, card-less layout
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useReviews } from '../hooks/useReviews';
import { PageHeader } from '../components/layout/PageHeader';
import { Toast } from '../components/Toast';
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  X,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

// Bespoke, modern rating system replacing generic stars
const RatingBlocks: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onRatingChange, interactive = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3 sm:w-4 sm:h-4 gap-1',
    md: 'w-5 h-5 sm:w-6 sm:h-6 gap-1.5',
    lg: 'w-8 h-8 sm:w-10 sm:h-10 gap-2',
  };

  return (
    <div className={`flex items-center ${sizeClasses[size].split(' ')[2]}`}>
      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => interactive && onRatingChange?.(level)}
          className={`flex items-center justify-center transition-all duration-300 ${
            interactive ? 'cursor-pointer hover:opacity-80 active:scale-95' : 'cursor-default'
          }`}
          aria-label={`Rate ${level} out of 5`}
        >
          <Star className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} ${level <= rating ? 'fill-black text-black' : 'fill-slate-200 text-slate-200'}`} />
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
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        {/* Average Rating Typography */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start">
          <div className="text-[5rem] sm:text-[6rem] font-bold text-slate-900 leading-none tracking-tighter mb-4">
            {averageRating.toFixed(1)}
          </div>
          <RatingBlocks rating={Math.round(averageRating)} size="md" />
          <p className="text-[0.9rem] text-slate-500 mt-4 font-medium uppercase tracking-widest">
            {totalReviews} Total Review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Minimalist Distribution Bars */}
        <div className="md:col-span-8 flex-1 w-full space-y-4">
          {[5, 4, 3, 2, 1].map((level) => {
            const count = distribution[level] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={level} className="flex items-center gap-4">
                <span className="w-4 text-[0.85rem] font-bold text-slate-700 text-right">{level}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-slate-800 rounded-full"
                  />
                </div>
                <span className="text-[0.8rem] text-slate-500 font-medium w-8 text-right tabular-nums">
                  {percentage > 0 ? `${Math.round(percentage)}%` : '0%'}
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
  onDelete?: (reviewId: string | number) => Promise<void>;
}> = ({ review, userId, onVote, onDelete }) => {
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

  const handleDelete = async () => {
    if (!onDelete) return;
    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        setLoading(true);
        await onDelete(review.id);
        showToast('Review deleted successfully');
      } catch (error) {
        showToast('Failed to delete review');
      } finally {
        setLoading(false);
      }
    }
  };

  const isOwner = userId === review.user_id;

  return (
    <div className="py-8 border-b border-slate-100 last:border-0 group">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
        
        {/* User / Meta Info Column */}
        <div className="md:col-span-3 flex flex-col items-start">
          <RatingBlocks rating={review.rating} size="sm" />
          
          <div className="mt-4">
            <span className="block text-[0.9rem] text-slate-900 font-bold mb-1">
              {review.reviewer_profile_visible ? `${review.user?.first_name || ''} ${review.user?.last_name || ''}`.trim() || 'Guest' : 'Anonymous Guest'}
            </span>
            <span className="block text-[0.8rem] text-slate-500 font-medium tracking-wide">
              {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {review.is_verified_tenant && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50/50 text-green-700 rounded-md text-[0.65rem] font-bold uppercase tracking-widest border border-green-100/50">
              <CheckCircle size={10} strokeWidth={3} />
              Verified Stay
            </div>
          )}
        </div>

        {/* Content Column */}
        <div className="md:col-span-9">
          <h3 className="text-xl font-bold text-slate-900 leading-tight tracking-tight mb-3">
            {review.title}
          </h3>
          
          <p className="text-[0.95rem] text-slate-600 leading-relaxed mb-6 font-medium">
            {review.content}
          </p>

          {/* FTC Disclosure */}
          {review.disclosure_status !== 'standard' && (
            <div className="mb-6 flex items-start gap-2 text-[0.8rem] text-slate-500 italic">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p>Disclosure: {review.disclosure_text}</p>
            </div>
          )}

          {/* Aspect Ratings */}
          {review.aspects && Object.keys(review.aspects).length > 0 && (
            <div className="flex flex-wrap gap-x-8 gap-y-3 mb-6">
              {Object.entries(review.aspects).map(([aspect, rating]: [string, any]) => (
                <div key={aspect} className="flex flex-col gap-1.5">
                  <span className="text-[0.7rem] text-slate-400 font-bold uppercase tracking-widest">
                    {aspect}
                  </span>
                  <RatingBlocks rating={rating} size="sm" />
                </div>
              ))}
            </div>
          )}

          {/* Helpful Voting */}
          <div className="flex items-center gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[0.75rem] text-slate-400 font-bold uppercase tracking-widest">Helpful?</span>
            <button
              onClick={() => handleVote(true)}
              disabled={loading}
              className={`text-[0.8rem] font-bold transition-colors flex items-center gap-1.5 ${
                isHelpful === true
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ThumbsUp size={14} className={isHelpful === true ? 'fill-slate-900' : ''} /> 
              {review.helpful_count}
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={loading}
              className={`text-[0.8rem] font-bold transition-colors flex items-center gap-1.5 ${
                isHelpful === false
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ThumbsDown size={14} className={isHelpful === false ? 'fill-slate-900' : ''} /> 
              {review.unhelpful_count}
            </button>
            
            {isOwner && onDelete && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="ml-auto text-[0.8rem] font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
              >
                Delete
              </button>
            )}
          </div>

          {/* Replies */}
          {review.replies && review.replies.length > 0 && (
            <div className="mt-8 pl-6 border-l w-[3px] border-slate-200">
              {review.replies.map((reply: any) => (
                <div key={reply.id} className="pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-[0.85rem] text-slate-900">
                      {`${reply.user?.first_name || ''} ${reply.user?.last_name || ''}`.trim() || 'Property Manager'}
                    </span>
                    <span className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-widest">
                      Response
                    </span>
                  </div>
                  <p className="text-[0.85rem] text-slate-600 leading-relaxed font-medium">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 mb-16 relative"
    >
      <button 
        type="button" 
        onClick={onCancel}
        className="absolute top-8 right-8 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
      >
        <X size={20} />
      </button>

      <div className="mb-10 lg:pr-12">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Share Your Experience
        </h3>
        <p className="text-[0.95rem] text-slate-500 font-medium">
          Your feedback helps future students make better living decisions. Please be honest and detailed.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-900 text-[0.85rem] font-bold rounded-xl flex items-center gap-3">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mb-8">
        <label className="block text-[0.75rem] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Overall Rating
        </label>
        <RatingBlocks
          rating={formData.rating}
          onRatingChange={(rating) => setFormData({ ...formData, rating })}
          interactive={true}
          size="lg"
        />
      </div>

      {/* Title */}
      <div className="mb-8">
        <label className="block text-[0.75rem] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Review Headline
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Sum up your experience in a few words"
          maxLength={100}
          className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 text-slate-900 hover:bg-slate-50 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none font-medium placeholder:text-slate-400"
          required
        />
      </div>

      {/* Content */}
      <div className="mb-8">
        <label className="block text-[0.75rem] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Detailed Review
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="What did you love? What could be better? Consider mentioning noise levels, management responsiveness, and cleanliness."
          rows={6}
          maxLength={2000}
          className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 text-slate-900 hover:bg-slate-50 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none font-medium placeholder:text-slate-400 resize-y"
          required
        />
      </div>

      {/* Verification */}
      <div className="mb-10">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-center mt-0.5">
            <input
              type="checkbox"
              checked={formData.is_verified_tenant}
              onChange={(e) => setFormData({ ...formData, is_verified_tenant: e.target.checked })}
              className="w-5 h-5 border-2 border-slate-200 rounded-md appearance-none checked:bg-[var(--color-button)] checked:border-slate-900 transition-colors cursor-pointer group-hover:border-slate-900"
            />
            {formData.is_verified_tenant && (
              <CheckCircle size={14} className="absolute inset-0 m-auto text-white pointer-events-none" strokeWidth={3} />
            )}
          </div>
          <div>
            <span className="block text-[0.95rem] font-bold text-slate-900 mb-1">
              I certify that I actually stayed at this property
            </span>
            <span className="block text-[0.85rem] text-slate-500 font-medium">
              Verified reviews display a special badge and help build community trust.
            </span>
          </div>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold text-[0.9rem] rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.title || !formData.content}
          className="px-10 py-4 bg-[var(--color-button)] text-white font-bold text-[0.9rem] rounded-xl hover:bg-[var(--color-button-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
        >
          {loading ? 'Posting...' : 'Submit Review'}
        </button>
      </div>
    </motion.form>
  );
};

export const PropertyReviews: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user, showToast } = useAppContext();
  const { reviews, analytics, loading, sortBy, setSortBy, voteHelpful, deleteReview, refetch } = useReviews({
    propertyId: propertyId || '',
    sortBy: 'recent',
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader 
        title="Guest Feedback" 
        rightAction={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-900 hover:text-slate-600 transition-colors font-bold text-[0.9rem]"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        }
      />

      <div className="flex-1 px-6 py-12 md:py-20">
        <div className="max-w-[1000px] mx-auto">
          {loading && !analytics ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
            </div>
          ) : (
            <>
              {/* Rating Distribution */}
              {analytics && analytics.total_reviews > 0 && (
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
                <div className="mb-16 pb-12 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                      Share Your Experience
                    </h4>
                    <p className="text-[0.95rem] text-slate-500 font-medium">
                      Your review helps others find their perfect space.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) {
                        showToast("Please sign in to write a review");
                        return;
                      }
                      setShowCreateForm(true);
                    }}
                    className="px-8 py-3.5 bg-[var(--color-button)] text-white rounded-xl font-bold text-[0.9rem] shadow-sm hover:bg-[var(--color-button-hover)] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <MessageCircle size={18} />
                    Write a Review
                  </button>
                </div>
              )}

              {/* Filter / Sort Header */}
              {reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    All Reviews
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[0.75rem] text-slate-400 font-bold uppercase tracking-widest">Sort by</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="py-2 pl-3 pr-8 border-0 bg-slate-50 hover:bg-slate-100 rounded-lg text-[0.85rem] font-bold text-slate-900 outline-none cursor-pointer appearance-none transition-colors"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231e293b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                      <option value="recent">Most Recent</option>
                      <option value="helpful">Most Helpful</option>
                      <option value="rating_high">Highest Rated</option>
                      <option value="rating_low">Lowest Rated</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="flex flex-col">
                {reviews.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <MessageCircle size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-3">No reviews yet</h4>
                    <p className="text-[0.95rem] text-slate-500 font-medium max-w-[300px] mx-auto">
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
                      onDelete={deleteReview}
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
