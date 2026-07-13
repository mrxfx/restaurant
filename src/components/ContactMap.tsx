/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { OpeningHours } from '../types';

interface ContactMapProps {
  openingHours: OpeningHours[];
}

export default function ContactMap({ openingHours }: ContactMapProps) {
  // Opening hours default fallback if empty
  const hoursList = openingHours.length > 0 ? openingHours : [
    { day: 'Monday - Thursday', open: '12:00 PM', close: '11:00 PM', isClosed: false },
    { day: 'Friday - Saturday', open: '12:00 PM', close: '11:30 PM', isClosed: false },
    { day: 'Sunday', open: '12:00 PM', close: '11:00 PM', isClosed: false },
  ];

  return (
    <section className="py-24 bg-[#FAF8F4] border-t border-[#F5F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout: Info Card + Interactive Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Contact Details Column */}
          <div className="flex flex-col justify-between bg-white rounded-3xl border border-[#F5F1EA] p-8 md:p-10 shadow-sm">
            <div>
              <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.2em] font-mono block mb-2">
                📍 Visit Our Temple of Taste
              </span>
              <h2 className="text-3xl font-extrabold text-gray-950 font-sans tracking-tight mb-4">
                Location & Contact
              </h2>
              <p className="text-gray-500 text-xs leading-relaxed mb-8">
                Nestled in the beautiful city of Agartala, Tripura. Feel free to drop in or contact us for home deliveries, catering, or private premium dining events.
              </p>

              {/* Direct Info Blocks */}
              <div className="space-y-6">
                
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#FAF8F4] border border-[#F5F1EA] rounded-2xl text-[#C8102E] flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-950">Restaurant Address</h4>
                    <p className="text-gray-500 text-xs mt-1">
                      Mantribari Road, Opp. Heritage Park, Agartala, Tripura - 799001
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#FAF8F4] border border-[#F5F1EA] rounded-2xl text-[#C8102E] flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-950">Direct Booking & Orders</h4>
                    <p className="text-gray-500 text-xs mt-1">
                      <a href="tel:+918730994532" className="hover:text-[#C8102E] transition-colors font-semibold">
                        +91 8730994532
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#FAF8F4] border border-[#F5F1EA] rounded-2xl text-[#C8102E] flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-950">Inquiries & Private Events</h4>
                    <p className="text-gray-500 text-xs mt-1">
                      <a href="mailto:omotenashi@kaizenspirit.com" className="hover:text-[#C8102E] transition-colors">
                        omotenashi@kaizenspirit.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Opening Hours list */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#FAF8F4] border border-[#F5F1EA] rounded-2xl text-[#C8102E] flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="w-full">
                    <h4 className="font-bold text-sm text-gray-950 mb-2">Opening Hours</h4>
                    <div className="space-y-1.5 w-full max-w-xs">
                      {hoursList.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-medium">{'day' in item ? item.day : ''}</span>
                          <span className="text-gray-700 font-bold">
                            {'isClosed' in item && item.isClosed ? 'Closed' : `${'open' in item ? item.open : ''} - ${'close' in item ? item.close : ''}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Premium WhatsApp quick action button */}
            <div className="pt-8 border-t border-[#F5F1EA]/85 mt-8 flex flex-col sm:flex-row items-center gap-4">
              <a
                href="https://wa.me/918730994532?text=Hello%20Kaizen%20Spirit%2C%20I'd%20like%20to%20place%20an%20order%2Freserve%20a%20table!"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba56] transition-all cursor-pointer shadow hover:shadow-md"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="tel:+918730994532"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-black text-white hover:bg-[#C8102E] text-xs font-bold transition-all cursor-pointer shadow hover:shadow-md"
              >
                <Phone size={14} />
                <span>Call Restaurant</span>
              </a>
            </div>
          </div>

          {/* Map Column */}
          <div className="relative rounded-3xl overflow-hidden border border-[#F5F1EA] bg-white shadow-sm flex flex-col h-[480px] lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.15663784862!2d91.27961131500057!3d23.83082538455122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f2f01f005c21%3A0xb3de4fd4a46a48b3!2sAgartala%2C%20Tripura!5e0!3m2!1sen!2sin!4v1689200000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Google Map Location of Kaizen Spirit, Agartala"
              className="flex-1 w-full filter contrast-[1.05]"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
