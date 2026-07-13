/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';
import { seedDatabase } from './lib/seed';
import { FoodItem, Category, Order, Reservation, Review, Coupon, OpeningHours, GalleryItem, OrderItem } from './types';

// Import Custom Modular Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularToday from './components/PopularToday';
import CategoryList from './components/CategoryList';
import MenuSection from './components/MenuSection';
import Specialties from './components/Specialties';
import WhyChooseUs from './components/WhyChooseUs';
import ReviewsSection from './components/ReviewsSection';
import GallerySection from './components/GallerySection';
import AboutSection from './components/AboutSection';
import ContactMap from './components/ContactMap';
import ReservationSection from './components/ReservationSection';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

import { Heart, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global Database States
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // App Interactive States
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [wishlist, setWishlist] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Visual feedback notification toasts
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch all collections from Firestore with high resilience
  const fetchAllData = async () => {
    setLoading(true);
    setDbError(null);
    let errorCount = 0;
    let lastErrorMessage = '';

    // Fetch Foods
    try {
      const foodsSnap = await getDocs(collection(db, 'foods'));
      const foodsList = foodsSnap.docs.map((d) => d.data() as FoodItem);
      setFoods(foodsList);
    } catch (error: any) {
      console.error('Error fetching foods:', error);
      errorCount++;
      lastErrorMessage = error?.message || 'Failed to fetch food items';
    }

    // Fetch Categories
    try {
      const catSnap = await getDocs(collection(db, 'categories'));
      const catList = catSnap.docs.map((d) => d.data() as Category);
      setCategories(catList);
    } catch (error) {
      console.error('Error fetching categories:', error);
      errorCount++;
    }

    // Fetch Orders
    try {
      const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      const ordersList = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Order);
      setOrders(ordersList);
    } catch (error) {
      // Fallback query without orderBy if it fails or requires index
      try {
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const ordersList = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Order);
        setOrders(ordersList);
      } catch (innerError) {
        console.error('Error fetching orders:', innerError);
        errorCount++;
      }
    }

    // Fetch Reservations
    try {
      const resSnap = await getDocs(query(collection(db, 'reservations'), orderBy('createdAt', 'desc')));
      const resList = resSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Reservation);
      setReservations(resList);
    } catch (error) {
      // Fallback query without orderBy
      try {
        const resSnap = await getDocs(collection(db, 'reservations'));
        const resList = resSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Reservation);
        setReservations(resList);
      } catch (innerError) {
        console.error('Error fetching reservations:', innerError);
        errorCount++;
      }
    }

    // Fetch Reviews
    try {
      const revSnap = await getDocs(query(collection(db, 'reviews'), orderBy('date', 'desc')));
      const revList = revSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Review);
      setReviews(revList);
    } catch (error) {
      // Fallback query without orderBy
      try {
        const revSnap = await getDocs(collection(db, 'reviews'));
        const revList = revSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Review);
        setReviews(revList);
      } catch (innerError) {
        console.error('Error fetching reviews:', innerError);
        errorCount++;
      }
    }

    // Fetch Coupons
    try {
      const coupSnap = await getDocs(collection(db, 'coupons'));
      const coupList = coupSnap.docs.map((d) => d.data() as Coupon);
      setCoupons(coupList);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      errorCount++;
    }

    // Fetch Opening Hours
    try {
      const hoursSnap = await getDocs(collection(db, 'opening_hours'));
      const hoursList = hoursSnap.docs.map((d) => d.data() as OpeningHours);
      setOpeningHours(hoursList);
    } catch (error) {
      console.error('Error fetching opening hours:', error);
      errorCount++;
    }

    // Fetch Gallery
    try {
      const galSnap = await getDocs(collection(db, 'gallery'));
      const galList = galSnap.docs.map((d) => d.data() as GalleryItem);
      setGallery(galList);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      errorCount++;
    }

    if (errorCount > 0) {
      setDbError(`Database fetch partially failed (${errorCount} collections had issues). Latest error: ${lastErrorMessage}`);
    } else {
      setDbError(null);
    }
    setLoading(false);
  };

  // Seeding + Init Data load on mount
  useEffect(() => {
    let active = true;
    const initApp = async () => {
      try {
        await seedDatabase();
      } catch (err) {
        console.error('Failed to seed database on startup:', err);
      }
      if (active) {
        await fetchAllData();
      }
    };
    initApp();
    return () => {
      active = false;
    };
  }, []);

  // Sync scroll to detect currently active screen/section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const sections = ['home', 'menu', 'specialties', 'gallery', 'reviews', 'reservation'];
      
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Operations
  const handleAddToCart = (food: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.foodId === food.id);
      if (existing) {
        return prev.map((item) =>
          item.foodId === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          foodId: food.id,
          name: food.name,
          price: food.price,
          quantity: 1,
          image: food.image,
        },
      ];
    });
    triggerToast(`Added ${food.name} to your gourmet order!`);
  };

  const handleUpdateQuantity = (foodId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.foodId === foodId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (foodId: string) => {
    setCart((prev) => prev.filter((item) => item.foodId !== foodId));
    triggerToast('Removed item from gourmet order.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const handleToggleWishlist = (food: FoodItem) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === food.id);
      if (exists) {
        triggerToast(`Removed ${food.name} from wishlist.`);
        return prev.filter((item) => item.id !== food.id);
      }
      triggerToast(`Saved ${food.name} to wishlist.`);
      return [...prev, food];
    });
  };

  // Navigation Scrolling helper
  const handleNavigate = (sectionId: string) => {
    // If Admin panel is open, close it first so user sees normal sections
    setIsAdminPanelOpen(false);

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(sectionId);
      }
    }, 100);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistIds = wishlist.map((item) => item.id);

  return (
    <div className="bg-white min-h-screen text-gray-950 selection:bg-[#C8102E] selection:text-white antialiased">
      
      {/* Sticky Header Navigation */}
      <Navbar
        onViewCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onViewWishlist={() => setIsWishlistOpen(true)}
        onNavigate={handleNavigate}
        onSearchChange={setSearchValue}
        searchValue={searchValue}
        activeSection={activeSection}
        onOpenAdmin={() => {
          setIsAdminPanelOpen(!isAdminPanelOpen);
          if (!isAdminPanelOpen) {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        isAdmin={isAdmin}
      />

      {/* Main Container Layout */}
      <main className="pt-[60px]">
        {dbError && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-3 flex items-center justify-between font-mono z-40 relative">
            <span className="flex items-center gap-2">⚠️ <strong>Database notice:</strong> {dbError}</span>
            <button 
              onClick={() => fetchAllData()} 
              className="underline font-bold hover:text-amber-950 cursor-pointer px-2 py-1 rounded bg-white border border-amber-300 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}
        <AnimatePresence mode="wait">
          {isAdminPanelOpen ? (
            /* Admin Panel Dashboard View */
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel
                isAdmin={isAdmin}
                onLoginSuccess={() => setIsAdmin(true)}
                onLogout={() => setIsAdmin(false)}
                foods={foods}
                categories={categories}
                orders={orders}
                reservations={reservations}
                reviews={reviews}
                coupons={coupons}
                openingHours={openingHours}
                gallery={gallery}
                onRefreshData={fetchAllData}
              />
            </motion.div>
          ) : (
            /* Normal Customer Storefront Layout */
            <motion.div
              key="storefront"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Showcase slide banner */}
              <Hero onNavigate={handleNavigate} />

              {/* Popular Today - placement immediately below hero */}
              <PopularToday
                foods={foods}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />

              {/* Interactive Categories list */}
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onNavigateToMenu={() => handleNavigate('menu')}
              />

              {/* Full Interactive Menu Catalog */}
              <MenuSection
                foods={foods}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                loading={loading}
                onRefreshData={fetchAllData}
              />

              {/* Curated Specialties tabs (Chef recommendations, Specials, Best sellers) */}
              <Specialties
                foods={foods}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />

              {/* Why Choose Us */}
              <WhyChooseUs />

              {/* Gallery Tour */}
              <GallerySection gallery={gallery} />

              {/* Customer Opinions / Reviews & form */}
              <ReviewsSection reviews={reviews} onReviewAdded={fetchAllData} />

              {/* About Restaurant */}
              <AboutSection />

              {/* Reservation scheduling Booking form */}
              <ReservationSection />

              {/* Map & Address Contacts */}
              <ContactMap openingHours={openingHours} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding Links */}
      <Footer onNavigate={handleNavigate} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        coupons={coupons}
      />

      {/* Wishlist Panel Modal */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl border border-[#F5F1EA] p-6 max-w-md w-full z-50 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center pb-3 border-b border-[#F5F1EA]">
                <div className="flex items-center space-x-2">
                  <Heart className="text-[#C8102E] fill-[#C8102E]" size={18} />
                  <span className="font-extrabold text-base text-gray-950">Your Saved Wishlist</span>
                  <span className="text-xs bg-[#FAF8F4] text-[#C8102E] font-bold px-2 py-0.5 rounded-full border border-[#F5F1EA] font-mono">
                    {wishlist.length} items
                  </span>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#FAF8F4] text-gray-400 hover:text-black cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Wishlist Items list */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1.5 custom-scrollbar">
                {wishlist.length > 0 ? (
                  wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-4 p-3 border border-[#F5F1EA] rounded-2xl bg-[#FAF8F4]/50 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl" referrerPolicy="no-referrer" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                          <button
                            onClick={() => handleToggleWishlist(item)}
                            className="text-[#C8102E] hover:scale-110 transition-transform cursor-pointer p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-extrabold text-sm text-[#C8102E]">₹{item.price}</span>
                          <button
                            onClick={() => {
                              handleAddToCart(item);
                              setIsWishlistOpen(false);
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-black hover:bg-[#C8102E] text-white text-[10px] font-bold transition-all cursor-pointer"
                          >
                            <ShoppingBag size={10} />
                            <span>Add Order</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-3xl block mb-2">🥢</span>
                    <p className="text-xs font-bold">No saved wishlist items found.</p>
                    <p className="text-[10px] text-gray-400 mt-1">Tap hearts on foods to easily compile favorites.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Toast Notification Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-bold px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 border border-gray-800"
          >
            <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
