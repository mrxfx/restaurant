/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Award, HeartHandshake, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <Award className="text-[#C8102E]" size={28} />,
      title: 'Traditional Craftsmanship',
      description: 'Our chefs are intensively trained in traditional Japanese culinary arts, ensuring perfect sushi slicing, tempura crispness, and deep broth profiles.',
    },
    {
      icon: <Leaf className="text-[#C8102E]" size={28} />,
      title: 'Flawless Fresh Ingredients',
      description: 'We air-import fresh Atlantic salmon, Kyoto matcha, and select Japanese ingredients, paired with organic fresh produce sourced in Tripura.',
    },
    {
      icon: <HeartHandshake className="text-[#C8102E]" size={28} />,
      title: 'The Art of Omotenashi',
      description: 'Experience deep, wholehearted hospitality where every detail, from tableware to visual space, is tailored to your ultimate dining pleasure.',
    },
    {
      icon: <Zap className="text-[#C8102E]" size={28} />,
      title: 'Speed & Premium Packaging',
      description: 'Whether dining at home or ordering delivery, our custom thermal-insulated eco-friendly packaging ensures pristine temperature and plating.',
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-[#F5F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.25em] font-mono block mb-2">
            🏮 Pure Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
            Why Choose Kaizen Spirit
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            We merge timeless Japanese discipline with premium service to deliver a culinary experience that feeds the soul.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#FAF8F4] p-8 rounded-3xl border border-[#F5F1EA] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon Wrapper */}
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#F5F1EA] flex items-center justify-center mb-6 shadow-sm">
                  {item.icon}
                </div>

                <h3 className="text-lg font-bold text-gray-950 mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
