import React, { useState, useEffect } from 'react';
import { StoreData, Product, CartItem, User, Order } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { CategoriesView } from './components/CategoriesView';
import { AboutView } from './components/AboutView';
import { ServicesView } from './components/ServicesView';
import { ContactView } from './components/ContactView';
import { AdminCenter } from './components/AdminCenter';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StickyMobileFooter } from './components/StickyMobileFooter';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AccountModal } from './components/AccountModal';
import { FavoritesModal } from './components/FavoritesModal';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';

import { defaultStoreData } from './data/defaultStore';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [storeData, setStoreData] = useState<StoreData | null>(() => {
    try {
      const cached = localStorage.getItem('cole_world_store_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // Customer Account & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cole_world_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Favorites State (product IDs)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cole_world_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cole_world_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const WHATSAPP_NUMBER = '07065712674';

  // The admin route is configured only through the deployment environment.
  const adminPath = import.meta.env.VITE_ADMIN_PATH as string | undefined;
  const isAdminRoute = Boolean(adminPath && adminPath.startsWith('/') && window.location.pathname === adminPath);

  const fetchStoreData = async () => {
    try {
      const res = await fetch('/api/store');
      if (res.ok) {
        const data = await res.json();
        setStoreData(data);
        localStorage.setItem('cole_world_store_cache', JSON.stringify(data));
        return;
      }
    } catch (err) {
      console.warn('API store fetch failed, using fallback/cache', err);
    }

    // Fallback if API not available (e.g. Vercel static deployment)
  if (!storeData) {
      setStoreData(defaultStoreData as StoreData);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  // Sync favorites when user changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.favorites) {
        setFavorites(currentUser.favorites);
      }
      localStorage.setItem('cole_world_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cole_world_user');
    }
  }, [currentUser]);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('cole_world_cart', JSON.stringify(cart));
  }, [cart]);

  // Save local favorites
  useEffect(() => {
    localStorage.setItem('cole_world_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = async (productId: string) => {
    if (currentUser) {
      try {
        const res = await fetch(`/api/users/${currentUser.id}/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        });
        const data = await res.json();
        if (res.ok) {
          setFavorites(data.favorites);
          setCurrentUser(prev => prev ? { ...prev, favorites: data.favorites } : null);
        }
      } catch (err) {
        console.error('Failed to update favorites on server', err);
      }
    } else {
      // Local toggle for guest
      setFavorites(prev => {
        if (prev.includes(productId)) {
          return prev.filter(id => id !== productId);
        } else {
          return [...prev, productId];
        }
      });
    }
  };

  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prev, { product, quantity: qty }];
      }
    });
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.favorites) {
      setFavorites(user.favorites);
    }
    setAccountOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cole_world_user');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  if (isAdminRoute) {
    if (!storeData) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] text-[#1c1917]">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-serif font-bold">Loading Admin Center...</h2>
            <p className="text-xs text-[#78716c]">Loading saved website content.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[#faf9f6] text-[#1c1917]">
        <AdminCenter
          storeData={storeData}
          onRefreshData={fetchStoreData}
          setCurrentView={() => { window.location.href = '/'; }}
        />
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] text-[#1c1917]">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-serif font-bold">Loading Cole World Furniture...</h2>
          <p className="text-xs text-[#78716c]">Please wait while your persistent store initializes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1c1917] pb-16 md:pb-0">
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#92400e] z-50 origin-left shadow-md"
      />

      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        whatsappNumber={WHATSAPP_NUMBER}
        cartCount={totalCartCount}
        favoritesCount={favorites.length}
        currentUser={currentUser}
        onOpenCart={() => setCartOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {currentView === 'home' && (
              <HomeView
                content={storeData.content}
                products={storeData.products}
                categories={storeData.categories}
                setCurrentView={setCurrentView}
                onSelectProduct={(p) => setSelectedProduct(p)}
                whatsappNumber={WHATSAPP_NUMBER}
              />
            )}

            {currentView === 'shop' && (
              <ShopView
                products={storeData.products}
                categories={storeData.categories}
                onSelectProduct={(p) => setSelectedProduct(p)}
                whatsappNumber={WHATSAPP_NUMBER}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentView === 'categories' && (
              <CategoriesView
                categories={storeData.categories}
                products={storeData.products}
                setCurrentView={setCurrentView}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            )}

            {currentView === 'about' && (
              <AboutView whatsappNumber={WHATSAPP_NUMBER} />
            )}

            {currentView === 'services' && (
              <ServicesView whatsappNumber={WHATSAPP_NUMBER} />
            )}

            {currentView === 'contact' && (
              <ContactView whatsappNumber={WHATSAPP_NUMBER} />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        setCurrentView={setCurrentView}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      {/* Sticky Mobile Footer Navigation */}
      <StickyMobileFooter
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={totalCartCount}
        favoritesCount={favorites.length}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => {
          // Open Mobile Drawer or scroll to top/menu
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          whatsappNumber={WHATSAPP_NUMBER}
          categories={storeData.categories}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onOpenCheckout={() => setCheckoutOpen(true)}
        />
      )}

      {/* Cart Modal / Drawer */}
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setCheckoutOpen(true)}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      {/* Favorites Modal / Drawer */}
      <FavoritesModal
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        products={storeData.products}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
        currentUser={currentUser}
        onOpenAccount={() => setAccountOpen(true)}
      />

      {/* Customer Account Modal */}
      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        products={storeData.products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        currentUser={currentUser}
        whatsappNumber={WHATSAPP_NUMBER}
        onOrderSuccess={(order: Order) => {
          console.log('Order created successfully', order);
        }}
        clearCart={() => setCart([])}
      />
    </div>
  );
}
