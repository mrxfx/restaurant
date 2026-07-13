/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Category } from '../types';
import { motion } from 'motion/react';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onNavigateToMenu: () => void;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  onNavigateToMenu,
}: CategoryListProps) {
  const handleCategoryClick = (slug: string) => {
    onSelectCategory(slug);
    onNavigateToMenu();
  };

  return (
    <section className="py-16 bg-[#FAF8F4] border-y border-[#F5F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Title */}
        <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.2em] font-mono block mb-2">
          🥢 Menu Categories
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 font-sans mb-3">
          Browse Our Culinary Collections
        </h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto mb-10">
          Click on any category to filter and explore our complete traditional Japanese menu.
        </p>

        {/* Categories Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* All Category Card */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick('all')}
            className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-full border text-sm font-bold transition-all cursor-pointer shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-800 border-[#F5F1EA] hover:border-gray-300'
            }`}
          >
            <span className="text-base">🍱</span>
            <span>All Offerings</span>
          </motion.button>

          {categories.map((cat, index) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-full border text-sm font-bold transition-all cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-[#C8102E] text-white border-[#C8102E]'
                    : 'bg-white text-gray-800 border-[#F5F1EA] hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
