/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, Maximize2, X } from 'lucide-react';
import { GalleryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'interior' | 'chef'>('all');
  const [zoomImage, setZoomImage] = useState<GalleryItem | null>(null);

  const filteredGallery = gallery.filter((item) => {
    return activeFilter === 'all' || item.category === activeFilter;
  });

  const filterTabs = [
    { id: 'all', label: 'All Photos' },
    { id: 'food', label: 'Delicious Dishes' },
    { id: 'interior', label: 'Luxe Dining Space' },
    { id: 'chef', label: 'Traditional Chefs' },
  ];

  return (
    <section id="gallery" className="py-24 bg-[#FAF8F4] border-y border-[#F5F1EA] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.25em] font-mono block mb-2">
              📸 Visual Symphony
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
              Restaurant Gallery
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Take a virtual culinary tour of our premium interior ambiance, hand-crafted platters, and expert chefs.
            </p>
          </div>

          {/* Filters inline */}
          <div className="flex flex-wrap gap-2.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  activeFilter === tab.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-[#F5F1EA] hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGallery.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setZoomImage(item)}
                className="group relative h-72 rounded-3xl border border-[#F5F1EA] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100 text-white text-center p-4">
                    <Maximize2 size={24} className="mx-auto mb-2 text-[#C8102E]" />
                    <h4 className="font-bold text-sm tracking-tight">{item.title}</h4>
                    <span className="text-[10px] text-gray-200 uppercase font-bold tracking-widest block mt-1 font-mono">
                      {item.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dynamic click-to-zoom modal */}
        <AnimatePresence>
          {zoomImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setZoomImage(null)}
            >
              <button
                onClick={() => setZoomImage(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X size={24} />
              </button>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl bg-[#FAF8F4]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={zoomImage.imageUrl}
                  alt={zoomImage.title}
                  className="w-full max-h-[75vh] object-contain object-center mx-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6 bg-white border-t border-[#F5F1EA] flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-950 leading-tight">
                      {zoomImage.title}
                    </h3>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest font-mono mt-1 block">
                      Category: {zoomImage.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
