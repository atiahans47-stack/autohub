'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, CreditCard, Car, CheckCircle, Mail } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'Search Vehicles',
    description: 'Browse our extensive collection of cars available for rent or purchase',
  },
  {
    id: 2,
    icon: Car,
    title: 'Choose a Vehicle',
    description: 'Select the perfect car that meets your needs and preferences',
  },
  {
    id: 3,
    icon: CheckCircle,
    title: 'Book or Buy',
    description: 'Reserve your rental or complete your purchase with our easy booking system',
  },
  {
    id: 4,
    icon: CreditCard,
    title: 'Make Payment',
    description: 'Secure payment processing with multiple payment options available',
  },
  {
    id: 5,
    icon: Mail,
    title: 'Receive Confirmation',
    description: 'Get instant confirmation and all details via email',
  },
];

export default function HowItWorks() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/rent-cars');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your perfect ride in just 5 simple steps
          </p>
        </motion.div>

        {/* Desktop View - Horizontal Steps */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gray-300"></div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute top-12 left-0 h-1 bg-blue-600"
            ></motion.div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center max-w-xs"
                  >
                    {/* Step Circle */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Icon className="h-10 w-10" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                        {step.id}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile View - Vertical Steps */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                {/* Step Circle */}
                <div className="shrink-0 relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {step.id}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile (except last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 mt-16">
                    <div className="w-0.5 h-8 bg-gray-300"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button onClick={handleGetStarted} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold">
            Get Started Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
