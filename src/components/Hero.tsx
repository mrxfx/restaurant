/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingBag, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1600',
    title: 'Savor Masterful Sushi Creations',
    tag: 'Tsurai Craftsmanship'
  },
  {
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=1600',
    title: 'Experience Authentic Rich Ramen',
    tag: '16-Hour Simmered Broth'
  },
  {
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=1600',
    title: 'Exquisite Pure Wagyu & Sashimi',
    tag: 'A5 Grade Imports'
  }
];

export default function Hero({ onNavigate }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section id="home" className="relative h-[90vh] md:h-[95vh] w-full bg-[#FAF8F4] overflow-hidden flex items-center">
      {/* Dynamic Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt="Delicious Japanese food"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Elegant Radial & Bottom Dark-to-Light gradient overlay to make text highly legible yet preserve food vibrancy */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left text-white mt-10">
        <div className="max-w-2xl">
          {/* Tag */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-[#C8102E] font-bold text-xs uppercase tracking-[0.25em] bg-white/95 px-3 py-1 rounded-full mb-4 shadow-sm font-mono"
          >
            {HERO_SLIDES[currentSlide].tag}
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight font-sans drop-shadow-md"
          >
            Experience Authentic <br />
            <span className="text-[#C8102E]">Japanese Flavours</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg lg:text-xl text-gray-100 mb-8 font-medium font-sans drop-shadow-sm flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1"
          >
            <span>✨ Fresh Ingredients.</span>
            <span>🥢 Traditional Craftsmanship.</span>
            <span>🏮 Modern Dining.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          >
            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-white text-gray-900 font-bold hover:bg-[#C8102E] hover:text-white transition-all transform hover:-translate-y-0.5 shadow-lg cursor-pointer"
            >
              <BookOpen size={18} />
              <span>View Menu</span>
            </button>

            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#C8102E] text-white font-bold hover:bg-[#A60D25] transition-all transform hover:-translate-y-0.5 shadow-lg cursor-pointer"
            >
              <ShoppingBag size={18} />
              <span>Order Now</span>
            </button>

            <button
              onClick={() => onNavigate('reservation')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold hover:bg-white/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar size={18} />
              <span>Reserve Table</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/20 hover:bg-black/50 text-white transition-colors cursor-pointer border border-white/10 hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/20 hover:bg-black/50 text-white transition-colors cursor-pointer border border-white/10 hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Custom Slider Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === index ? 'w-8 bg-[#C8102E]' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
