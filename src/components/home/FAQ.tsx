'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'How do I rent a car?',
    answer: 'Renting a car is simple! Browse our available vehicles, select your preferred car, choose rental dates, provide your details, and complete the payment. You will receive a confirmation email with all the details.',
  },
  {
    id: 2,
    question: 'What are the payment options?',
    answer: 'We accept various payment methods including credit/debit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system. You can also pay cash upon pickup for certain rentals.',
  },
  {
    id: 3,
    question: 'What is the cancellation policy?',
    answer: 'Free cancellation is available up to 24 hours before your rental start time. Cancellations made within 24 hours may incur a fee. For long-term rentals, please refer to our specific cancellation terms.',
  },
  {
    id: 4,
    question: 'Do I need insurance to rent a car?',
    answer: 'Basic insurance is included with all rentals. You can purchase additional coverage for extra protection. If you have your own car insurance, it may cover rental vehicles - please check with your insurance provider.',
  },
  {
    id: 5,
    question: 'What documents do I need to rent a car?',
    answer: 'You need a valid driver\'s license (held for at least 1 year), a credit card in your name, and a form of identification (passport or national ID). International visitors may need an International Driving Permit.',
  },
  {
    id: 6,
    question: 'Can I modify my rental booking?',
    answer: 'Yes, you can modify your booking up to 24 hours before the rental start time. Changes are subject to vehicle availability and may incur additional charges. You can manage your booking through your account or contact our support team.',
  },
  {
    id: 7,
    question: 'How does the car purchase process work?',
    answer: 'For car purchases, browse our available vehicles, schedule a test drive, complete the necessary paperwork, and arrange payment. We handle all the documentation including registration and transfer of ownership.',
  },
  {
    id: 8,
    question: 'Are there any mileage restrictions?',
    answer: 'Standard rentals include a daily mileage limit. Additional mileage can be purchased at a reasonable rate. Long-term rentals and luxury vehicles may have different mileage policies.',
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our car rental and sales services
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </button>
              
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openItems.includes(faq.id) ? 'auto' : 0,
                  opacity: openItems.includes(faq.id) ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 bg-blue-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to help you with any queries or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-medium">
              View Help Center
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
