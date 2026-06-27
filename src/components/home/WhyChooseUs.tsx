'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, HeadphonesIcon, DollarSign } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: Shield,
    title: 'Secure Payments',
    description: 'Safe transactions with encrypted payment processing and fraud protection.',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    icon: CheckCircle,
    title: 'Verified Vehicles',
    description: 'All cars are inspected and certified for quality and safety standards.',
    color: 'bg-green-500',
  },
  {
    id: 3,
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Customer assistance anytime you need help with bookings or vehicle issues.',
    color: 'bg-purple-500',
  },
  {
    id: 4,
    icon: DollarSign,
    title: 'Affordable Prices',
    description: 'Competitive pricing with no hidden fees and transparent cost breakdown.',
    color: 'bg-orange-500',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose AUTOHub
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the best car rental and sales service with our commitment to excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gray-50 rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5+ Years</div>
              <div className="text-gray-600">Industry Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
