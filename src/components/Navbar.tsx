import React, { useState } from 'react';
import { Menu, X, Phone, MessageSquare, ShieldCheck, ShoppingBag, Grid, Info, Palette, Home as HomeIcon, Heart, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  whatsappNumber: string;
  cartCount: number;
  favoritesCount: number;
  currentUser: User | null;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenAccount: () => void;
}

export function Navbar({
  currentView,
  setCurrentView,
  whatsappNumber,
  cartCount,
  favoritesCount,
  currentUser,
  onOpenCart,
  onOpenFavorites,
  onOpenAccount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWhatsApp = (productName?: string) => {
    const text = productName 
      ? `Hello Cole World Furniture & Interior Designs, I would like to enquire/order about ${productName}.`
      : `Hello Cole World Furniture & Interior Designs, I would like to make an enquiry about your furniture and interior design services.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'about', label: 'About', icon: Info },
    { id: 'services', label: 'Interior Design', icon: Palette },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#e7e5e4] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Business Name */}
          <button 
            onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#1c1917] text-[#faf9f6] flex items-center justify-center font-serif font-bold text-lg shadow-md group-hover:bg-[#b45309] transition-colors">
              CW
            </div>
            <div>
              <span className="block font-serif font-bold text-lg sm:text-xl text-[#1c1917] tracking-tight">
                Cole World
              </span>
              <span className="block text-[11px] font-sans uppercase tracking-[0.15em] text-[#78716c]">
                Furniture & Interior Designs
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#1c1917] text-[#faf9f6] shadow-xs' 
                      : 'text-[#44403c] hover:bg-[#e7e5e4]/60 hover:text-[#1c1917]'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Favorites Icon */}
            <button
              onClick={onOpenFavorites}
              className="p-2.5 rounded-full bg-white border border-[#d6d3d1] text-[#44403c] hover:bg-[#f5f5f4] transition-colors relative"
              title="Saved Favorites"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600/20" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="p-2.5 rounded-full bg-white border border-[#d6d3d1] text-[#44403c] hover:bg-[#f5f5f4] transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b45309] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              onClick={onOpenAccount}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                currentUser 
                  ? 'bg-[#1c1917] text-white border-[#1c1917]' 
                  : 'bg-white text-[#44403c] border-[#d6d3d1] hover:bg-[#f5f5f4]'
              }`}
              title="Customer Account"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden xl:inline">{currentUser ? currentUser.name.split(' ')[0] : 'Account'}</span>
            </button>

            <button
              onClick={() => handleWhatsApp()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-medium shadow-sm hover:bg-[#20ba5a] transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`p-2.5 rounded-full border transition-all ${
                currentView === 'admin'
                  ? 'bg-[#b45309] text-white border-[#b45309]'
                  : 'bg-white text-[#44403c] border-[#d6d3d1] hover:bg-[#f5f5f4]'
              }`}
              title="Admin Center"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Action Buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="p-2 rounded-full bg-[#e7e5e4] text-[#1c1917] relative"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b45309] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-full bg-[#1c1917] text-[#faf9f6] hover:bg-[#b45309] transition-all shadow-md relative flex items-center justify-center w-11 h-11"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 7, scaleX: 1.15 } : { rotate: 0, y: 0, scaleX: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-0.5 bg-current origin-center rounded-full block"
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0, x: -15, scaleX: 0 } : { opacity: 1, x: 0, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-0.5 bg-current origin-center rounded-full block"
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -7, scaleX: 1.15 } : { rotate: 0, y: 0, scaleX: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-0.5 bg-current origin-center rounded-full block"
                />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#faf9f6] border-b border-[#e7e5e4] overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive 
                        ? 'bg-[#1c1917] text-[#faf9f6]' 
                        : 'text-[#44403c] hover:bg-[#e7e5e4]/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-[#e7e5e4] flex flex-col gap-2">
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#d6d3d1] text-[#1c1917] font-medium text-sm"
                >
                  <ShieldCheck className="w-5 h-5 text-[#b45309]" />
                  <span>Admin Center</span>
                </button>

                <button
                  onClick={() => {
                    handleWhatsApp();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-medium text-sm"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
