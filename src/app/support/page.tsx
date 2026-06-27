'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { Phone, Mail, MessageCircle, Clock, CheckCircle, ChevronDown, ChevronUp, FileText, CreditCard, Car, User, MapPin, Send, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TextInput, SelectInput, TextArea } from "@/components/ui/FormFields";

export default function SupportPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  const faqs = [
    {
      question: 'How do I rent a car?',
      answer: 'To rent a car, browse our available vehicles on the Rent Cars page, select your preferred vehicle, choose your pickup and return dates, and complete the booking process. You can also contact our support team for assistance.',
    },
    {
      question: 'What documents do I need to rent a car?',
      answer: 'You will need a valid driver\'s license, national ID or passport, and a credit card for the security deposit. International customers may need additional documentation.',
    },
    {
      question: 'Can I purchase a car through AUTOHub?',
      answer: 'Yes! We offer both rental and purchase options. Visit our Buy Cars page to browse available vehicles for purchase. We handle all documentation and provide warranty on purchased vehicles.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, PayPal, and cryptocurrency for both rentals and purchases. All transactions are secure and encrypted.',
    },
    {
      question: 'Is insurance included in the rental price?',
      answer: 'Basic insurance is included in all rentals. You can add comprehensive coverage during the booking process for additional protection.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellations made 48 hours before pickup are fully refundable. Cancellations made 24-48 hours before pickup incur a 50% fee. Cancellations less than 24 hours before pickup are non-refundable.',
    },
    {
      question: 'Can I extend my rental period?',
      answer: 'Yes, you can extend your rental period subject to vehicle availability. Contact our support team at least 24 hours before your scheduled return to request an extension.',
    },
    {
      question: 'What happens if I return the car late?',
      answer: 'Late returns may incur additional charges. Please contact us if you anticipate being late so we can make arrangements and minimize any fees.',
    },
  ];

  const supportOptions = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone Support',
      description: 'Call us directly for immediate assistance',
      contact: '+237 659347704',
      available: '24/7',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'autohubcarrentals@gmail.com',
      available: '24/7',
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available on website',
      available: 'Mon-Fri 8am-8pm',
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    setIsSubmitting(true);

    // TODO: Connect to backend API
    // API Endpoint: POST /api/contact
    // Request body: { name, email, phone, subject, message }
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

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
              <h1 className="text-5xl font-bold mb-4">Support Center</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                We&apos;re here to help you with any questions or concerns
              </p>
            </motion.div>
          </div>
        </div>

        {/* Support Options */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose your preferred way to reach us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {option.available}
                </div>
                <div className="text-blue-600 font-semibold">{option.contact}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {[
              { icon: <FileText className="h-5 w-5" />, label: 'Booking Help' },
              { icon: <CreditCard className="h-5 w-5" />, label: 'Payment Issues' },
              { icon: <Car className="h-5 w-5" />, label: 'Vehicle Info' },
              { icon: <User className="h-5 w-5" />, label: 'Account Support' },
            ].map((item, index) => (
              <button
                key={index}
                className="flex items-center space-x-2 p-4 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-300"
              >
                <span className="text-blue-600">{item.icon}</span>
                <span className="text-gray-700 font-medium">{item.label}</span>
              </button>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {activeFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Send Us a Message</h2>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for reaching out. We&apos;ve received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : !isAuthenticated ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h3>
                  <p className="text-gray-600 mb-8">
                    You must be signed in to send us a message. Please sign in or create an account to continue.
                  </p>
                  <button
                    onClick={() => router.push('/auth/login?returnTo=%2Fsupport')}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                  >
                    Sign In to Continue
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <TextInput
                        name="name"
                        required
                        value={contactForm.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={contactForm.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <TextInput
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleInputChange}
                        placeholder="+237 6XX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <SelectInput
                        name="subject"
                        required
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        placeholder="Select a topic"
                        options={[
                          { label: "Car Rental Inquiry", value: "rental" },
                          { label: "Car Purchase Inquiry", value: "purchase" },
                          { label: "Technical Support", value: "support" },
                          { label: "Billing & Payments", value: "billing" },
                          { label: "Other", value: "other" }
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <TextArea
                      name="message"
                      required
                      rows={6}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Office Locations */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Offices</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Visit us at any of our locations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  city: 'Buea',
                  address: 'Cameroon',
                  phone: 'Cameroon',
                  hours: 'Mon-Sat 8am-6pm',
                },
              ].map((office, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">{office.city}</h3>
                  </div>
                  <p className="text-gray-600 mb-2">{office.address}</p>
                  <p className="text-gray-600 mb-2">{office.phone}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{office.hours}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Response Time Promise */}
        <div className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <CheckCircle className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Our Response Promise</h3>
                  <p className="text-blue-100">We respond to all inquiries within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">Email</div>
                  <div className="text-blue-100 text-sm">Within 24 hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Phone</div>
                  <div className="text-blue-100 text-sm">Immediate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Chat</div>
                  <div className="text-blue-100 text-sm">Within 5 minutes</div>
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
