'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Loading from '@/app/components/common/loading';
import { api } from '@/app/lib/config';
import { getUserProfile } from '@/app/lib/api/user';

interface UserReview {
  id: string;
  userName: string;
  userRole: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
}

export default function ReviewsPage() {
  const [showLoader, setShowLoader] = useState(true);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', lastName: '', job: '' });
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = `${api.baseUrl}/api${api.endpoints.reviews.list}`;

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        // Fetch user profile
        const userProfile = await getUserProfile();
        if (userProfile.user) {
          setCurrentUser({
            name: userProfile.user.name || '',
            lastName: userProfile.user.lastName || '',
            job: userProfile.user.job || 'Unemployed'
          });
        }

        // Fetch reviews
        const reviewsRes = await fetch(API_URL);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reverse());
        setShowLoader(false);
      } catch (err) {
        toast.error('Failed to load data');
        setShowLoader(false);
        console.error(err);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmitReview = async () => {
    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userName: `${currentUser.name} ${currentUser.lastName}`.trim() || 'Anonymous User',
      userRole: currentUser.job || 'Unemployed',
      title: newReview.title,
      content: newReview.content,
      rating: newReview.rating,
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error creating review');

      const saved = await res.json();
      setReviews([saved, ...reviews]);
      setNewReview({ title: '', content: '', rating: 5 });
      setShowReviewForm(false);
      toast.success('Thanks for your feedback!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const markHelpful = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}/helpful`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to update helpful count');

      const updated = await res.json();
      setReviews(reviews.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      toast.error('Could not update helpful count');
      console.error(err);
    }
  };

  const renderStars = (rating: number, showPartial = false) => {
    if (showPartial) {
      // For average rating, show partial stars
      return Array.from({ length: 5 }, (_, i) => {
        const fillPercentage = Math.max(0, Math.min(1, rating - i));
        
        return (
          <div key={i} className="relative w-5 h-5">
            {/* Background star (gray) */}
            <svg
              className="absolute inset-0 w-5 h-5 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Foreground star (yellow) with clip path for partial fill */}
            <svg
              className="absolute inset-0 w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{
                clipPath: `inset(0 ${100 - (fillPercentage * 100)}% 0 0)`
              }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        );
      });
    } else {
      // For individual reviews, show full stars only
      return Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
    }
  };

  const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  if (showLoader) return <Loading />;

  return (
    <div className="w-full px-4 py-4 sm:px-10 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Platform Reviews</h1>
        <p className="text-gray-600 mt-2">See what students are saying about StudyHive</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard label="Total Reviews" value={reviews.length.toString()} />
        <StatCard
          label="Average Rating"
          value={averageRating.toFixed(1)}
          icon={renderStars(averageRating, true)}
        />
        <StatCard
          label="5-Star Reviews"
          value={reviews.filter((r) => r.rating === 5).length.toString()}
        />
        <StatCard
          label="This Month"
          value={reviews.filter((r) => {
            const d = new Date(r.date);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length.toString()}
        />
      </div>

      <button
        onClick={() => setShowReviewForm(true)}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium mb-6"
      >
        Write a Review
      </button>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{review.title}</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                  <span className="font-medium text-gray-700">{review.userName}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{review.userRole}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{review.date}</span>
                </div>
                <div className="flex items-center space-x-1 mb-4">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600 ml-2">({review.rating}/5)</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => markHelpful(review.id)}
                className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showReviewForm && (
        <ReviewFormModal
          newReview={newReview}
          setNewReview={setNewReview}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-base font-semibold text-gray-800 mb-2">{label}</h3>
      <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
        {icon && <div className="flex justify-start">{icon}</div>}
        <p className="text-2xl font-bold text-primary text-left">{value}</p>
      </div>
    </div>
  );
}

function ReviewFormModal({
  newReview,
  setNewReview,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  newReview: { title: string; content: string; rating: number };
  setNewReview: (val: { title: string; content: string; rating: number }) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-black">Write a Review</h3>

        <label className="block text-sm font-medium mb-1 text-black">Rating</label>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setNewReview({ ...newReview, rating: star })}
              className="focus:outline-none"
            >
              <svg
                className={`w-8 h-8 ${
                  star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-1 text-black">Title</label>
        <input
          type="text"
          value={newReview.title}
          onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
          className="w-full border px-3 py-2 rounded mb-4 text-black"
          placeholder="Brief summary of your experience"
        />

        <label className="block text-sm font-medium mb-1 text-black">Review</label>
        <textarea
          value={newReview.content}
          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
          rows={5}
          className="w-full border px-3 py-2 rounded mb-4 text-black"
          placeholder="Share your thoughts..."
        />

        <div className="flex space-x-3">
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Review'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              isSubmitting 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
