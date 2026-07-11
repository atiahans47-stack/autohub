'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Lock, CheckCircle, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TextInput } from "@/components/ui/FormFields";
import { useAuth } from '@/contexts/AuthContext';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: string;
    name: string;
    image: string;
    price: number;
    location: string;
    year: number;
    mileage: number;
    condition: string;
  };
}

export default function BuyModal({ isOpen, onClose, car }: BuyModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'orange'>('mtn');
  const [isLoading, setIsLoading] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Cameroon',
  });

  // Update buyer info when user data is available
  useEffect(() => {
    if (user) {
      setBuyerInfo(prev => ({
        ...prev,
        firstName: user.full_name?.split(' ')[0] || '',
        lastName: user.full_name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handlePaymentMethodChange = (method: 'mtn' | 'orange') => {
    setPaymentMethod(method);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyerInfo({
      ...buyerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (currentStep === 'details') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (!user) {
        // Store current state and redirect to login
        localStorage.setItem('buyCarRedirect', JSON.stringify({
          carId: car.id,
          step: 'payment',
          buyerInfo
        }));
        router.push('/auth/login?redirect=/buy-cars/' + car.id);
        return;
      }
      
      setIsLoading(true);

      try {
        // Use custom auth user instead of Supabase Auth
        if (!user?.id || !user?.email) {
          throw new Error('User not authenticated');
        }

        // Get user data from profiles
        const { data: userData } = await (supabase as any)
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();

        const totalAmount = car.price + 50000; // Car price + processing fee

        const salePayload = {
          customer_id: user.id,
          car_id: car.id,
          customer_name: userData?.full_name || user.full_name || `${buyerInfo.firstName} ${buyerInfo.lastName}`,
          customer_email: user.email,
          customer_phone: userData?.phone || user.phone || buyerInfo.phone,
          car_name: car.name,
          amount: totalAmount,
          status: 'Pending',
          payment_status: 'Pending',
          payment_method: paymentMethod === 'mtn' ? 'MTN Mobile Money' : 'Orange Money',
        };

        const { data: sale, error: saleError } = await (supabase as any)
          .from('sales')
          .insert(salePayload)
          .select()
          .single();

        if (saleError) throw saleError;

        // Initiate Fapshi payment
        const paymentResponse = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            email: user.email,
            redirectUrl: `${window.location.origin}/buy-cars/${car.id}?sale=${sale.id}&success=true`,
            userId: user.id,
            externalId: `sale-${sale.id}`,
            message: `Payment for car purchase: ${car.name}`,
          }),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(paymentData.error || 'Payment initiation failed');
        }

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
    if (currentStep === 'payment') {
      setCurrentStep('details');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
  };

  const handleComplete = () => {
    onClose();
    setCurrentStep('details');
    setBuyerInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Cameroon',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentStep === 'confirmation' ? 'Purchase Confirmed!' : 'Purchase Vehicle'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Progress Steps */}
              {currentStep !== 'confirmation' && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep === 'details' ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'
                        }`}
                      >
                        {currentStep === 'details' ? '1' : <CheckCircle className="h-5 w-5" />}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Buyer Details</span>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 mx-4">
                      <div
                        className={`h-full ${currentStep === 'payment' ? 'bg-blue-600' : 'bg-gray-200'}`}
                        style={{ width: currentStep === 'payment' ? '100%' : '0%' }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {currentStep === 'payment' ? '2' : '2'}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Payment</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {currentStep === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Buyer Information</h3>
                    
                    {/* Vehicle Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                          <Image
                            src={car.image}
                            alt={car.name}
                            width={128}
                            height={96}
                            className="object-cover object-center w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{car.name}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Year: {car.year}</div>
                            <div>Mileage: {car.mileage.toLocaleString()} km</div>
                            <div>Condition: {car.condition}</div>
                            <div className="text-lg font-bold text-blue-600 mt-2">
                              {car.price.toLocaleString()}XAF
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <TextInput
                            name="firstName"
                            value={buyerInfo.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <TextInput
                            name="lastName"
                            value={buyerInfo.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={buyerInfo.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <TextInput
                            name="phone"
                            value={buyerInfo.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <TextInput
                            name="address"
                            value={buyerInfo.address}
                            onChange={handleInputChange}
                            placeholder="Enter address"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <TextInput
                            name="city"
                            value={buyerInfo.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <TextInput
                            name="country"
                            value={buyerInfo.country}
                            onChange={handleInputChange}
                          />
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
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Processing your payment...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Payment Options */}
                        <div className="space-y-3 mb-6">
                          <label
                            className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                              paymentMethod === 'mtn' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="mtn"
                              checked={paymentMethod === 'mtn'}
                              onChange={() => handlePaymentMethodChange('mtn')}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="h-6 w-6 bg-yellow-400 rounded flex items-center justify-center text-white text-xs font-bold">
                              M
                            </div>
                            <span className="font-semibold text-gray-900">MTN Mobile Money</span>
                          </label>

                          <label
                            className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                              paymentMethod === 'orange' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="orange"
                              checked={paymentMethod === 'orange'}
                              onChange={() => handlePaymentMethodChange('orange')}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="h-6 w-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                              O
                            </div>
                            <span className="font-semibold text-gray-900">Orange Money</span>
                          </label>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <h4 className="font-bold text-gray-900 mb-3">Payment Summary</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vehicle Price</span>
                              <span className="font-semibold">{car.price.toLocaleString()}XAF</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Processing Fee</span>
                              <span className="font-semibold">50000XAF</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2 mt-2">
                              <div className="flex justify-between text-lg">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-blue-600">{(car.price + 50000).toLocaleString()}XAF</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Security Notice */}
                        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                          <Lock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-gray-900">Secure Payment via Fapshi</div>
                            <div className="text-sm text-gray-600">You will be redirected to Fapshi's secure payment gateway to complete your payment.</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 'confirmation' && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Purchase Confirmed!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for your purchase. You will receive a confirmation email shortly with all the details.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="text-sm text-gray-600 mb-2">Order Reference</div>
                      <div className="text-xl font-bold text-gray-900">BUY-{car.id}-CONFIRMED</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">Next Steps</div>
                          <div className="text-sm text-gray-600">
                            Our team will contact you within 24 hours to schedule vehicle pickup and complete the paperwork.
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {currentStep !== 'confirmation' && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 'details'}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center space-x-2"
                  >
                    <span>{currentStep === 'details' ? 'Continue to Payment' : 'Complete Purchase'}</span>
                    <Lock className="h-5 w-5" />
                  </button>
                </div>
              )}

              {currentStep === 'confirmation' && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                  <button
                    onClick={handleComplete}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
