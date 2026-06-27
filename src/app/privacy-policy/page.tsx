'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Your privacy is important to us. Learn how we collect, use, and protect your information.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <p className="text-gray-600 mb-8">
                Last updated: June 2024
              </p>

              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  AUTOHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car rental and sales services. Please read this policy carefully.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="h-6 w-6 text-blue-600" />
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Name, email address, phone number</li>
                      <li>Driver's license information</li>
                      <li>Payment information (processed securely)</li>
                      <li>Home address and location data</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Vehicle preferences and rental history</li>
                      <li>Booking details and transaction records</li>
                      <li>Feedback and reviews</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent on our site</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-blue-600" />
                  How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Processing and fulfilling your rental or purchase requests</li>
                  <li>Communicating with you about your bookings and orders</li>
                  <li>Providing customer support and assistance</li>
                  <li>Improving our services and user experience</li>
                  <li>Sending promotional offers (with your consent)</li>
                  <li>Complying with legal obligations</li>
                  <li>Preventing fraud and ensuring security</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-blue-600" />
                  Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing through trusted providers</li>
                  <li>Regular security audits and updates</li>
                  <li>Restricted access to personal data</li>
                  <li>Secure data storage and backup systems</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>With service providers who assist us in operating our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to processing of your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> support@autohub.cm
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> +237 6XX XXX XXX
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> Buea, Cameroon
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
