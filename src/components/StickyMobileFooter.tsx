import React from 'react';
import { User, Heart, ShoppingCart, Menu, Home } from 'lucide-react';

interface StickyMobileFooterProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  cartCount: number;
  favoritesCount: number;
  onOpenAccount: () => void;
  onOpenFavorites: () => void;
  onOpenCart: () => void;
  onOpenMenu: () => void;
}

export function StickyMobileFooter({
  currentView,
  setCurrentView,
  cartCount,
  favoritesCount,
  onOpenAccount,
  onOpenFavorites,
  onOpenCart,
  onOpenMenu,
}: StickyMobileFooterProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#faf9f6]/95 backdrop-blur-md border-t border-[#d6d3d1] shadow-lg pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-2">
        
        {/* 1. Logo + Business Name / Home */}
        <button
          onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex flex-col items-center justify-center py-1 text-center group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-[#1c1917] text-[#faf9f6] flex items-center justify-center font-serif font-bold text-xs shadow-xs mb-0.5">
            CW
          </div>
          <span className="text-[10px] font-medium text-[#1c1917] truncate max-w-[64px]">
            Cole World
          </span>
        </button>

        {/* 2. Account */}
        <button
          onClick={onOpenAccount}
          className="flex flex-col items-center justify-center py-1 text-[#44403c] hover:text-[#1c1917] transition-colors relative"
        >
          <div className="p-1 rounded-full hover:bg-[#e7e5e4]">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Account</span>
        </button>

        {/* 3. Favorites */}
        <button
          onClick={onOpenFavorites}
          className="flex flex-col items-center justify-center py-1 text-[#44403c] hover:text-[#1c1917] transition-colors relative"
        >
          <div className="p-1 rounded-full hover:bg-[#e7e5e4] relative">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600/10" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Favorites</span>
        </button>

        {/* 4. Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 text-[#44403c] hover:text-[#1c1917] transition-colors relative"
        >
          <div className="p-1 rounded-full hover:bg-[#e7e5e4] relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#b45309] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </button>

        {/* 5. Menu */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 text-[#44403c] hover:text-[#1c1917] transition-colors"
        >
          <div className="p-1 rounded-full hover:bg-[#e7e5e4]">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Menu</span>
        </button>

      </div>
    </div>
  );
}
