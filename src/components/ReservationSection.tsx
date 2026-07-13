/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Users, Clock, Mail, Phone, User, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ReservationSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [requests, setRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) return;

    setSubmitting(true);
    try {
      const reservationData = {
        name,
        email,
        phone,
        date,
        time,
        guests: Number(guests),
        specialRequests: requests,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'reservations'), reservationData);
      setSubmitted(true);

      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setDate('');
      setTime('');
      setGuests(2);
      setRequests('');
    } catch (err) {
      console.error('Error creating reservation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Reservation visual text & guidelines (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.2em] font-mono block">
              ⛩️ Reserve Your Table
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 font-sans leading-tight">
              An Exceptional <br />
              Dining Journey <br />
              Awaits You
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ensure your premium dining spot at Kaizen Spirit. Our luxury dining seats are limited, and we recommend reserving at least 24 hours in advance, especially for weekends or private groups.
            </p>

            <div className="space-y-4 pt-6 border-t border-[#F5F1EA]">
              <div className="flex items-center space-x-3 text-xs text-gray-600 font-semibold">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold font-mono">1</div>
                <span>Choose date, time, and number of guests.</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-600 font-semibold">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold font-mono">2</div>
                <span>Mention any food allergies or seating requests.</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-600 font-semibold">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold font-mono">3</div>
                <span>Receive instant email / SMS confirmation.</span>
              </div>
            </div>
          </div>

          {/* Actual Reservation Form Box (7 columns) */}
          <div className="lg:col-span-7 bg-[#FAF8F4] border border-[#F5F1EA] rounded-3xl p-8 md:p-10 shadow-sm relative">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto mb-4 shadow">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-950">Reservation Requested!</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you. We have received your reservation request. Our host will confirm your table and contact you within 15 minutes!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex items-center space-x-1.5 px-6 py-3 rounded-full bg-black text-white text-xs font-bold hover:bg-[#C8102E] transition-all cursor-pointer shadow"
                  >
                    <span>Make Another Booking</span>
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Grid for Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                        <User size={12} className="text-gray-400" /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" /> Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                        <Phone size={12} className="text-gray-400" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                      />
                    </div>

                    {/* Guests count */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                        <Users size={12} className="text-gray-400" /> Number of Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E] cursor-pointer font-semibold"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" /> Reservation Date
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E] cursor-pointer"
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" /> Select Time Slot
                      </label>
                      <select
                        value={time}
                        required
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E] cursor-pointer font-semibold"
                      >
                        <option value="">Choose a slot...</option>
                        <option value="12:00 PM">12:00 PM (Lunch)</option>
                        <option value="1:00 PM">1:00 PM (Lunch)</option>
                        <option value="2:00 PM">2:00 PM (Lunch)</option>
                        <option value="6:00 PM">6:00 PM (Dinner)</option>
                        <option value="7:00 PM">7:00 PM (Dinner)</option>
                        <option value="8:00 PM">8:00 PM (Dinner)</option>
                        <option value="9:00 PM">9:00 PM (Dinner)</option>
                        <option value="10:00 PM">10:00 PM (Dinner)</option>
                      </select>
                    </div>

                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-mono">
                      Special Requests / Seating Preference
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Birthday celebration, vegetarian preferences, quiet table corner, allergies..."
                      value={requests}
                      onChange={(e) => setRequests(e.target.value)}
                      className="w-full bg-white text-xs text-gray-900 rounded-xl px-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-[#C8102E] text-white font-bold hover:bg-[#A60D25] transition-all cursor-pointer shadow-md text-xs uppercase tracking-wider disabled:bg-gray-400"
                  >
                    {submitting ? 'Creating Reservation Request...' : 'Book Premium Table Now'}
                  </button>

                </form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
