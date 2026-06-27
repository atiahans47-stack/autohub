'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Trash2, Check, X, Filter } from 'lucide-react';
import { SelectInput } from "@/components/ui/FormFields";

interface Review {
  id: string;
  user_name: string;
  user_email: string;
  car_name: string;
  rating: number;
  comment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const hasLoadedData = useRef(false);

  const loadReviews = useCallback(async () => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      const response = await fetch(`/api/reviews?admin=true&status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${adminSession}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!hasLoadedData.current) {
      const adminSession = localStorage.getItem('adminSession');
      if (!adminSession) {
        window.location.href = '/admin/login';
        return;
      }
      setTimeout(() => {
        loadReviews();
        hasLoadedData.current = true;
      }, 0);
    }
  }, [loadReviews]);

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review status');
      }

      await loadReviews();
    } catch (err) {
      setError('Failed to update review status');
      console.error(err);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const adminSession = localStorage.getItem('adminSession');
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminSession}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      await loadReviews();
    } catch (err) {
      setError('Failed to delete review');
      console.error(err);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
        <p className="text-gray-600 mt-2">Manage and moderate customer reviews</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <SelectInput
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                hasLoadedData.current = false;
              }}
              options={[
                { label: "All Reviews", value: "all" },
                { label: "Pending", value: "Pending" },
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" }
              ]}
            />
          </div>
          <div className="text-sm text-gray-500">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No reviews found
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{review.user_name}</h3>
                      <span className="text-sm text-gray-500">{review.user_email}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">for {review.car_name}</span>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {review.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(review.id, 'Approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, 'Rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
