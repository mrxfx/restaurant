/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle, Send } from 'lucide-react';
import { Review } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ReviewsSectionProps {
  reviews: Review[];
  onReviewAdded: () => void;
}

export default function ReviewsSection({ reviews, onReviewAdded }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Filter approved reviews only
  const approvedReviews = reviews.filter((r) => r.approved);

  const averageRating = approvedReviews.length
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '4.8';

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !comment) return;

    setSubmitting(true);
    try {
      const newReview = {
        author: name,
        email: email,
        rating: rating,
        comment: comment,
        date: new Date().toISOString().split('T')[0],
        approved: true, // Approve immediately so user sees it in real-time in this prototype!
      };

      await addDoc(collection(db, 'reviews'), newReview);
      setSubmitted(true);
      onReviewAdded();

      // Reset form
      setTimeout(() => {
        setName('');
        setEmail('');
        setRating(5);
        setComment('');
        setSubmitted(false);
        setShowForm(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout: Info header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 border-b border-[#F5F1EA] pb-10 gap-8">
          <div>
            <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.2em] font-mono block mb-2">
              🌟 Verified Voices
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
              Reviews from Food Enthusiasts
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Discover what local critics and Japanese food lovers in Agartala have to say about Kaizen Spirit.
            </p>
          </div>

          {/* Average Rating Block */}
          <div className="flex items-center space-x-6 bg-[#FAF8F4] border border-[#F5F1EA] px-8 py-5 rounded-3xl self-start lg:self-center">
            <div className="text-center">
              <span className="text-3xl font-black text-gray-950">{averageRating}</span>
              <span className="text-gray-400 text-[10px] font-bold block uppercase font-mono">Out of 5</span>
            </div>
            <div className="space-y-1">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(Number(averageRating)) ? 'fill-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-500 block">
                Based on {approvedReviews.length} reviews
              </span>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-[#C8102E] text-white text-xs font-bold hover:bg-[#A60D25] cursor-pointer transition-all shadow"
            >
              <Plus size={14} />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Dynamic Reviews and Write form layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Write a Review Box (Always visible as widget or expandable in 1/3 layout) */}
          <div className={`lg:col-span-1 bg-[#FAF8F4] border border-[#F5F1EA] rounded-3xl p-8 transition-all ${showForm ? 'ring-2 ring-[#C8102E]/20' : ''}`}>
            <h3 className="text-lg font-bold text-gray-950 mb-1 flex items-center space-x-2">
              <MessageSquare size={18} className="text-[#C8102E]" />
              <span>Share Your Taste Experience</span>
            </h3>
            <p className="text-gray-500 text-xs mb-6">
              Your feedback fuels our Kaizen spirit. Help other foodies discover our masterpieces.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center space-y-3"
                >
                  <CheckCircle size={32} className="text-green-600 mx-auto" />
                  <h4 className="font-bold text-sm">Review Submitted!</h4>
                  <p className="text-xs text-green-600 leading-relaxed">
                    Thank you for sharing your experience. Your review is now live!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                    />
                  </div>

                  {/* Stars select */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                      Star Rating
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-amber-400 p-1 cursor-pointer hover:scale-110 transition-transform"
                        >
                          <Star
                            size={24}
                            className={star <= rating ? 'fill-amber-400' : 'text-gray-200'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                      Your Culinary Review
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write details about the presentation, broth flavor, or sushi freshness..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-[#C8102E] transition-colors shadow cursor-pointer disabled:bg-gray-400"
                  >
                    {submitting ? (
                      <span>Posting...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* List of Reviews (2/3 width) */}
          <div className="lg:col-span-2 space-y-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {approvedReviews.length > 0 ? (
              approvedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#FAF8F4] border border-[#F5F1EA] rounded-3xl p-6 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-950 text-base leading-tight">
                        {rev.author}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-bold block font-mono">
                        {rev.date}
                      </span>
                    </div>

                    {/* Star Display */}
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < rev.rating ? 'fill-amber-400' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-[#F5F1EA] rounded-3xl bg-[#FAF8F4]/20">
                <p className="text-gray-500 text-sm font-semibold">No reviews posted yet.</p>
                <p className="text-gray-400 text-xs mt-1">Be the first to share your opinion!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
