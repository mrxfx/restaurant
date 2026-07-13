/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Mail, Phone, MapPin, Globe, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-black text-gray-400 py-16 border-t border-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-900 pb-12 mb-12">
          
          {/* Column 1: Brand info */}
          <div className="space-y-4">
            <div onClick={() => onNavigate('home')} className="flex items-center space-x-2 cursor-pointer group">
              <span className="text-xl font-black text-white tracking-wider group-hover:text-[#C8102E] transition-colors">
                KAIZEN <span className="text-[#C8102E]">SPIRIT</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Agartala's premier world-class Japanese restaurant. We serve authentic traditional sushi, sashimi, and simmered ramen made with absolute culinary precision and passion.
            </p>
            {/* Social media handles */}
            <div className="flex space-x-3 pt-2">
              <a
                href="https://instagram.com/kaizenspirit"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-gray-900 hover:bg-[#C8102E] text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/kaizenspirit"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-gray-900 hover:bg-[#C8102E] text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick navigation */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 font-mono">
              Culinary Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white transition-colors cursor-pointer">
                  Browse Gourmet Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recommendations')} className="hover:text-white transition-colors cursor-pointer">
                  Chef Recommendations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('specialties')} className="hover:text-white transition-colors cursor-pointer">
                  Today's Specialties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors cursor-pointer">
                  Restaurant Tour Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reservation')} className="hover:text-white font-bold text-[#C8102E] transition-colors cursor-pointer">
                  Reserve Luxury Table
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 font-mono">
              Get In Touch
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-500">
              <li className="flex items-start space-x-2.5">
                <MapPin size={16} className="text-[#C8102E] flex-shrink-0" />
                <span>Mantribari Road, Opp. Heritage Park, Agartala, Tripura - 799001</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone size={14} className="text-[#C8102E]" />
                <a href="tel:+918730994532" className="text-gray-400 hover:text-white font-semibold">
                  +91 8730994532
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail size={14} className="text-[#C8102E]" />
                <a href="mailto:omotenashi@kaizenspirit.com" className="text-gray-400 hover:text-white">
                  omotenashi@kaizenspirit.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter subscribe */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 font-mono">
              Join the Kaizen Creed
            </h4>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Subscribe to receive updates about secret culinary popups, seasonal truffle ramens, and executive chef recommendations.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex space-x-1.5">
              <input
                type="email"
                placeholder="Enter email..."
                className="bg-gray-950 border border-gray-800 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8102E] text-white flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#C8102E] hover:bg-[#A60D25] text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[11px] text-gray-600">
          <span>
            © 2026 Kaizen Spirit Restaurant. All rights reserved. Made with Omotenashi in Agartala.
          </span>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
