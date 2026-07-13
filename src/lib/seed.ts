/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, getDocs, setDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { FoodItem, Category, Coupon, GalleryItem, OpeningHours, Review } from '../types';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_sushi', name: 'Sushi & Sashimi', icon: '🍣', slug: 'sushi' },
  { id: 'cat_ramen', name: 'Ramen', icon: '🍜', slug: 'ramen' },
  { id: 'cat_bento', name: 'Bento Boxes', icon: '🍱', slug: 'bento' },
  { id: 'cat_donburi', name: 'Donburi Rice Bowls', icon: '🍛', slug: 'donburi' },
  { id: 'cat_tempura', name: 'Tempura & Starters', icon: '🍤', slug: 'tempura' },
  { id: 'cat_drinks', name: 'Artisanal Drinks', icon: '🍵', slug: 'drinks' },
  { id: 'cat_desserts', name: 'Japanese Desserts', icon: '🍡', slug: 'desserts' }
];

const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food_1',
    name: 'Dragon Roll Supreme',
    description: 'Eel and cucumber inside, wrapped with premium avocado and topped with sweet unagi sauce and gold flakes.',
    price: 890,
    category: 'sushi',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isSpecial: true,
    isChefRecommended: true,
    isBestSeller: true,
    available: true
  },
  {
    id: 'food_2',
    name: 'Truffle Shoyu Tonkotsu Ramen',
    description: 'Rich, creamy pork bone broth simmered for 16 hours, infused with high-grade black truffle oil and artisanal shoyu.',
    price: 720,
    category: 'ramen',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isSpecial: true,
    isChefRecommended: true,
    isBestSeller: true,
    available: true
  },
  {
    id: 'food_3',
    name: 'Salmon Aburi Nigiri Set',
    description: 'Lightly torched premium Atlantic salmon over seasoned sushi rice, finished with house-made sweet soy glaze and spicy mayo.',
    price: 650,
    category: 'sushi',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isSpecial: false,
    isChefRecommended: false,
    isBestSeller: false,
    available: true
  },
  {
    id: 'food_4',
    name: 'Wagyu Beef Donburi',
    description: 'Tender slices of premium wagyu beef simmered with caramelized onions in sweet dashi sauce, served over hot Nishiki rice with an onsen egg.',
    price: 1150,
    category: 'donburi',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isSpecial: true,
    isChefRecommended: true,
    isBestSeller: false,
    available: true
  },
  {
    id: 'food_5',
    name: 'Deluxe Chicken Teriyaki Bento',
    description: 'Complete bento box featuring flame-grilled teriyaki chicken, gyoza, dynamic mixed tempura, salad, and steamed rice.',
    price: 590,
    category: 'bento',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isSpecial: false,
    isChefRecommended: false,
    isBestSeller: true,
    available: true
  },
  {
    id: 'food_6',
    name: 'Golden Tiger Tempura Platter',
    description: 'Perfectly crispy jumbo tiger prawns and selected seasonal mountain vegetables in light, airy traditional tempura batter.',
    price: 490,
    category: 'tempura',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isSpecial: false,
    isChefRecommended: false,
    isBestSeller: false,
    available: true
  },
  {
    id: 'food_7',
    name: 'Spicy Miso Ramen',
    description: 'Rich chicken and pork broth blended with spicy Sapporo red miso, served with chashu pork, bamboo shoots, and a soft ajitama egg.',
    price: 680,
    category: 'ramen',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isSpecial: false,
    isChefRecommended: false,
    isBestSeller: true,
    available: true
  },
  {
    id: 'food_8',
    name: 'Signature Bluefin Tuna Sashimi',
    description: 'Thick, exquisite slices of premium bluefin tuna sashimi served on a bed of fresh ice with authentic wasabi root.',
    price: 980,
    category: 'sushi',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isSpecial: true,
    isChefRecommended: true,
    isBestSeller: false,
    available: true
  },
  {
    id: 'food_9',
    name: 'Crispy Pork Katsu Bento',
    description: 'Premium panko-breaded pork cutlet served with house katsu sauce, shredded cabbage, edamame, and hand-rolled maki.',
    price: 620,
    category: 'bento',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isSpecial: false,
    isChefRecommended: false,
    isBestSeller: false,
    available: true
  },
  {
    id: 'food_10',
    name: 'Premium Kyoto Uji Matcha Latte',
    description: 'Ceremonial grade matcha from Uji, Kyoto, whisked perfectly with velvety milk and served with light cane sugar syrup.',
    price: 250,
    category: 'drinks',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isSpecial: false,
    isChefRecommended: false,
    isBestSeller: true,
    available: true
  },
  {
    id: 'food_11',
    name: 'Mochi Ice Cream Trio',
    description: 'Handmade sweet rice dough filled with premium ice cream. Flavour selection: Premium Matcha, Sweet Mango, and Belgian Chocolate.',
    price: 280,
    category: 'desserts',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isSpecial: true,
    isChefRecommended: false,
    isBestSeller: false,
    available: true
  },
  {
    id: 'food_12',
    name: 'Sake & Plum Soda Mocktail',
    description: 'Crafted sparkling soda infused with premium non-alcoholic sweet sake base and imported Japanese green plums (Umeboshi flavor).',
    price: 290,
    category: 'drinks',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isSpecial: false,
    isChefRecommended: false,
    isBestSeller: false,
    available: true
  }
];

const INITIAL_COUPONS: Coupon[] = [
  { id: 'cp_1', code: 'KAIZEN20', discountType: 'percent', discountValue: 20, minOrderAmount: 1000, active: true },
  { id: 'cp_2', code: 'WELCOME100', discountType: 'fixed', discountValue: 100, minOrderAmount: 500, active: true },
  { id: 'cp_3', code: 'SUSHI15', discountType: 'percent', discountValue: 15, minOrderAmount: 800, active: true }
];

const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  { id: 'gal_1', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', title: 'Luxury Minimalist Dining Space', category: 'interior' },
  { id: 'gal_2', imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1ecda6374?auto=format&fit=crop&w=800&q=80', title: 'Traditional Sushi Craftsmanship', category: 'chef' },
  { id: 'gal_3', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', title: 'Sizzling Premium Teppanyaki', category: 'food' },
  { id: 'gal_4', imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80', title: 'Authentic Omotenashi Table Setting', category: 'interior' },
  { id: 'gal_5', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80', title: 'Art of Bluefin Tuna Preparation', category: 'chef' },
  { id: 'gal_6', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', title: 'House Specialty Shoyu Ramen', category: 'food' }
];

const INITIAL_OPENING_HOURS: OpeningHours[] = [
  { day: 'Monday', open: '12:00 PM', close: '11:00 PM', isClosed: false },
  { day: 'Tuesday', open: '12:00 PM', close: '11:00 PM', isClosed: false },
  { day: 'Wednesday', open: '12:00 PM', close: '11:00 PM', isClosed: false },
  { day: 'Thursday', open: '12:00 PM', close: '11:00 PM', isClosed: false },
  { day: 'Friday', open: '12:00 PM', close: '11:30 PM', isClosed: false },
  { day: 'Saturday', open: '12:00 PM', close: '11:30 PM', isClosed: false },
  { day: 'Sunday', open: '12:00 PM', close: '11:00 PM', isClosed: false }
];

const INITIAL_REVIEWS: Review[] = [
  { id: 'rev_1', author: 'Aniruddha Debbarma', email: 'aniruddha@gmail.com', rating: 5, comment: 'Hands down the best Japanese food in Tripura! The Truffle Ramen has such deep umami flavors, and the sushi is incredibly fresh. Beautiful minimalist atmosphere too.', date: '2026-07-01', approved: true },
  { id: 'rev_2', author: 'Riya Sen', email: 'riya@yahoo.com', rating: 5, comment: 'Kaizen Spirit is a masterclass in modern dining. Every bite of the Dragon Roll was pure bliss. Perfect premium feel, extremely fast service.', date: '2026-07-05', approved: true },
  { id: 'rev_3', author: 'Rajesh Sharma', email: 'rajesh@gmail.com', rating: 4, comment: 'The crispy pork katsu bento was top notch, perfectly crunchy on the outside. Exceptional premium vibe right in the heart of Agartala.', date: '2026-07-09', approved: true }
];

export async function seedDatabase() {
  try {
    // 1. Check if foods are already seeded
    const foodsSnap = await getDocs(collection(db, 'foods'));
    if (!foodsSnap.empty) {
      console.log('Database already seeded with foods.');
      return;
    }

    console.log('Seeding Database...');

    // 2. Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }

    // 3. Seed Food Items
    for (const item of INITIAL_FOOD_ITEMS) {
      await setDoc(doc(db, 'foods', item.id), item);
    }

    // 4. Seed Coupons
    for (const coupon of INITIAL_COUPONS) {
      await setDoc(doc(db, 'coupons', coupon.id), coupon);
    }

    // 5. Seed Gallery Items
    for (const item of INITIAL_GALLERY_ITEMS) {
      await setDoc(doc(db, 'gallery', item.id), item);
    }

    // 6. Seed Opening Hours
    for (const hour of INITIAL_OPENING_HOURS) {
      await setDoc(doc(db, 'opening_hours', hour.day), hour);
    }

    // 7. Seed Reviews
    for (const rev of INITIAL_REVIEWS) {
      await setDoc(doc(db, 'reviews', rev.id), rev);
    }

    console.log('Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
