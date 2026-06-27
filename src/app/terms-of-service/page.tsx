'use client';

import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, Scale } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function TermsOfServicePage() {
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
              <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Please read these terms carefully before using our services.
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
                  <FileText className="h-6 w-6 text-blue-600" />
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to AUTOHub. By using our car rental and sales services, you agree to comply with and be bound by the following Terms of Service ("Terms"). Please read these Terms carefully before using our services.
                </p>
              </section>

              {/* Acceptance of Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
                </p>
              </section>

              {/* Services */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Services</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  AUTOHub provides the following services:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Car rental services for short-term and long-term use</li>
                  <li>Car sales and purchase services</li>
                  <li>Vehicle maintenance and support</li>
                  <li>Customer support and assistance</li>
                </ul>
              </section>

              {/* User Responsibilities */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                  User Responsibilities
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As a user of our services, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Provide accurate and complete information when booking or purchasing</li>
                  <li>Possess a valid driver's license for rental services</li>
                  <li>Return vehicles in the same condition as received</li>
                  <li>Comply with all traffic laws and regulations</li>
                  <li>Not use vehicles for illegal activities</li>
                  <li>Pay all applicable fees and charges on time</li>
                  <li>Maintain the vehicle and report any damages immediately</li>
                </ul>
              </section>

              {/* Rental Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Rental Terms</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking and Payment</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Bookings must be made in advance and are subject to availability</li>
                      <li>Payment is required at the time of booking</li>
                      <li>A security deposit may be required</li>
                      <li>Cancellation fees may apply based on timing</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Use</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Vehicles must be returned by the specified time</li>
                      <li>Late returns may incur additional charges</li>
                      <li>Mileage limits may apply</li>
                      <li>Fuel policy must be followed (typically full-to-full)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Insurance</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Basic insurance is included in rental rates</li>
                      <li>Additional coverage options are available</li>
                      <li>Deductibles may apply to certain claims</li>
                      <li>Personal insurance may provide additional coverage</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Sales Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sales Terms</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All vehicle sales are final unless otherwise specified</li>
                  <li>Vehicles are sold "as-is" unless a warranty is provided</li>
                  <li>Buyers are responsible for registration and transfer fees</li>
                  <li>Payment must be completed before vehicle delivery</li>
                  <li>Inspection and test drives are available by appointment</li>
                </ul>
              </section>

              {/* Liability */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Scale className="h-6 w-6 text-blue-600" />
                  Liability and Disclaimer
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  AUTOHub shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. We are not responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Personal injuries or property damage during vehicle use</li>
                  <li>Traffic violations or fines incurred by users</li>
                  <li>Loss of personal belongings left in vehicles</li>
                  <li>Vehicle breakdowns or mechanical failures</li>
                  <li>Acts of nature or force majeure events</li>
                </ul>
              </section>

              {/* Termination */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  AUTOHub reserves the right to terminate or suspend your access to our services at any time, with or without cause, with or without notice.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of Cameroon. Any disputes arising under these Terms shall be resolved in the courts of Cameroon.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  AUTOHub reserves the right to modify these Terms at any time. Continued use of our services after any changes constitutes acceptance of the modified Terms.
                </p>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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
