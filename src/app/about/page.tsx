'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { Users, Target, Award, Shield, Heart, Globe, Car, Clock, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Trust & Safety',
      description: 'We prioritize your safety with comprehensive vehicle inspections and secure transactions.',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do. Your satisfaction is our success.',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Reach',
      description: 'Serving customers across Cameroon with plans to expand to all regions of the country.',
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: 'Quality Vehicles',
      description: 'Only the best vehicles make it to our inventory, ensuring reliability and performance.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Vehicles Available' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Trusted Sellers' },
    { number: '5+', label: 'Years Experience' },
  ];

  const milestones = [
    { year: '2019', title: 'Founded', description: 'AUTOHub was established with a vision to revolutionize car rentals and sales in Cameroon.' },
    { year: '2020', title: 'First Location', description: 'Opened our first showroom in Buea, serving the Southwest region.' },
    { year: '2022', title: 'Growth', description: 'Expanded our operations and services in Buea, serving more customers across the region.' },
    { year: '2024', title: 'Digital Platform', description: 'Launched our online platform, making car rentals and purchases accessible 24/7.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold mb-4">About Us</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Your trusted partner for car rentals and purchases in Cameroon
              </p>
            </motion.div>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2019, AUTOHub started with a simple mission: to make car rentals and purchases easy, affordable, and trustworthy for everyone in Cameroon. What began as a small fleet of rental cars has grown into a comprehensive automotive platform serving thousands of customers across the country.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We believe that everyone deserves access to quality vehicles, whether for a weekend getaway, a business trip, or purchasing their dream car. Our commitment to excellence, transparency, and customer satisfaction has made us a trusted name in the automotive industry.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we continue to innovate and expand our services, always keeping our customers&apos; needs at the forefront of everything we do.
              </p>
            </div>
            <div className="relative">
              <div className="bg-blue-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl font-bold mb-2">{stat.number}</div>
                      <div className="text-blue-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Our Values */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Mission & Vision */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide accessible, reliable, and affordable car rental and purchase solutions that empower our customers to travel with confidence and convenience. We strive to exceed expectations through exceptional service, quality vehicles, and innovative technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-green-50 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-8 w-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become the leading automotive platform in Cameroon, known for trust, innovation, and customer satisfaction. We aim to transform how people access and experience vehicles, making mobility seamless and enjoyable for everyone in Cameroon.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Our Journey */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key milestones in our growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Why Choose AUTOHub?</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Experience the difference with our commitment to excellence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Quality Assurance</h3>
                  <p className="text-blue-100 text-sm">Every vehicle undergoes rigorous inspection before being added to our inventory.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">24/7 Support</h3>
                  <p className="text-blue-100 text-sm">Our dedicated support team is available around the clock to assist you.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Customer Satisfaction</h3>
                  <p className="text-blue-100 text-sm">We prioritize your satisfaction and continuously improve based on your feedback.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
