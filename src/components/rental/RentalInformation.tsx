'use client';

import { motion } from 'framer-motion';
import { Search, Calendar, CreditCard, Car, CheckCircle } from 'lucide-react';

export default function RentalInformation() {
  const steps = [
    {
      icon: Search,
      title: 'Search Cars',
      description: 'Browse our extensive fleet of vehicles and filter by location, dates, car type, and preferences to find your perfect match.',
    },
    {
      icon: Calendar,
      title: 'Choose Rental Dates',
      description: 'Select your pickup and return dates. Our flexible booking system allows you to customize your rental period.',
    },
    {
      icon: CreditCard,
      title: 'Book and Pay',
      description: 'Complete your booking securely with our payment system. Choose from various payment options and receive instant confirmation.',
    },
    {
      icon: Car,
      title: 'Pick Up the Vehicle',
      description: 'Visit your selected pickup location, present your booking confirmation and ID, and drive away in your rental car.',
    },
  ];

  const benefits = [
    '24/7 Customer Support',
    'Free Cancellation up to 24 hours',
    'No Hidden Fees',
    'Comprehensive Insurance Options',
    'Well-Maintained Vehicles',
    'Flexible Pickup and Return',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Renting a car has never been easier. Follow these simple steps to get on the road in no time.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <step.icon className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
            <div className="mt-4 text-3xl font-bold text-blue-200">{index + 1}</div>
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Why Choose AUTOHub?</h3>
            <p className="text-blue-100 mb-6">
              We&apos;re committed to providing you with the best car rental experience. Our platform offers
              convenience, reliability, and exceptional customer service.
            </p>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100 mb-6">Happy Customers</div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100 mb-6">Vehicles Available</div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="font-semibold text-gray-900 mb-2">What documents do I need to rent a car?</h4>
            <p className="text-gray-600 text-sm">
              You&apos;ll need a valid driver&apos;s license, a credit card in your name, and a government-issued ID or passport.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="font-semibold text-gray-900 mb-2">Is there a minimum age requirement?</h4>
            <p className="text-gray-600 text-sm">
              Yes, you must be at least 21 years old to rent a car. Drivers under 25 may be subject to additional fees.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="font-semibold text-gray-900 mb-2">Can I cancel my booking?</h4>
            <p className="text-gray-600 text-sm">
              Yes, you can cancel your booking free of charge up to 24 hours before your pickup time.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="font-semibold text-gray-900 mb-2">What is the fuel policy?</h4>
            <p className="text-gray-600 text-sm">
              Most of our rentals operate on a &quot;full-to-full&quot; policy. You&apos;ll receive the car with a full tank and should return it full.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
