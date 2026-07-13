/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  ClipboardList,
  Calendar,
  MessageSquare,
  Ticket,
  Clock,
  Image as ImageIcon,
  Check,
  X as CloseIcon,
  RefreshCw,
  ShoppingBag,
  Star,
  Layers,
  Save,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FoodItem, Category, Order, Reservation, Review, Coupon, OpeningHours, GalleryItem } from '../types';

interface AdminPanelProps {
  isAdmin: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  foods: FoodItem[];
  categories: Category[];
  orders: Order[];
  reservations: Reservation[];
  reviews: Review[];
  coupons: Coupon[];
  openingHours: OpeningHours[];
  gallery: GalleryItem[];
  onRefreshData: () => void;
}

type AdminTab = 'foods' | 'orders' | 'reservations' | 'reviews' | 'coupons' | 'hours' | 'gallery' | 'categories';

export default function AdminPanel({
  isAdmin,
  onLoginSuccess,
  onLogout,
  foods,
  categories,
  orders,
  reservations,
  reviews,
  coupons,
  openingHours,
  gallery,
  onRefreshData,
}: AdminPanelProps) {
  const [email, setEmail] = useState('admin@kaizenspirit.com');
  const [password, setPassword] = useState('kaizen2026');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('foods');

  // Form states for adding items
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'sushi',
    rating: 5.0,
    image: '',
    isPopular: false,
    isSpecial: false,
    isChefRecommended: false,
    isBestSeller: false,
    available: true
  });

  const [showAddCouponForm, setShowAddCouponForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: 15,
    minOrderAmount: 500,
    active: true
  });

  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '🍣',
    slug: ''
  });

  const [showAddGalleryForm, setShowAddGalleryForm] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    imageUrl: '',
    category: 'food' as 'food' | 'interior' | 'chef'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@kaizenspirit.com' && password === 'kaizen2026') {
      onLoginSuccess();
      setLoginError('');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  // Status updates in Firestore
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: 'pending' | 'preparing' | 'completed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: nextStatus });
      onRefreshData();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleUpdateReservationStatus = async (resId: string, nextStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'reservations', resId), { status: nextStatus });
      onRefreshData();
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  const handleApproveReview = async (revId: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, 'reviews', revId), { approved });
      onRefreshData();
    } catch (err) {
      console.error('Error approving review:', err);
    }
  };

  const handleDeleteDoc = async (col: string, id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this?')) return;
    try {
      await deleteDoc(doc(db, col, id));
      onRefreshData();
    } catch (err) {
      console.error('Error deleting doc:', err);
    }
  };

  const handleToggleFoodAvailability = async (foodId: string, currentVal: boolean) => {
    try {
      await updateDoc(doc(db, 'foods', foodId), { available: !currentVal });
      onRefreshData();
    } catch (err) {
      console.error('Error toggling food status:', err);
    }
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const foodId = 'food_' + Date.now();
      await setDoc(doc(db, 'foods', foodId), {
        ...newFood,
        id: foodId,
        price: Number(newFood.price),
        rating: Number(newFood.rating)
      });
      setShowAddFoodForm(false);
      setNewFood({
        name: '',
        description: '',
        price: 0,
        category: 'sushi',
        rating: 5.0,
        image: '',
        isPopular: false,
        isSpecial: false,
        isChefRecommended: false,
        isBestSeller: false,
        available: true
      });
      onRefreshData();
    } catch (err) {
      console.error('Error adding food:', err);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = 'cp_' + Date.now();
      await setDoc(doc(db, 'coupons', id), {
        ...newCoupon,
        id,
        discountValue: Number(newCoupon.discountValue),
        minOrderAmount: Number(newCoupon.minOrderAmount)
      });
      setShowAddCouponForm(false);
      setNewCoupon({
        code: '',
        discountType: 'percent',
        discountValue: 15,
        minOrderAmount: 500,
        active: true
      });
      onRefreshData();
    } catch (err) {
      console.error('Error adding coupon:', err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = 'cat_' + Date.now();
      const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'categories', id), {
        ...newCategory,
        id,
        slug
      });
      setShowAddCategoryForm(false);
      setNewCategory({ name: '', icon: '🍣', slug: '' });
      onRefreshData();
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = 'gal_' + Date.now();
      await setDoc(doc(db, 'gallery', id), {
        ...newGalleryItem,
        id
      });
      setShowAddGalleryForm(false);
      setNewGalleryItem({ title: '', imageUrl: '', category: 'food' });
      onRefreshData();
    } catch (err) {
      console.error('Error adding gallery item:', err);
    }
  };

  const handleUpdateHours = async (day: string, open: string, close: string, isClosed: boolean) => {
    try {
      await setDoc(doc(db, 'opening_hours', day), {
        day,
        open,
        close,
        isClosed
      });
      onRefreshData();
    } catch (err) {
      console.error('Error updating hours:', err);
    }
  };

  if (!isAdmin) {
    return (
      <section className="py-32 bg-[#FAF8F4] flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-[#F5F1EA] rounded-3xl p-8 shadow-md"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#C8102E]/10 text-[#C8102E] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-950 font-sans">Kaizen Admin Portal</h2>
            <p className="text-gray-500 text-xs mt-1.5">
              Secure access for Kaizen Spirit restaurant management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F4] text-xs text-gray-900 rounded-xl pl-10 pr-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF8F4] text-xs text-gray-900 rounded-xl pl-10 pr-4 py-3.5 border border-[#F5F1EA] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                />
              </div>
            </div>

            {loginError && <p className="text-xs font-semibold text-[#C8102E]">{loginError}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-black text-white text-xs font-bold uppercase hover:bg-[#C8102E] transition-all cursor-pointer shadow tracking-wider"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Quick Creds Info for ease of test */}
          <div className="mt-6 bg-[#FAF8F4] border border-[#F5F1EA] rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase font-mono tracking-widest block">Demo Administrator Credentials</span>
            <p className="text-[11px] text-gray-700 mt-1.5">
              Email: <span className="font-bold">admin@kaizenspirit.com</span> <br />
              Password: <span className="font-bold">kaizen2026</span>
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#FAF8F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="bg-white rounded-3xl border border-[#F5F1EA] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="text-green-600 animate-pulse" size={24} />
              <span className="text-[#C8102E] font-bold text-xs uppercase tracking-[0.2em] font-mono">
                Kaizen Control Center
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950 font-sans tracking-tight mt-1">
              Admin Dashboard
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              Live oversight of foods, reservation logs, orders, and customer opinions.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center">
            <button
              onClick={onRefreshData}
              className="p-2.5 rounded-full bg-[#FAF8F4] hover:bg-gray-100 text-gray-600 hover:text-black border border-[#F5F1EA] cursor-pointer transition-colors flex items-center justify-center"
              title="Refresh Live Data"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-[#C8102E] text-xs font-bold uppercase transition-all cursor-pointer shadow-sm"
            >
              Log Out Portal
            </button>
          </div>
        </div>

        {/* Outer Dashboard layout: Navigation Sidebar (1/4) + Detail Panel (3/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Tabs Sidebar */}
          <div className="bg-white rounded-3xl border border-[#F5F1EA] p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] text-gray-400 font-bold uppercase font-mono tracking-widest block px-4 py-2">
              Management Modules
            </span>
            
            {[
              { id: 'foods', label: 'Manage Foods', icon: <ShoppingBag size={16} /> },
              { id: 'categories', label: 'Categories', icon: <Layers size={16} /> },
              { id: 'orders', label: `Orders (${orders.length})`, icon: <ClipboardList size={16} /> },
              { id: 'reservations', label: `Reservations (${reservations.length})`, icon: <Calendar size={16} /> },
              { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={16} /> },
              { id: 'coupons', label: 'Coupons', icon: <Ticket size={16} /> },
              { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={16} /> },
              { id: 'hours', label: 'Opening Hours', icon: <Clock size={16} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C8102E] text-white'
                      : 'text-gray-700 hover:bg-[#FAF8F4] hover:text-gray-950'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Details Content Container (3/4) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-[#F5F1EA] p-6 md:p-8 shadow-sm min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* 1. FOODS PANEL */}
                {activeTab === 'foods' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-[#F5F1EA]">
                      <div>
                        <h3 className="text-lg font-bold text-gray-950">Food Inventory ({foods.length})</h3>
                        <p className="text-gray-500 text-xs">Add, delete, or toggle availability of menu items.</p>
                      </div>
                      <button
                        onClick={() => setShowAddFoodForm(!showAddFoodForm)}
                        className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-black text-white hover:bg-[#C8102E] text-xs font-bold cursor-pointer transition-all"
                      >
                        <Plus size={14} />
                        <span>Add New Food</span>
                      </button>
                    </div>

                    {/* Expandable Add Food Form */}
                    {showAddFoodForm && (
                      <form onSubmit={handleAddFood} className="bg-[#FAF8F4] border border-[#F5F1EA] rounded-2xl p-5 space-y-4">
                        <span className="text-xs font-bold text-gray-800 uppercase font-mono block">New Culinary Entry</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Food Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Wagyu Aburi Nigiri"
                              value={newFood.name}
                              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Image URL</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. https://images.unsplash.com/photo-..."
                              value={newFood.image}
                              onChange={(e) => setNewFood({ ...newFood, image: e.target.value })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Price (₹)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 590"
                              value={newFood.price || ''}
                              onChange={(e) => setNewFood({ ...newFood, price: Number(e.target.value) })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Category Slug</label>
                            <select
                              value={newFood.category}
                              onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none cursor-pointer"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Description</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Detail presentation, key ingredients..."
                            value={newFood.description}
                            onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                            className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                          />
                        </div>

                        {/* Special Badges flags checkboxes */}
                        <div className="flex flex-wrap gap-4 pt-2">
                          <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newFood.isPopular}
                              onChange={(e) => setNewFood({ ...newFood, isPopular: e.target.checked })}
                            />
                            <span>Popular Badge</span>
                          </label>

                          <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newFood.isSpecial}
                              onChange={(e) => setNewFood({ ...newFood, isSpecial: e.target.checked })}
                            />
                            <span>Today's Special</span>
                          </label>

                          <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newFood.isChefRecommended}
                              onChange={(e) => setNewFood({ ...newFood, isChefRecommended: e.target.checked })}
                            />
                            <span>Chef's Choice</span>
                          </label>

                          <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newFood.isBestSeller}
                              onChange={(e) => setNewFood({ ...newFood, isBestSeller: e.target.checked })}
                            />
                            <span>Best Seller</span>
                          </label>
                        </div>

                        <div className="flex space-x-2 justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddFoodForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-[#C8102E] cursor-pointer"
                          >
                            Save Food
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Food Items list table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono">
                            <th className="py-3 px-2">Dish</th>
                            <th className="py-3 px-2">Category</th>
                            <th className="py-3 px-2">Price</th>
                            <th className="py-3 px-2">Availability</th>
                            <th className="py-3 px-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {foods.map((food) => (
                            <tr key={food.id} className="hover:bg-gray-50/50">
                              <td className="py-3.5 px-2 flex items-center space-x-3">
                                <img src={food.image} alt="" className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                                <div>
                                  <span className="font-bold text-gray-900 block">{food.name}</span>
                                  <span className="text-[10px] text-gray-400">{food.id}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-2 capitalize font-semibold text-gray-600">{food.category}</td>
                              <td className="py-3.5 px-2 font-bold text-gray-900">₹{food.price}</td>
                              <td className="py-3.5 px-2">
                                <button
                                  onClick={() => handleToggleFoodAvailability(food.id, food.available)}
                                  className="cursor-pointer"
                                >
                                  {food.available ? (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-bold text-[10px]">
                                      <Check size={10} /> <span>Available</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-bold text-[10px]">
                                      <CloseIcon size={10} /> <span>Out of stock</span>
                                    </span>
                                  )}
                                </button>
                              </td>
                              <td className="py-3.5 px-2 text-right">
                                <button
                                  onClick={() => handleDeleteDoc('foods', food.id)}
                                  className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. CATEGORIES PANEL */}
                {activeTab === 'categories' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-[#F5F1EA]">
                      <div>
                        <h3 className="text-lg font-bold text-gray-950">Categories ({categories.length})</h3>
                        <p className="text-gray-500 text-xs">Manage food classification tags.</p>
                      </div>
                      <button
                        onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
                        className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-black text-white hover:bg-[#C8102E] text-xs font-bold cursor-pointer transition-all"
                      >
                        <Plus size={14} />
                        <span>Add Category</span>
                      </button>
                    </div>

                    {showAddCategoryForm && (
                      <form onSubmit={handleAddCategory} className="bg-[#FAF8F4] border border-[#F5F1EA] rounded-2xl p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Temaki"
                              value={newCategory.name}
                              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Emoji Icon</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 🍣"
                              value={newCategory.icon}
                              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none text-center text-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Slug (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. temaki"
                              value={newCategory.slug}
                              onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddCategoryForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-[#C8102E] cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <div key={cat.id} className="flex justify-between items-center p-4 border rounded-2xl bg-[#FAF8F4] border-[#F5F1EA]">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{cat.icon}</span>
                            <div>
                              <h4 className="font-bold text-gray-950 text-sm">{cat.name}</h4>
                              <span className="text-[10px] text-gray-400 font-mono">slug: {cat.slug}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteDoc('categories', cat.id)}
                            className="p-1.5 text-gray-400 hover:text-[#C8102E] cursor-pointer rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. ORDERS PANEL */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-[#F5F1EA]">
                      <h3 className="text-lg font-bold text-gray-950">Gourmet Customer Orders ({orders.length})</h3>
                      <p className="text-gray-500 text-xs">Live tracking and status preparation triggers.</p>
                    </div>

                    <div className="space-y-4">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <div key={order.id} className="border border-[#F5F1EA] rounded-2xl p-5 bg-[#FAF8F4]/50 space-y-4">
                            
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 gap-2">
                              <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Order ID: {order.id}</span>
                                <h4 className="font-extrabold text-sm text-gray-950 mt-0.5">
                                  {order.customerName} ({order.customerPhone})
                                </h4>
                                <span className="text-[11px] text-gray-500 block">{order.customerEmail}</span>
                              </div>

                              {/* Status Badges */}
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                  order.status === 'completed'
                                    ? 'bg-green-50 text-green-700'
                                    : order.status === 'preparing'
                                    ? 'bg-amber-50 text-amber-700'
                                    : order.status === 'cancelled'
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {order.status}
                                </span>

                                <span className="text-[10px] font-bold bg-gray-100 text-gray-800 px-2 py-1 rounded-full uppercase font-mono">
                                  {order.type}
                                </span>
                              </div>
                            </div>

                            {/* Order Items list details */}
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs font-semibold text-gray-700">
                                  <span>
                                    {item.name} <span className="text-gray-400 font-bold">x {item.quantity}</span>
                                  </span>
                                  <span>₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            {/* Delivery Location if delivery */}
                            {order.type === 'delivery' && (
                              <div className="bg-white p-3 border rounded-xl text-xs text-gray-600 leading-relaxed">
                                <span className="font-bold text-gray-800 block mb-0.5">📍 Address:</span>
                                {order.deliveryAddress}
                              </div>
                            )}

                            {/* Calculation block & triggers */}
                            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="text-xs font-semibold">
                                <span className="text-gray-500">Discount: ₹{order.discountAmount || 0}</span>
                                <span className="text-gray-900 font-extrabold block text-sm mt-0.5">Total: ₹{order.finalAmount}</span>
                              </div>

                              {/* preparation action triggers */}
                              <div className="flex flex-wrap gap-2">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                                  >
                                    Start Preparing
                                  </button>
                                )}
                                {order.status === 'preparing' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                    className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                                  >
                                    Mark Completed
                                  </button>
                                )}
                                {order.status !== 'completed' && order.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteDoc('orders', order.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-[#F5F1EA] rounded-2xl">
                          <p className="text-gray-500 text-sm font-semibold">No orders logged.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. RESERVATIONS PANEL */}
                {activeTab === 'reservations' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-[#F5F1EA]">
                      <h3 className="text-lg font-bold text-gray-950">Table Bookings ({reservations.length})</h3>
                      <p className="text-gray-500 text-xs">Verify table reservations and coordinate table bookings.</p>
                    </div>

                    <div className="space-y-4">
                      {reservations.length > 0 ? (
                        reservations.map((res) => (
                          <div key={res.id} className="border border-[#F5F1EA] rounded-2xl p-5 bg-[#FAF8F4]/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  res.status === 'confirmed'
                                    ? 'bg-green-50 text-green-700'
                                    : res.status === 'cancelled'
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {res.status}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">{res.date} at {res.time}</span>
                              </div>
                              <h4 className="font-extrabold text-gray-950 text-sm mt-1">
                                {res.name} ({res.guests} Guests)
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">{res.phone} | {res.email}</p>
                              {res.specialRequests && (
                                <p className="text-xs text-gray-600 mt-2 bg-white border p-2 rounded-lg italic">
                                  "{res.specialRequests}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 self-end sm:self-center">
                              {res.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                                >
                                  Confirm Table
                                </button>
                              )}
                              {res.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                                >
                                  Cancel Booking
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteDoc('reservations', res.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-[#F5F1EA] rounded-2xl">
                          <p className="text-gray-500 text-sm font-semibold">No reservations found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. REVIEWS PANEL */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-[#F5F1EA]">
                      <h3 className="text-lg font-bold text-gray-950">Customer Reviews</h3>
                      <p className="text-gray-500 text-xs">Moderate and manage reviews appearing on the homepage.</p>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="border border-[#F5F1EA] rounded-2xl p-5 bg-[#FAF8F4]/50 flex flex-col justify-between gap-4">
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-extrabold text-sm text-gray-950">{rev.author} ({rev.email})</h4>
                                <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                              </div>
                              <div className="flex text-amber-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} size={12} className={i < rev.rating ? 'fill-amber-400' : 'text-gray-200'} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 italic mt-2 bg-white border p-3 rounded-xl">
                              "{rev.comment}"
                            </p>
                          </div>

                          <div className="flex justify-end items-center space-x-2 pt-2">
                            {rev.approved ? (
                              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check size={10} /> Approved
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApproveReview(rev.id, true)}
                                className="px-3 py-1.5 bg-black hover:bg-green-600 text-white rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                              >
                                Approve Review
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteDoc('reviews', rev.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. COUPONS PANEL */}
                {activeTab === 'coupons' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-[#F5F1EA]">
                      <div>
                        <h3 className="text-lg font-bold text-gray-950">Active Promo Coupons ({coupons.length})</h3>
                        <p className="text-gray-500 text-xs">Generate custom discounts and manage active codes.</p>
                      </div>
                      <button
                        onClick={() => setShowAddCouponForm(!showAddCouponForm)}
                        className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-black text-white hover:bg-[#C8102E] text-xs font-bold cursor-pointer transition-all"
                      >
                        <Plus size={14} />
                        <span>Add Coupon</span>
                      </button>
                    </div>

                    {showAddCouponForm && (
                      <form onSubmit={handleAddCoupon} className="bg-[#FAF8F4] border border-[#F5F1EA] rounded-2xl p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Coupon Code</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. SUSHI25"
                              value={newCoupon.code}
                              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Discount Type</label>
                            <select
                              value={newCoupon.discountType}
                              onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none cursor-pointer"
                            >
                              <option value="percent">Percentage (%)</option>
                              <option value="fixed">Fixed Flat (₹)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Discount Value</label>
                            <input
                              type="number"
                              required
                              value={newCoupon.discountValue || ''}
                              onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Minimum Order Amount (₹)</label>
                            <input
                              type="number"
                              required
                              value={newCoupon.minOrderAmount || ''}
                              onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddCouponForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-[#C8102E] cursor-pointer"
                          >
                            Save Coupon
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {coupons.map((cp) => (
                        <div key={cp.id} className="border border-[#F5F1EA] rounded-2xl p-5 bg-[#FAF8F4]/50 flex justify-between items-center">
                          <div className="space-y-1">
                            <span className="text-xs font-bold font-mono bg-black text-white px-3 py-1 rounded-md">
                              {cp.code}
                            </span>
                            <p className="text-xs font-extrabold text-gray-800 pt-1.5">
                              {cp.discountType === 'percent' ? `${cp.discountValue}% Off` : `₹${cp.discountValue} Flat Off`}
                            </p>
                            <p className="text-[10px] text-gray-500">Min Order: ₹{cp.minOrderAmount}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteDoc('coupons', cp.id)}
                            className="p-2 text-gray-400 hover:text-[#C8102E] cursor-pointer rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. GALLERY PANEL */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-[#F5F1EA]">
                      <div>
                        <h3 className="text-lg font-bold text-gray-950">Gallery Items ({gallery.length})</h3>
                        <p className="text-gray-500 text-xs">Add/Delete images appearing on the homepage tour.</p>
                      </div>
                      <button
                        onClick={() => setShowAddGalleryForm(!showAddGalleryForm)}
                        className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-black text-white hover:bg-[#C8102E] text-xs font-bold cursor-pointer transition-all"
                      >
                        <Plus size={14} />
                        <span>Add Image</span>
                      </button>
                    </div>

                    {showAddGalleryForm && (
                      <form onSubmit={handleAddGallery} className="bg-[#FAF8F4] border border-[#F5F1EA] rounded-2xl p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Image Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Master Chef Rolling"
                              value={newGalleryItem.title}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Image URL</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. https://images.unsplash.com/photo-..."
                              value={newGalleryItem.imageUrl}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, imageUrl: e.target.value })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">Gallery Type</label>
                            <select
                              value={newGalleryItem.category}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value as any })}
                              className="w-full bg-white text-xs p-2.5 border rounded-lg focus:outline-none cursor-pointer"
                            >
                              <option value="food">Food</option>
                              <option value="interior">Interior Ambiance</option>
                              <option value="chef">Chef Activity</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddGalleryForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-[#C8102E] cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {gallery.map((item) => (
                        <div key={item.id} className="relative rounded-2xl overflow-hidden border border-[#F5F1EA] group h-36">
                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                            <span className="text-[9px] bg-[#C8102E] px-2 py-0.5 rounded self-start font-bold uppercase font-mono">{item.category}</span>
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-bold line-clamp-1">{item.title}</span>
                              <button
                                onClick={() => handleDeleteDoc('gallery', item.id)}
                                className="text-white hover:text-[#C8102E] p-1 cursor-pointer bg-black/40 rounded-md"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. OPENING HOURS PANEL */}
                {activeTab === 'hours' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-[#F5F1EA]">
                      <h3 className="text-lg font-bold text-gray-950">Restaurant Opening Hours</h3>
                      <p className="text-gray-500 text-xs">Update your weekly business hours.</p>
                    </div>

                    <div className="space-y-4">
                      {openingHours.map((hour) => (
                        <div key={hour.day} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-[#F5F1EA] rounded-2xl bg-[#FAF8F4]/50 gap-4">
                          <span className="font-bold text-gray-900 text-sm w-28">{hour.day}</span>

                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              disabled={hour.isClosed}
                              value={hour.open}
                              onChange={(e) => handleUpdateHours(hour.day, e.target.value, hour.close, hour.isClosed)}
                              className="bg-white border rounded-lg p-2 text-xs w-24 text-center disabled:bg-gray-100 font-semibold"
                            />
                            <span className="text-xs text-gray-400 font-bold">to</span>
                            <input
                              type="text"
                              disabled={hour.isClosed}
                              value={hour.close}
                              onChange={(e) => handleUpdateHours(hour.day, hour.open, e.target.value, hour.isClosed)}
                              className="bg-white border rounded-lg p-2 text-xs w-24 text-center disabled:bg-gray-100 font-semibold"
                            />
                          </div>

                          <label className="flex items-center space-x-2 text-xs font-bold text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hour.isClosed}
                              onChange={(e) => handleUpdateHours(hour.day, hour.open, hour.close, e.target.checked)}
                            />
                            <span>Closed today</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
