'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Calendar, MapPin, Clock, CreditCard, Shield, CheckCircle, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TextInput } from "@/components/ui/FormFields";
import { useAuth } from '@/contexts/AuthContext';

interface BookingModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: BookingData) => void;
}

interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  location: string;
  deposit: number;
}

interface BookingData {
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalPrice: number;
  insurance: boolean;
}

type BookingStep = 'dates' | 'details' | 'payment' | 'confirmation';

export default function BookingModal({ car, isOpen, onClose, onConfirm }: BookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [currentStep, setCurrentStep] = useState<BookingStep>('dates');
  const [bookingData, setBookingData] = useState<BookingData>({
    carId: car.id,
    pickupDate: '',
    returnDate: '',
    pickupLocation: car.location,
    totalPrice: 0,
    insurance: false,
  });

  const [bookingReference, setBookingReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (currentStep === 'confirmation' && !bookingReference) {
      setTimeout(() => {
        const ref = `AUTO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setBookingReference(ref);
      }, 0);
    }
  }, [currentStep, bookingReference]);

  const calculateTotalPrice = () => {
    if (bookingData.pickupDate && bookingData.returnDate) {
      const pickup = new Date(bookingData.pickupDate);
      const returnDate = new Date(bookingData.returnDate);
      const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
      const basePrice = days * car.price;
      const insuranceCost = bookingData.insurance ? 15 * days : 0;
      return basePrice + insuranceCost + car.deposit;
    }
    return 0;
  };

  const handleDateChange = (field: 'pickupDate' | 'returnDate', value: string) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const handleNext = async () => {
    if (currentStep === 'dates' && bookingData.pickupDate && bookingData.returnDate) {
      setBookingData({ ...bookingData, totalPrice: calculateTotalPrice() });
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (!isAuthenticated || !user) {
        // Store current state and redirect to login
        localStorage.setItem('rentCarRedirect', JSON.stringify({
          carId: car.id,
          step: 'payment',
          bookingData
        }));
        router.push('/auth/login?redirect=/rent-cars/' + car.id);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const bookingPayload = {
          customer_id: user.id,
          car_id: car.id,
          customer_name: user.full_name || user.email?.split('@')[0] || 'Guest',
          customer_email: user.email,
          customer_phone: user.phone || '',
          car_name: car.name,
          start_date: bookingData.pickupDate,
          end_date: bookingData.returnDate,
          location: bookingData.pickupLocation,
          amount: bookingData.totalPrice || calculateTotalPrice(),
          status: 'Pending',
          payment_status: 'Pending',
        };

        const { data: booking, error: bookingError } = await (supabase as any)
          .from('bookings')
          .insert({
            ...bookingPayload,
            customer_id: user.id || null, // Store as plain text, not a foreign key
          })
          .select()
          .single();

        if (bookingError) throw bookingError;

        // Initiate Fapshi payment
        const paymentResponse = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: bookingData.totalPrice,
            email: user.email,
            redirectUrl: `${window.location.origin}/rent-cars/${car.id}?booking=${booking.id}&success=true`,
            userId: user.id,
            externalId: `booking-${booking.id}`,
            message: `Payment for car rental: ${car.name}`,
          }),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(paymentData.error || 'Payment initiation failed');
        }

        setPaymentLink(paymentData.paymentLink);
        setTransactionId(paymentData.transactionId);

        // Redirect to Fapshi payment page
        window.location.href = paymentData.paymentLink;
      } catch (error) {
        console.error('Payment initiation error:', error);
        alert('Failed to initiate payment. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('dates');
    } else if (currentStep === 'payment') {
      setCurrentStep('details');
    }
  };

  if (!isOpen) return null;

  const steps = [
    { id: 'dates', title: 'Select Dates' },
    { id: 'details', title: 'Review Details' },
    { id: 'payment', title: 'Payment' },
    { id: 'confirmation', title: 'Confirmation' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Book {car.name}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                        index <= currentStepIndex
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index < currentStepIndex ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                {steps.map((step, index) => (
                  <span key={step.id} className={index <= currentStepIndex ? 'text-blue-600 font-semibold' : ''}>
                    {step.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step Content */}
              <AnimatePresence mode="wait">
                {currentStep === 'dates' && (
                  <motion.div
                    key="dates"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Select Rental Dates</h3>
                    
                    {/* Pickup Date */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={bookingData.pickupDate}
                          onChange={(e) => handleDateChange('pickupDate', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    {/* Return Date */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={bookingData.returnDate}
                          onChange={(e) => handleDateChange('returnDate', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                          min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    {/* Pickup Location */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <TextInput
                          value={bookingData.pickupLocation}
                          onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })}
                          placeholder="Enter pickup location"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Insurance Option */}
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingData.insurance}
                          onChange={(e) => setBookingData({ ...bookingData, insurance: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">Add Insurance (+10000XAF/day)</div>
                          <div className="text-sm text-gray-600">Full coverage for peace of mind</div>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Review Booking Details</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Vehicle</div>
                        <div className="font-semibold text-gray-900">{car.name}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Pickup Date</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(bookingData.pickupDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Return Date</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(bookingData.returnDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Pickup Location</div>
                        <div className="font-semibold text-gray-900">{bookingData.pickupLocation}</div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Daily Rate</span>
                          <span className="font-semibold text-gray-900">{car.price.toLocaleString()}XAF/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rental Days</span>
                          <span className="font-semibold text-gray-900">{Math.ceil((new Date(bookingData.returnDate).getTime() - new Date(bookingData.pickupDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold text-gray-900">{(car.price * Math.ceil((new Date(bookingData.returnDate).getTime() - new Date(bookingData.pickupDate).getTime()) / (1000 * 60 * 60 * 24))).toLocaleString()}XAF</span>
                        </div>
                        {bookingData.insurance && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Insurance</span>
                            <span className="font-semibold text-gray-900">
                              {(10000 * Math.ceil((new Date(bookingData.returnDate).getTime() - new Date(bookingData.pickupDate).getTime()) / (1000 * 60 * 60 * 24))).toLocaleString()}XAF
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deposit</span>
                          <span className="font-semibold text-gray-900">{car.deposit.toLocaleString()}XAF</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 mt-2">
                          <div className="flex justify-between text-lg">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-bold text-blue-600">{calculateTotalPrice().toLocaleString()}XAF</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h3>
                    
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Processing your payment...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Lock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-700">
                              <div className="font-semibold text-gray-900 mb-1">Secure Payment via Fapshi</div>
                              <div>You will be redirected to Fapshi's secure payment gateway to complete your payment. We accept MTN Mobile Money and Orange Money.</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-bold text-gray-900 mb-3">Payment Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Amount</span>
                              <span className="font-bold text-blue-600">{calculateTotalPrice().toLocaleString()}XAF</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                          <div className="text-sm text-gray-700">
                            Your payment information is secure and encrypted. Fapshi uses industry-standard security measures to protect your transactions.
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 'confirmation' && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                      <p className="text-gray-600 mb-6">
                        Your rental has been successfully booked. You will receive a confirmation email shortly.
                      </p>
                      
                      <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                        <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
                        <div className="text-xl font-bold text-blue-600">{bookingReference}</div>
                      </div>

                      <div className="space-y-2 text-left">
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Pickup: {new Date(bookingData.pickupDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Return: {new Date(bookingData.returnDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Location: {bookingData.pickupLocation}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                {currentStep !== 'dates' && currentStep !== 'confirmation' && (
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                )}
                {currentStep !== 'confirmation' && (
                  <button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 'dates' && (!bookingData.pickupDate || !bookingData.returnDate)) ||
                      isLoading
                    }
                    className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <span>{currentStep === 'payment' ? 'Confirm Booking' : 'Next'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
                {currentStep === 'confirmation' && (
                  <button
                    onClick={onClose}
                    className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
