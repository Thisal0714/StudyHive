'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface ReviewItem {
  id: string;
  title: string;
  subject: string;
  lastReviewed: string;
  nextReview: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      subject: 'Programming',
      lastReviewed: '2024-01-15',
      nextReview: '2024-01-22',
      difficulty: 'Medium',
      progress: 75
    },
    {
      id: '2',
      title: 'React Hooks',
      subject: 'Programming',
      lastReviewed: '2024-01-10',
      nextReview: '2024-01-17',
      difficulty: 'Hard',
      progress: 60
    },
    {
      id: '3',
      title: 'Database Design',
      subject: 'Computer Science',
      lastReviewed: '2024-01-12',
      nextReview: '2024-01-19',
      difficulty: 'Easy',
      progress: 90
    }
  ]);

  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const startReview = (review: ReviewItem) => {
    setSelectedReview(review);
    setIsReviewing(true);
  };

  const completeReview = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (selectedReview) {
      // Update review progress based on difficulty
      const progressIncrement = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 5 : 2;
      const newProgress = Math.min(100, selectedReview.progress + progressIncrement);
      
      setReviews(reviews.map(review => 
        review.id === selectedReview.id 
          ? { ...review, progress: newProgress, lastReviewed: new Date().toISOString().split('T')[0] }
          : review
      ));
      
      toast.success(`Review completed! Progress: ${newProgress}%`);
      setIsReviewing(false);
      setSelectedReview(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-2">Track your study progress and review materials</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-primary">{reviews.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Due Today</h3>
          <p className="text-3xl font-bold text-warning">
            {reviews.filter(r => r.nextReview === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Progress</h3>
          <p className="text-3xl font-bold text-success">
            {Math.round(reviews.reduce((acc, r) => acc + r.progress, 0) / reviews.length)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-info">
            {reviews.filter(r => r.progress === 100).length}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{review.title}</h3>
                      <p className="text-sm text-gray-500">{review.subject}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(review.difficulty)}`}>
                      {review.difficulty}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                    <span>Last reviewed: {review.lastReviewed}</span>
                    <span>Next review: {review.nextReview}</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{review.progress}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${review.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 flex space-x-2">
                  <button
                    onClick={() => startReview(review)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
                  >
                    Start Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewing && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Review: {selectedReview.title}
            </h3>
            <p className="text-gray-600 mb-6">
              How well did you remember this material?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => completeReview('Easy')}
                className="w-full p-3 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
              >
                Easy - I remembered it well
              </button>
              <button
                onClick={() => completeReview('Medium')}
                className="w-full p-3 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
              >
                Medium - I remembered some of it
              </button>
              <button
                onClick={() => completeReview('Hard')}
                className="w-full p-3 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
              >
                Hard - I need to review this again
              </button>
            </div>
            
            <button
              onClick={() => setIsReviewing(false)}
              className="mt-6 w-full p-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}