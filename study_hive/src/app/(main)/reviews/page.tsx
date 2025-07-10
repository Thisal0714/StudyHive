'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Loading from '@/app/components/common/loading';

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
  const [reviews, setReviews] = useState<UserReview[]>([
    {
      id: '1',
      userName: 'Sarah Johnson',
      userRole: 'Computer Science Student',
      rating: 5,
      title: 'Amazing Study Platform!',
      content: 'StudyHive has completely transformed how I study. The AI-powered note organization and spaced repetition system have helped me retain information much better. The interface is intuitive and the features are exactly what I needed.',
      date: '2024-01-15',
      helpful: 24
    },
    {
      id: '2',
      userName: 'Michael Chen',
      userRole: 'Medical Student',
      rating: 5,
      title: 'Perfect for Medical School',
      content: 'As a medical student, I need to memorize vast amounts of information. StudyHive\'s review system and progress tracking have been invaluable. The platform adapts to my learning pace and helps me focus on areas I need to improve.',
      date: '2024-01-12',
      helpful: 18
    },
    {
      id: '3',
      userName: 'Emily Rodriguez',
      userRole: 'Law Student',
      rating: 4,
      title: 'Great for Case Studies',
      content: 'The note-taking features are excellent for organizing case studies and legal concepts. I love how I can tag and categorize my notes. The review reminders keep me on track with my studies.',
      date: '2024-01-10',
      helpful: 15
    },
    {
      id: '4',
      userName: 'David Kim',
      userRole: 'Engineering Student',
      rating: 5,
      title: 'Best Study Tool I\'ve Used',
      content: 'The combination of note-taking and spaced repetition is brilliant. I\'ve seen a significant improvement in my grades since using StudyHive. The dashboard gives me great insights into my study patterns.',
      date: '2024-01-08',
      helpful: 31
    },
    {
      id: '5',
      userName: 'Lisa Thompson',
      userRole: 'Psychology Student',
      rating: 4,
      title: 'Intuitive and Effective',
      content: 'StudyHive makes studying feel less overwhelming. The progress tracking motivates me to keep going, and the review system ensures I don\'t forget important concepts. Highly recommend!',
      date: '2024-01-05',
      helpful: 12
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    rating: 5
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return <Loading />;
  }

  const handleSubmitReview = () => {
    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const review: UserReview = {
      id: Date.now().toString(),
      userName: 'Current User',
      userRole: 'Student',
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({ title: '', content: '', rating: 5 });
    setShowReviewForm(false);
    toast.success('Thank you for your review!');
  };

  const markHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const renderStars = (rating: number) => {
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
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="w-full px-10 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Reviews</h1>
        <p className="text-gray-600 mt-2">See what students are saying about StudyHive</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-primary">{reviews.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Rating</h3>
          <div className="flex items-center">
            <div className="flex mr-2">{renderStars(Math.round(averageRating))}</div>
            <p className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">5-Star Reviews</h3>
          <p className="text-3xl font-bold text-success">
            {reviews.filter(r => r.rating === 5).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-info">
            {reviews.filter(r => {
              const reviewDate = new Date(r.date);
              const now = new Date();
              return reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Add Review Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowReviewForm(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{review.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-900">{review.userName}</span>
                  <span>{review.userRole}</span>
                  <span>{review.date}</span>
                </div>
              </div>
              <div className="flex">{renderStars(review.rating)}</div>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => markHelpful(review.id)}
                className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Write a Review</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Brief summary of your experience"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Share your experience with StudyHive..."
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button
                onClick={handleSubmitReview}
                className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary-hover transition-colors"
              >
                Submit Review
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}