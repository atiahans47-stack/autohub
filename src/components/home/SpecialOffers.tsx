'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, TrendingUp, Gift } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'Weekend Special',
    description: 'Get 25% off on all weekend rentals',
    discount: '25%',
    validUntil: '2024-12-31',
    icon: TrendingUp,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 2,
    title: 'Luxury Car Deals',
    description: 'Premium vehicles at affordable prices',
    discount: '30%',
    validUntil: '2024-12-25',
    icon: Gift,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 3,
    title: 'Seasonal Promotion',
    description: 'Summer special with free insurance',
    discount: '20%',
    validUntil: '2024-08-31',
    icon: Tag,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
];

export default function SpecialOffers() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2024-12-31T23:59:59').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
            Special Offers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don&apos;t miss out on these amazing deals and promotions
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Limited Time Offer!</h3>
            <p className="text-blue-100">Hurry up! These deals won&apos;t last forever</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold bg-white/20 rounded-lg p-3 mb-2">
                {timeLeft.days}
              </div>
              <div className="text-sm text-blue-100">Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-white/20 rounded-lg p-3 mb-2">
                {timeLeft.hours}
              </div>
              <div className="text-sm text-blue-100">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-white/20 rounded-lg p-3 mb-2">
                {timeLeft.minutes}
              </div>
              <div className="text-sm text-blue-100">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-white/20 rounded-lg p-3 mb-2">
                {timeLeft.seconds}
              </div>
              <div className="text-sm text-blue-100">Seconds</div>
            </div>
          </div>
        </motion.div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${offer.bgColor} border-2 ${offer.borderColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${offer.color} rounded-full flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`text-2xl font-bold ${offer.color.replace('bg-', 'text-')}`}>
                    {offer.discount} OFF
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {offer.description}
                </p>

                {/* Valid Until */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  Valid until {new Date(offer.validUntil).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </div>

                {/* CTA Button */}
                <button className={`w-full px-4 py-2 ${offer.color} text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium`}>
                  Claim Offer
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* View All Offers Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold">
            View All Offers
          </button>
        </motion.div>
      </div>
    </section>
  );
}
