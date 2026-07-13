/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { FoodItem } from '../types';
import { motion } from 'motion/react';

interface PopularTodayProps {
  foods: FoodItem[];
  onAddToCart: (food: FoodItem) => void;
  onToggleWishlist: (food: FoodItem) => void;
  wishlistIds: string[];
}

export default function PopularToday({
  foods,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}: PopularTodayProps) {
  const popularFoods = foods.filter((food) => food.isPopular).slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.2em] font-mono block mb-2">
              🔥 Customer Favorites
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
              Popular Today
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Hand-crafted, highly requested fresh dishes trending at Kaizen Spirit right now.
            </p>
          </div>
        </div>

        {/* Popular Foods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularFoods.map((food, index) => {
            const isWishlisted = wishlistIds.includes(food.id);
            return (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col bg-[#FAF8F4] rounded-3xl border border-[#F5F1EA] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container with Zoom effect */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-[#C8102E] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm font-mono">
                    Popular
                  </span>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onToggleWishlist(food)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 hover:text-[#C8102E] shadow-sm hover:scale-110 transition-all cursor-pointer"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={16}
                      className={isWishlisted ? 'fill-[#C8102E] text-[#C8102E]' : 'text-gray-700'}
                    />
                  </button>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                        {food.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-gray-700">{food.rating}</span>
                      </div>
                    </div>

                    {/* Food Name */}
                    <h3 className="text-lg font-bold text-gray-950 group-hover:text-[#C8102E] transition-colors line-clamp-1">
                      {food.name}
                    </h3>

                    {/* Food Description */}
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                      {food.description}
                    </p>
                  </div>

                  {/* Price & Cart Actions */}
                  <div className="pt-4 mt-4 border-t border-[#F5F1EA]/80 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest font-mono">
                        Price
                      </span>
                      <p className="text-lg font-extrabold text-[#C8102E]">
                        ₹{food.price}
                      </p>
                    </div>

                    <button
                      onClick={() => onAddToCart(food)}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-[#C8102E] text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
