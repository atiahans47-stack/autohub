'use client';

import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { TextArea } from "@/components/ui/FormFields";
import { useAuth } from '@/contexts/AuthContext';

interface ReviewSubmissionProps {
  carId: string;
  carName: string;
  onSuccess?: () => void;
}

export default function ReviewSubmission({ carId, carName, onSuccess }: ReviewSubmissionProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        setError('Please log in to submit a review');
        return;
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          user_name: user.full_name || user.email?.split('@')[0] || 'User',
          user_email: user.email,
          car_id: carId,
          car_name: carName,
          rating,
          comment: comment.trim(),
          status: 'Approved',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setSuccess(true);
      setRating(0);
      setComment('');
      
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${
          i < (interactive ? hoverRating : rating)
            ? 'fill-yellow-400 text-yellow-400 cursor-pointer'
            : 'text-gray-300 cursor-pointer'
        } ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
        onMouseEnter={() => interactive && setHoverRating(i + 1)}
        onMouseLeave={() => interactive && setHoverRating(rating)}
        onClick={() => interactive && setRating(i + 1)}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          Please log in to submit a review.
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Review submitted successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {renderStars(rating, true)}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <TextArea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this car..."
            disabled={isSubmitting || !user}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !user}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}
