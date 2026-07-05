"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, Phone, Mail, MapPin, Send, MessageCircle, Share2 } from "lucide-react";

interface FooterContent {
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
  };
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  quickLinks: Array<{ label: string; href: string }>;
  legalLinks: Array<{ label: string; href: string }>;
  copyright: string;
  businessHours: string;
}

const defaultFooterContent: FooterContent = {
  socialMedia: {
    facebook: "#facebook",
    twitter: "#twitter",
    instagram: "#instagram",
    linkedin: "#linkedin",
    youtube: "#youtube",
    whatsapp: "",
  },
  companyInfo: {
    name: "AUTOHub",
    address: "Buea",
    phone: "659347704",
    email: "autohubcarrentals@gmail.com",
  },
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Rent Cars", href: "/rent-cars" },
    { label: "Buy Cars", href: "/buy-cars" },
    { label: "Contact", href: "/contact" },
  ],
  legalLinks: [
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
  copyright: "© 2024 AUTOHub. All rights reserved.",
  businessHours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [footerContent, setFooterContent] = useState<FooterContent>(defaultFooterContent);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const loadFooterContent = async () => {
      try {
        const response = await fetch('/api/content/footer');
        const data = await response.json();
        
        if (data.content) {
          setFooterContent(data.content);
        }
      } catch (error) {
        console.error('Error loading footer content:', error);
        // Keep using default content on error
      } finally {
        setLoading(false);
      }
    };

    loadFooterContent();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
    setSubscribed(true);
  };

  const socialIcons = [
    { icon: MessageCircle, key: 'facebook', label: 'Facebook' },
    { icon: MessageCircle, key: 'twitter', label: 'Twitter' },
    { icon: MessageCircle, key: 'instagram', label: 'Instagram' },
    { icon: MessageCircle, key: 'linkedin', label: 'LinkedIn' },
    { icon: MessageCircle, key: 'youtube', label: 'YouTube' },
    { icon: MessageCircle, key: 'whatsapp', label: 'WhatsApp' },
  ];

  const contactInfo = [
    { icon: Phone, text: footerContent?.companyInfo?.phone, href: `tel:${footerContent?.companyInfo?.phone}` },
    { icon: Mail, text: footerContent?.companyInfo?.email, href: `mailto:${footerContent?.companyInfo?.email}` },
    { icon: MapPin, text: footerContent?.companyInfo?.address, href: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <span className="text-2xl font-bold">{footerContent?.companyInfo?.name || 'AUTOHub'}</span>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner for car rentals and sales. We provide
                quality vehicles, excellent service, and competitive prices to
                make your journey memorable.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-blue-400 shrink-0" />
                      {item.href.startsWith("tel:") ||
                      item.href.startsWith("mailto:") ? (
                        <a
                          href={item.href}
                          className="text-gray-300 hover:text-white transition-colors duration-200"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span className="text-gray-300">{item.text}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Business Hours */}
              {footerContent?.businessHours && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">
                    <span className="font-medium text-gray-300">Business Hours:</span> {footerContent.businessHours}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/rent-cars" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Car Rentals
                </a>
              </li>
              <li>
                <a href="/buy-cars" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Car Sales
                </a>
              </li>
              <li>
                <a href="/rent-cars" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Long-term Rentals
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Corporate Services
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/support" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-300 hover:text-white transition-colors duration-200">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="max-w-2xl">
            {subscribed ? (
              <div className="bg-green-600 text-white px-6 py-4 rounded-lg">
                <p className="font-semibold">Thank you for subscribing!</p>
                <p className="text-sm mt-1">You'll receive our latest updates soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-gray-300 mb-6">
                  Get the latest updates on new vehicles, special offers, and
                  exclusive deals.
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Subscribe</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                {socialIcons.map((social) => {
                  const Icon = social.icon;
                  const url = footerContent?.socialMedia?.[social.key as keyof typeof footerContent.socialMedia];
                  if (!url) return null;
                  
                  return (
                    <a
                      key={social.key}
                      href={url}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="text-gray-400 text-sm">
              {footerContent?.copyright || `© 2024 ${footerContent?.companyInfo?.name || 'AUTOHub'}. All rights reserved.`}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <div>Licensed and insured vehicle rental service</div>
            <div className="mt-2 sm:mt-0">
              {(footerContent?.legalLinks || defaultFooterContent.legalLinks).length > 0 ? (
                (footerContent?.legalLinks || defaultFooterContent.legalLinks).map((link, index) => (
                  <span key={index}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                    {index < (footerContent?.legalLinks || defaultFooterContent.legalLinks).length - 1 && <span className="mx-2">•</span>}
                  </span>
                ))
              ) : (
                <>
                  <a
                    href="/terms-of-service"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                  <span className="mx-2">•</span>
                  <a
                    href="/privacy-policy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
