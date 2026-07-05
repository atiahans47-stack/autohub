'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Calendar, TrendingUp } from 'lucide-react';

export default function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState([
    { id: 1, number: 0, suffix: '+', label: 'Cars', description: 'Premium vehicles in our fleet', icon: Car, color: 'text-blue-600' },
    { id: 2, number: 0, suffix: '+', label: 'Customers', description: 'Satisfied clients worldwide', icon: Users, color: 'text-green-600' },
    { id: 3, number: 0, suffix: '+', label: 'Rentals', description: 'Successful rentals completed', icon: Calendar, color: 'text-purple-600' },
    { id: 4, number: 0, suffix: '%', label: 'Satisfaction', description: 'Customer satisfaction rate', icon: TrendingUp, color: 'text-orange-600' },
  ]);
  const [counters, setCounters] = useState(
    stats.map(() => ({ current: 0, target: 0 }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch cars count
        const carsResponse = await fetch('/api/cars');
        const carsData = await carsResponse.json();
        const carsCount = carsData.cars?.length || 0;

        // Fetch completed transactions (bookings + sales)
        const transactionsResponse = await fetch('/api/stats/completed-transactions');
        let rentalsCount = 0;
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          rentalsCount = transactionsData.count || 0;
        }

        // Fetch satisfied customers (users with completed bookings)
        const usersResponse = await fetch('/api/stats/users');
        let customersCount = 0;
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          customersCount = usersData.count || 0;
        }

        // For satisfaction, we could calculate from reviews or use a placeholder
        const satisfactionRate = 99; // Placeholder

        setStats([
          { id: 1, number: carsCount, suffix: '+', label: 'Cars', description: 'Premium vehicles in our fleet', icon: Car, color: 'text-blue-600' },
          { id: 2, number: customersCount, suffix: '+', label: 'Customers', description: 'Satisfied clients worldwide', icon: Users, color: 'text-green-600' },
          { id: 3, number: rentalsCount, suffix: '+', label: 'Rentals', description: 'Successful rentals completed', icon: Calendar, color: 'text-purple-600' },
          { id: 4, number: satisfactionRate, suffix: '%', label: 'Satisfaction', description: 'Customer satisfaction rate', icon: TrendingUp, color: 'text-orange-600' },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!isVisible || loading) return;

    const targets = stats.map(stat => stat.number);
    
    const interval = setInterval(() => {
      setCounters(prevCounters =>
        prevCounters.map((counter, index) => {
          const increment = Math.ceil(targets[index] / 50);
          const newValue = Math.min(counter.current + increment, targets[index]);
          return { ...counter, current: newValue };
        })
      );
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCounters(targets.map(target => ({ current: target, target })));
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVisible, loading, stats]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setIsVisible(true)}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Achievements
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Numbers that speak volumes about our commitment to excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const counter = counters[index];
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>

                  {/* Number */}
                  <div className="mb-2">
                    <motion.span
                      className={`text-4xl md:text-5xl font-bold ${stat.color}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      {counter.current.toLocaleString()}{stat.suffix}
                    </motion.span>
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">5★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
