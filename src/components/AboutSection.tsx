/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChefHat, History, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Images Grid collage */}
          <div className="grid grid-cols-2 gap-4 relative">
            {/* Background design accents */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#C8102E]/5 rounded-full filter blur-xl" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <img
                src="https://images.unsplash.com/photo-1579027989536-b7b1ecda6374?auto=format&fit=crop&w=800&q=80"
                alt="Chef preparing sushi"
                className="rounded-3xl object-cover h-64 w-full shadow border border-[#F5F1EA]"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80"
                alt="Elegant restaurant table setup"
                className="rounded-3xl object-cover h-44 w-full shadow border border-[#F5F1EA]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 pt-8"
            >
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Modern minimalist restaurant interior"
                className="rounded-3xl object-cover h-44 w-full shadow border border-[#F5F1EA]"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="Sizzling Teppanyaki beef"
                className="rounded-3xl object-cover h-64 w-full shadow border border-[#F5F1EA]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.2em] font-mono block">
              🎌 The Kaizen Creed
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 font-sans leading-tight">
              A World-Class Japanese Haven <br />
              in Agartala
            </h2>
            
            <p className="text-gray-500 text-sm leading-relaxed">
              "Kaizen" stands for continuous improvement. At Kaizen Spirit, we live this philosophy daily, constantly refining our craftsmanship, sourcing the finest ingredients, and polishing our service. Founded with the mission to bring the authentic "Omotenashi" Japanese dining experience to Agartala, Tripura, we refuse any compromises.
            </p>

            <p className="text-gray-500 text-sm leading-relaxed">
              From our slow-cooked 16-hour bone broths to the precise temperature of our seasoned sushi rice, our team blends centuries of traditional discipline with a bright, welcoming environment.
            </p>

            {/* Quick Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#F5F1EA]">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#FAF8F4] border border-[#F5F1EA] text-[#C8102E]">
                  <ChefHat size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-950">Master Chefs</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase font-mono">Expert Hands</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#FAF8F4] border border-[#F5F1EA] text-[#C8102E]">
                  <History size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-950">Authentic recipes</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase font-mono">Since Inception</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#FAF8F4] border border-[#F5F1EA] text-[#C8102E]">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-950">Pure Passion</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase font-mono">100% Love</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
