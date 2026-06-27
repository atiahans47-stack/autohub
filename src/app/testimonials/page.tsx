'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Quote } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { TextInput, TextArea } from "@/components/ui/FormFields";

interface Testimonial {
  id: string;
  name: string;
  email: string;
  rating: number;
  testimonial: string;
  verified: boolean;
  status: string;
  created_at: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    testimonial: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        if (data.data) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
      />
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit testimonial');
      }

      setFormData({ name: '', email: '', rating: 5, testimonial: '' });
      setSubmitSuccess(true);
      
      // Refresh testimonials to include the new one (if approved)
      setTimeout(() => {
        setLoading(true);
        const refreshTestimonials = async () => {
          try {
            const response = await fetch('/api/testimonials');
            const data = await response.json();
            if (data.data) {
              setTestimonials(data.data);
            }
          } catch (error) {
            console.error('Error fetching testimonials:', error);
          } finally {
            setLoading(false);
          }
        };
        refreshTestimonials();
      }, 500);

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-4">Customer Testimonials</h1>
              <p className="text-xl text-blue-100">
                See what our satisfied customers have to say about their experience with us
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Submit Testimonial Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h2>
                
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <p className="text-green-800 font-medium">Thank you for your testimonial! It has been submitted successfully and will be reviewed.</p>
                  </motion.div>
                )}

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-800 font-medium">{submitError}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <TextInput
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center space-x-1">
                      {renderStars(formData.rating, true, (rating) =>
                        setFormData({ ...formData, rating })
                      )}
                      <span className="ml-2 text-gray-600">{formData.rating} out of 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Testimonial
                    </label>
                    <TextArea
                      required
                      rows={5}
                      value={formData.testimonial}
                      onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                      placeholder="Share your experience with our service..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Submit Testimonial</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Testimonials Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Testimonials</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading testimonials...</p>
                  </div>
                ) : testimonials.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-2xl shadow-lg p-6">
                    <p className="text-gray-600">No testimonials yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Quote className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                              <p className="text-sm text-gray-500">{formatDate(testimonial.created_at)}</p>
                            </div>
                            {testimonial.verified && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mb-3">
                            {renderStars(testimonial.rating)}
                          </div>
                          <p className="text-gray-700">{testimonial.testimonial}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
