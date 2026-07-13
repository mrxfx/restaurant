/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  isPopular: boolean;
  isSpecial: boolean;
  isChefRecommended: boolean;
  isBestSeller: boolean;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponUsed?: string;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
  type: 'dine-in' | 'delivery';
  deliveryAddress?: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
  tableNumber?: string;
}

export interface Review {
  id: string;
  author: string;
  email: string;
  rating: number;
  comment: string;
  foodName?: string;
  date: string;
  approved: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: 'food' | 'interior' | 'chef';
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface HeroBanner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  active: boolean;
}
