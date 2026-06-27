'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function HeroSection() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetch('/api/content/hero');
        const data = await response.json();
        
        if (data.content?.slides) {
          setSlides(data.content.slides);
        } else {
          // Fallback to default slides
          setSlides([
            {
              image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1920&q=80',
              title: 'Find Your Perfect Ride',
              subtitle: 'Rent or buy vehicles easily with secure booking and affordable prices.',
              ctaText: 'Rent a Car',
              ctaLink: '/rent-cars',
            },
            {
              image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
              title: 'Premium Fleet',
              subtitle: 'Luxury at affordable prices',
              ctaText: 'View Fleet',
              ctaLink: '/buy-cars',
            },
          ]);
        }
      } catch (error) {
        console.error('Error loading hero slides:', error);
        // Fallback to default slides
        setSlides([
          {
            image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1920&q=80',
            title: 'Find Your Perfect Ride',
            subtitle: 'Rent or buy vehicles easily with secure booking and affordable prices.',
            ctaText: 'Rent a Car',
            ctaLink: '/rent-cars',
          },
        ]);
      }
    };

    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleCTAClick = (link: string) => {
    router.push(link);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (slides.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    );
  }

  return (
    <section 
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto"
          >
            {slides[currentSlide].subtitle}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={() => handleCTAClick(slides[currentSlide].ctaLink)}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl"
          >
            {slides[currentSlide].ctaText}
          </motion.button>
        </motion.div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <div className="hidden md:flex absolute inset-y-0 left-0 items-center">
        <button
          onClick={prevSlide}
          className="ml-4 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="hidden md:flex absolute inset-y-0 right-0 items-center">
        <button
          onClick={nextSlide}
          className="mr-4 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
