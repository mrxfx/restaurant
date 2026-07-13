/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Search, ShoppingBag, Star, Heart, SlidersHorizontal, EyeOff } from 'lucide-react';
import { FoodItem, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { SkeletonMenu } from './SkeletonLoader';
import { seedDatabase } from '../lib/seed';

interface MenuSectionProps {
  foods: FoodItem[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddToCart: (food: FoodItem) => void;
  onToggleWishlist: (food: FoodItem) => void;
  wishlistIds: string[];
  loading: boolean;
  onRefreshData?: () => void;
}

export default function MenuSection({
  foods,
  categories,
  selectedCategory,
  onSelectCategory,
  searchValue,
  onSearchChange,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  loading,
  onRefreshData,
}: MenuSectionProps) {
  const [seeding, setSeeding] = useState(false);

  // Filter foods based on selected category & search query
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory =
        selectedCategory === 'all' || food.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        food.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        food.description.toLowerCase().includes(searchValue.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foods, selectedCategory, searchValue]);

  const handleManualSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (err: any) {
      console.error('Manual seeding failed:', err);
      alert('Failed to seed database: ' + (err?.message || err));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <section id="menu" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Interactive Search bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-[#F5F1EA] pb-10 mb-12 gap-6">
          <div>
            <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.2em] font-mono block mb-2">
              🍣 Gastronomy Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
              Discover Our Full Menu
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Authentic ingredients crafted with century-old precision. Every plate is a canvas of Kaizen Spirit.
            </p>
          </div>

          {/* Search and Filters inline */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Live Search */}
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search premium sushi, ramen..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#FAF8F4] text-sm text-gray-900 rounded-full pl-10 pr-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
              />
            </div>

            {/* Quick Categories Filter Dropdown for Mobile / Tablet */}
            <div className="relative w-full sm:w-auto flex items-center justify-end">
              <span className="text-xs font-bold text-gray-400 mr-2 flex items-center gap-1">
                <SlidersHorizontal size={14} /> Filter:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="bg-[#FAF8F4] text-sm text-gray-800 rounded-full px-4 py-2.5 border border-[#F5F1EA] focus:outline-none font-semibold cursor-pointer"
              >
                <option value="all">All Specialties</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <SkeletonMenu />
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {foods.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-20 text-center border-2 border-dashed border-[#F5F1EA] rounded-3xl bg-[#FAF8F4]/30 px-6 max-w-2xl mx-auto"
                >
                  <EyeOff className="mx-auto text-[#C8102E] mb-6 animate-pulse" size={48} />
                  <h3 className="text-2xl font-extrabold text-gray-950 font-sans tracking-tight">The Gourmet Menu is Currently Empty</h3>
                  <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto leading-relaxed">
                    It looks like no dishes or categories have been seeded into your Firestore database yet, or the database connection is initializing.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleManualSeed}
                      disabled={seeding}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#C8102E] text-white hover:bg-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {seeding ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Seeding Database...
                        </>
                      ) : (
                        '🌱 Seed Database with Sample Menu'
                      )}
                    </button>
                    {onRefreshData && (
                      <button
                        onClick={onRefreshData}
                        disabled={seeding}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-black text-white hover:bg-[#C8102E] font-extrabold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
                      >
                        🔄 Retry Connection
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : filteredFoods.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredFoods.map((food, index) => {
                    const isWishlisted = wishlistIds.includes(food.id);
                    return (
                      <motion.div
                        layout
                        key={food.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="group relative flex flex-col bg-white rounded-3xl border border-[#F5F1EA] overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        {/* Food Image Container */}
                        <div className="relative h-64 w-full overflow-hidden bg-gray-50">
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                            {food.isChefRecommended && (
                              <span className="bg-[#FAF8F4]/90 backdrop-blur-sm text-amber-800 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-amber-100 font-mono">
                                ⭐ Chef Recommended
                              </span>
                            )}
                            {food.isSpecial && (
                              <span className="bg-[#C8102E] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm font-mono">
                                Today's Special
                              </span>
                            )}
                          </div>

                          {/* Wishlist Icon */}
                          <button
                            onClick={() => onToggleWishlist(food)}
                            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-sm text-gray-800 hover:text-[#C8102E] shadow-md hover:scale-110 transition-all cursor-pointer"
                            aria-label="Wishlist"
                          >
                            <Heart
                              size={16}
                              className={isWishlisted ? 'fill-[#C8102E] text-[#C8102E]' : 'text-gray-700'}
                            />
                          </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            {/* Category and Rating */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                                {food.category}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <span className="text-xs font-bold text-gray-700">{food.rating}</span>
                              </div>
                            </div>

                            {/* Food Title */}
                            <h3 className="text-xl font-bold text-gray-950 group-hover:text-[#C8102E] transition-colors leading-tight">
                              {food.name}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                              {food.description}
                            </p>
                          </div>

                          {/* Price & Action */}
                          <div className="pt-5 mt-5 border-t border-[#F5F1EA] flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block font-mono">
                                Standard Portion
                              </span>
                              <p className="text-xl font-extrabold text-[#C8102E]">
                                ₹{food.price}
                              </p>
                            </div>

                            {food.available ? (
                              <button
                                onClick={() => onAddToCart(food)}
                                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-black text-white hover:bg-[#C8102E] text-xs font-bold transition-all cursor-pointer shadow hover:shadow-md"
                              >
                                <ShoppingBag size={14} />
                                <span>Add to Cart</span>
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-wider font-mono">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center border-2 border-dashed border-[#F5F1EA] rounded-3xl bg-[#FAF8F4]/30"
                >
                  <EyeOff className="mx-auto text-gray-300 mb-4" size={40} />
                  <h3 className="text-lg font-bold text-gray-800">No Food Items Found</h3>
                  <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
                    We couldn't find any dishes matching "{searchValue}" under category "{selectedCategory}". Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => {
                      onSearchChange('');
                      onSelectCategory('all');
                    }}
                    className="mt-5 inline-block text-xs font-bold bg-black text-white px-5 py-2.5 rounded-full hover:bg-[#C8102E] transition-all cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
