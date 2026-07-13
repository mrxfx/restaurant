/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Trophy, ChefHat, Star, ShoppingBag, Heart } from 'lucide-react';
import { FoodItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SpecialtiesProps {
  foods: FoodItem[];
  onAddToCart: (food: FoodItem) => void;
  onToggleWishlist: (food: FoodItem) => void;
  wishlistIds: string[];
}

type TabType = 'chef' | 'special' | 'best';

export default function Specialties({
  foods,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}: SpecialtiesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('chef');

  const chefRecommended = foods.filter((f) => f.isChefRecommended);
  const todaysSpecials = foods.filter((f) => f.isSpecial);
  const bestSellers = foods.filter((f) => f.isBestSeller);

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'chef':
        return chefRecommended;
      case 'special':
        return todaysSpecials;
      case 'best':
        return bestSellers;
      default:
        return chefRecommended;
    }
  };

  const currentItems = getFilteredItems().slice(0, 3);

  const tabs = [
    { id: 'chef', label: "Chef's Recommendations", icon: <ChefHat size={16} /> },
    { id: 'special', label: "Today's Special", icon: <Sparkles size={16} /> },
    { id: 'best', label: 'Best Sellers', icon: <Trophy size={16} /> },
  ];

  return (
    <section id="specialties" className="py-24 bg-[#FAF8F4] border-t border-[#F5F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.25em] font-mono block mb-2">
            ⭐ Culinary Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
            Curated Culinary Masterpieces
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Experience our exclusive selections hand-picked daily by the master chefs of Kaizen Spirit.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm w-full sm:w-auto justify-center ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-[#F5F1EA] hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Specialties Grid Display */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {currentItems.map((food, index) => {
                const isWishlisted = wishlistIds.includes(food.id);
                return (
                  <div
                    key={food.id}
                    className="group relative bg-white rounded-3xl border border-[#F5F1EA] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Food Photo */}
                    <div className="relative h-64 w-full overflow-hidden bg-gray-50">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={() => onToggleWishlist(food)}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-sm text-gray-800 hover:text-[#C8102E] shadow hover:scale-110 transition-all cursor-pointer"
                        aria-label="Wishlist"
                      >
                        <Heart
                          size={16}
                          className={isWishlisted ? 'fill-[#C8102E] text-[#C8102E]' : 'text-gray-700'}
                        />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Rating */}
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] bg-[#FAF8F4] text-[#C8102E] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">
                            {activeTab === 'chef'
                              ? 'Chef Choice'
                              : activeTab === 'special'
                              ? 'Today Special'
                              : 'Best Seller'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-gray-700">{food.rating}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-950 group-hover:text-[#C8102E] transition-colors leading-tight line-clamp-1">
                          {food.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                          {food.description}
                        </p>
                      </div>

                      {/* Action block */}
                      <div className="pt-4 mt-5 border-t border-[#F5F1EA] flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase font-mono">Price</p>
                          <span className="text-lg font-extrabold text-[#C8102E]">
                            ₹{food.price}
                          </span>
                        </div>

                        <button
                          onClick={() => onAddToCart(food)}
                          className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-full bg-black text-white hover:bg-[#C8102E] text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
                        >
                          <ShoppingBag size={14} />
                          <span>Order Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
