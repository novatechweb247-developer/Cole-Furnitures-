import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product, User } from '../types';
import { motion } from 'motion/react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[]; // product IDs
  products: Product[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  currentUser: User | null;
  onOpenAccount: () => void;
}

export function FavoritesModal({
  isOpen,
  onClose,
  favorites,
  products,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  currentUser,
  onOpenAccount,
}: FavoritesModalProps) {
  if (!isOpen) return null;

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-[#faf9f6] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#e7e5e4] bg-white">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h2 className="font-serif font-bold text-lg text-[#1c1917]">Your Favorites</h2>
              <span className="text-xs bg-[#e7e5e4] px-2 py-0.5 rounded-full font-medium text-[#44403c]">
                {favoriteProducts.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#78716c] hover:bg-[#f5f5f4] hover:text-[#1c1917] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!currentUser && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-xs text-amber-800">
              <span>Log in to sync favorites across devices.</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenAccount();
                }}
                className="font-bold underline hover:text-amber-900"
              >
                Log In
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {favoriteProducts.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f5f5f4] text-[#a8a29e] flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-medium text-lg text-[#1c1917]">No saved favorites yet</h3>
                <p className="text-sm text-[#78716c] max-w-xs mx-auto">
                  Tap the heart icon on any furniture piece to save it to your favorites.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#1c1917] text-white text-sm font-medium hover:bg-[#b45309] transition-colors shadow-sm"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 rounded-xl bg-white border border-[#e7e5e4] shadow-2xs items-center group"
                  >
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-[#e7e5e4] cursor-pointer"
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="font-serif font-semibold text-sm text-[#1c1917] truncate cursor-pointer hover:text-[#b45309]"
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#b45309] mt-0.5">
                        {formatNaira(product.price)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1917] text-white text-xs font-medium hover:bg-[#b45309] transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => onToggleFavorite(product.id)}
                          className="text-rose-600 hover:text-rose-700 p-1.5 transition-colors"
                          title="Remove from favorites"
                        >
                          <Heart className="w-4 h-4 fill-rose-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
