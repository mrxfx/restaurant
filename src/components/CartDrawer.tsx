/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Ticket, CheckCircle, ArrowRight, ShoppingCart, Home, Store } from 'lucide-react';
import { OrderItem, FoodItem, Coupon } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (foodId: string, delta: number) => void;
  onRemoveItem: (foodId: string) => void;
  onClearCart: () => void;
  coupons: Coupon[];
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  coupons,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  
  // Checkout Fields
  const [orderType, setOrderType] = useState<'dine-in' | 'delivery'>('delivery');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Validate coupon
  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode) return;

    const matchedCoupon = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());

    if (!matchedCoupon) {
      setCouponError('Invalid coupon code.');
      return;
    }

    if (!matchedCoupon.active) {
      setCouponError('This coupon is no longer active.');
      return;
    }

    if (subtotal < matchedCoupon.minOrderAmount) {
      setCouponError(`Min order of ₹${matchedCoupon.minOrderAmount} required.`);
      return;
    }

    setActiveCoupon(matchedCoupon);
    setCouponCode('');
  };

  const discount = activeCoupon
    ? activeCoupon.discountType === 'percent'
      ? Math.round((subtotal * activeCoupon.discountValue) / 100)
      : activeCoupon.discountValue
    : 0;

  const total = Math.max(0, subtotal - discount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || (orderType === 'delivery' && !address)) return;

    setSubmitting(true);
    try {
      const orderData = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        type: orderType,
        deliveryAddress: orderType === 'delivery' ? address : 'Dine-In at Agartala Store',
        items: cartItems,
        totalAmount: subtotal,
        discountAmount: discount,
        finalAmount: total,
        couponUsed: activeCoupon?.code || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setPlacedOrderId(docRef.id);
      setCheckoutStep('success');
      onClearCart();
      
      // Reset checkout states
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setActiveCoupon(null);
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#F5F1EA] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="text-[#C8102E]" size={20} />
                <span className="font-extrabold text-lg text-gray-950">
                  {checkoutStep === 'cart' ? 'Your Gourmet Order' : checkoutStep === 'checkout' ? 'Checkout' : 'Order Placed!'}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full font-mono">
                  {cartItems.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#FAF8F4] text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <AnimatePresence mode="wait">
                {checkoutStep === 'cart' && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {cartItems.length > 0 ? (
                      <>
                        {/* Cart Items List */}
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div
                              key={item.foodId}
                              className="flex space-x-4 p-4 border border-[#F5F1EA] rounded-2xl bg-[#FAF8F4]/50"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-xl object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-gray-950 text-sm line-clamp-1">
                                    {item.name}
                                  </h4>
                                  <button
                                    onClick={() => onRemoveItem(item.foodId)}
                                    className="text-gray-400 hover:text-[#C8102E] p-1 cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                  {/* Quantity toggles */}
                                  <div className="flex items-center space-x-2 border border-[#F5F1EA] bg-white rounded-full p-1 shadow-sm">
                                    <button
                                      onClick={() => onUpdateQuantity(item.foodId, -1)}
                                      className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full cursor-pointer"
                                    >
                                      <Minus size={10} />
                                    </button>
                                    <span className="text-xs font-bold text-gray-800 w-4 text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => onUpdateQuantity(item.foodId, 1)}
                                      className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full cursor-pointer"
                                    >
                                      <Plus size={10} />
                                    </button>
                                  </div>

                                  <span className="font-extrabold text-sm text-[#C8102E]">
                                    ₹{item.price * item.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Promo / Coupon Block */}
                        <div className="pt-4 border-t border-[#F5F1EA]">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">
                            Apply Coupon Code
                          </label>
                          <div className="flex space-x-2">
                            <div className="relative flex-1">
                              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="text"
                                placeholder="Enter coupon (e.g. KAIZEN20)"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full bg-[#FAF8F4] text-xs text-gray-900 rounded-xl pl-9 pr-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                              />
                            </div>
                            <button
                              onClick={handleApplyCoupon}
                              className="px-4 py-3 bg-black text-white hover:bg-[#C8102E] rounded-xl text-xs font-bold uppercase cursor-pointer"
                            >
                              Apply
                            </button>
                          </div>
                          {couponError && <p className="text-xs font-semibold text-[#C8102E] mt-1">{couponError}</p>}
                          {activeCoupon && (
                            <p className="text-xs font-semibold text-green-600 mt-1.5 flex items-center gap-1">
                              <CheckCircle size={14} /> Coupon applied: {activeCoupon.code} (-₹{discount})
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-20">
                        <span className="text-5xl block mb-4">🍱</span>
                        <h3 className="text-lg font-bold text-gray-800">Your Cart is Empty</h3>
                        <p className="text-gray-500 text-xs mt-1 max-w-xs mx-auto">
                          Add our handcrafted mouth-watering Japanese items to begin your fine dining adventure!
                        </p>
                        <button
                          onClick={onClose}
                          className="mt-6 inline-block text-xs font-bold bg-[#C8102E] text-white px-6 py-3 rounded-full hover:bg-[#A60D25] cursor-pointer shadow"
                        >
                          Browse Food
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {checkoutStep === 'checkout' && (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <form onSubmit={handlePlaceOrder} className="space-y-5">
                      
                      {/* Order Type Toggle */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 font-mono">
                          Order Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setOrderType('delivery')}
                            className={`flex items-center justify-center space-x-2 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              orderType === 'delivery'
                                ? 'bg-black text-white border-black'
                                : 'bg-[#FAF8F4] text-gray-700 border-[#F5F1EA]'
                            }`}
                          >
                            <Home size={14} />
                            <span>Home Delivery</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setOrderType('dine-in')}
                            className={`flex items-center justify-center space-x-2 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              orderType === 'dine-in'
                                ? 'bg-black text-white border-black'
                                : 'bg-[#FAF8F4] text-gray-700 border-[#F5F1EA]'
                            }`}
                          >
                            <Store size={14} />
                            <span>Dine-In Pickup</span>
                          </button>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#FAF8F4] text-xs text-gray-900 rounded-xl px-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                        />
                      </div>

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
                          className="w-full bg-[#FAF8F4] text-xs text-gray-900 rounded-xl px-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#FAF8F4] text-xs text-gray-900 rounded-xl px-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                        />
                      </div>

                      {/* Delivery Address if active */}
                      {orderType === 'delivery' && (
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                            Delivery Address in Agartala
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Complete address (apartment, sector, street name, landmarks...)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-[#FAF8F4] text-xs text-gray-900 rounded-xl px-4 py-3 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                          />
                        </div>
                      )}

                      {/* Summary calculation before submitting */}
                      <div className="bg-[#FAF8F4] border border-[#F5F1EA] p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-gray-500">
                          <span>Subtotal</span>
                          <span>₹{subtotal}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-xs font-semibold text-green-600">
                            <span>Discount</span>
                            <span>-₹{discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-dashed border-[#F5F1EA]">
                          <span>Total Amount</span>
                          <span className="text-[#C8102E]">₹{total}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep('cart')}
                          className="w-1/3 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-[#FAF8F4] text-xs font-bold uppercase transition-all cursor-pointer text-center"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-2/3 py-3 rounded-xl bg-black hover:bg-[#C8102E] text-white text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center space-x-2 shadow disabled:bg-gray-400"
                        >
                          <span>{submitting ? 'Placing Order...' : 'Confirm Order'}</span>
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}

                {checkoutStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-16 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto mb-4 shadow">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-950">Arigato Gozaimasu!</h3>
                    <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed">
                      Your premium order has been recorded successfully.
                    </p>
                    <div className="bg-[#FAF8F4] border border-[#F5F1EA] p-4 rounded-2xl text-xs text-left space-y-1.5 font-mono">
                      <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Receipt Summary</span>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Receipt ID:</span>
                        <span className="text-gray-800 font-bold max-w-[180px] truncate">{placedOrderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Method:</span>
                        <span className="text-gray-800 font-bold capitalize">{orderType}</span>
                      </div>
                    </div>
                    <p className="text-[#C8102E] text-xs font-bold animate-pulse pt-2">
                      Our chefs are already preparing your food!
                    </p>
                    <button
                      onClick={() => {
                        setCheckoutStep('cart');
                        onClose();
                      }}
                      className="mt-6 w-full inline-flex items-center justify-center space-x-1.5 px-6 py-3.5 rounded-full bg-black text-white text-xs font-bold hover:bg-[#C8102E] transition-all cursor-pointer shadow"
                    >
                      <span>Continue Browsing</span>
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary (Only visible when checkout step is "cart" and there are items) */}
            {checkoutStep === 'cart' && cartItems.length > 0 && (
              <div className="p-6 border-t border-[#F5F1EA] bg-[#FAF8F4] space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs font-semibold text-green-600">
                      <span>Discount Coupon</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-extrabold text-gray-950 pt-2 border-t border-dashed border-[#F5F1EA]">
                    <span>Total Amount</span>
                    <span className="text-lg text-[#C8102E]">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl bg-black text-white text-xs font-bold uppercase hover:bg-[#C8102E] transition-all shadow cursor-pointer tracking-wider"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
