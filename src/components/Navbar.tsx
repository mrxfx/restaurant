/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Phone, Menu, X, ShieldAlert, Award, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onViewCart: () => void;
  cartCount: number;
  wishlistCount: number;
  onViewWishlist: () => void;
  onNavigate: (section: string) => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
  activeSection: string;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export default function Navbar({
  onViewCart,
  cartCount,
  wishlistCount,
  onViewWishlist,
  onNavigate,
  onSearchChange,
  searchValue,
  activeSection,
  onOpenAdmin,
  isAdmin,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Menu', id: 'menu' },
    { name: 'Chef Recommend', id: 'recommendations' },
    { name: 'Specialties', id: 'specialties' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Reserve', id: 'reservation' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-md py-3 border-b border-[#F5F1EA]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#C8102E] transition-colors">
              KAIZEN <span className="text-[#C8102E]">SPIRIT</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] bg-[#FAF8F4] text-[#C8102E] font-medium tracking-widest px-2 py-0.5 rounded-full border border-[#FAF8F4] uppercase font-mono">
              Agartala
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  activeSection === link.id
                    ? 'text-[#C8102E] font-semibold border-b-2 border-[#C8102E] pb-1'
                    : isScrolled
                    ? 'text-gray-600 hover:text-[#C8102E]'
                    : 'text-gray-800 hover:text-[#C8102E]'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search toggler */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchVisible && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    placeholder="Search delicious food..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-[#FAF8F4] text-sm text-gray-900 rounded-full px-4 py-1.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                  />
                )}
              </AnimatePresence>
              <button
                onClick={() => {
                  setIsSearchVisible(!isSearchVisible);
                  if (isSearchVisible) onSearchChange('');
                }}
                className={`p-2 rounded-full cursor-pointer transition-colors ${
                  isScrolled ? 'text-gray-700 hover:bg-[#FAF8F4]' : 'text-gray-800 hover:bg-white/20'
                }`}
                aria-label="Search food"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={onViewWishlist}
              className={`relative p-2 rounded-full cursor-pointer transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-[#FAF8F4]' : 'text-gray-800 hover:bg-white/20'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? 'fill-[#C8102E] text-[#C8102E]' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8102E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onViewCart}
              className={`relative p-2 rounded-full cursor-pointer transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-[#FAF8F4]' : 'text-gray-800 hover:bg-white/20'
              }`}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Call button */}
            <a
              href="tel:+918730994532"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F4] text-gray-800 hover:text-[#C8102E] border border-[#F5F1EA] text-xs font-semibold transition-all"
            >
              <Phone size={14} className="text-[#C8102E]" />
              <span>+91 8730994532</span>
            </a>

            {/* Reserve Quick CTA */}
            <button
              onClick={() => handleNavClick('reservation')}
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#C8102E] text-white text-xs font-semibold hover:bg-[#A60D25] transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <Calendar size={14} />
              <span>Reserve Table</span>
            </button>

            {/* Admin toggle button */}
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-full cursor-pointer transition-colors flex items-center justify-center ${
                isAdmin
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : isScrolled
                  ? 'text-gray-600 hover:bg-[#FAF8F4]'
                  : 'text-gray-800 hover:bg-white/20'
              }`}
              title={isAdmin ? 'Admin Dashboard (Logged In)' : 'Admin Portal'}
            >
              <ShieldAlert size={20} className={isAdmin ? 'text-amber-600 animate-pulse' : ''} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full cursor-pointer transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-[#FAF8F4]' : 'text-gray-800 hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[60px] left-0 right-0 bg-white shadow-xl z-30 border-b border-[#F5F1EA] px-4 py-6 flex flex-col space-y-4 max-h-[calc(100vh-60px)] overflow-y-auto lg:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2.5 px-4 rounded-xl text-base font-semibold transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#FAF8F4] text-[#C8102E]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 border-t border-[#F5F1EA] flex flex-col space-y-3 px-4">
              <a
                href="tel:+918730994532"
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-[#FAF8F4] text-gray-800 border border-[#F5F1EA] text-sm font-semibold"
              >
                <Phone size={16} className="text-[#C8102E]" />
                <span>Call Us: +91 8730994532</span>
              </a>
              <button
                onClick={() => handleNavClick('reservation')}
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-[#C8102E] text-white text-sm font-semibold hover:bg-[#A60D25] shadow"
              >
                <Calendar size={16} />
                <span>Reserve Table Now</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
