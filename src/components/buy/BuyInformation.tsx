'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Shield, Clock, FileText, CreditCard, Car, Users, HeadphonesIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BuyInformation() {
  const router = useRouter();
  const steps = [
    {
      icon: <Car className="h-6 w-6" />,
      title: 'Browse & Select',
      description: 'Explore our wide selection of vehicles and find your perfect match using our advanced search and filter options.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Review Details',
      description: 'View comprehensive vehicle information, including specifications, mileage, condition reports, and high-quality images.',
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Secure Payment',
      description: 'Complete your purchase securely using multiple payment options including card, PayPal, or cryptocurrency.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Documentation',
      description: 'We handle all paperwork including title transfer, registration, and insurance documentation.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Delivery or Pickup',
      description: 'Choose between convenient delivery to your location or pickup at our showroom.',
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Enjoy Your Vehicle',
      description: 'Drive away with confidence knowing your vehicle comes with warranty and after-sales support.',
    },
  ];

  const benefits = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Quality Assurance',
      description: 'Every vehicle undergoes a comprehensive inspection before sale.',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Fast Processing',
      description: 'Complete your purchase in as little as 24 hours.',
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Expert Support',
      description: 'Our team of automotive experts is here to help you.',
    },
    {
      icon: <HeadphonesIcon className="h-5 w-5" />,
      title: '24/7 Assistance',
      description: 'Get support whenever you need it, day or night.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">How to Buy a Vehicle</h2>
        <p className="text-gray-600 mb-8">Simple, secure, and straightforward process to get you behind the wheel.</p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <h4 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h4>
          <p className="text-gray-600 mb-4">
            Our team is available to assist you with any questions about the buying process, vehicle specifications, or payment options.
          </p>
          <button
            onClick={() => router.push('/support')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
}
