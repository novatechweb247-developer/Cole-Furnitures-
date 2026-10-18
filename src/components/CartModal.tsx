import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  whatsappNumber: string;
}

export function CartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  whatsappNumber,
}: CartModalProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
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
              <ShoppingBag className="w-5 h-5 text-[#b45309]" />
              <h2 className="font-serif font-bold text-lg text-[#1c1917]">Your Shopping Cart</h2>
              <span className="text-xs bg-[#e7e5e4] px-2 py-0.5 rounded-full font-medium text-[#44403c]">
                {cart.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#78716c] hover:bg-[#f5f5f4] hover:text-[#1c1917] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f5f5f4] text-[#a8a29e] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-medium text-lg text-[#1c1917]">Your cart is empty</h3>
                <p className="text-sm text-[#78716c] max-w-xs mx-auto">
                  Explore our luxury furniture collection and add exquisite pieces to your cart.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#1c1917] text-white text-sm font-medium hover:bg-[#b45309] transition-colors shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-xl bg-white border border-[#e7e5e4] shadow-2xs items-center"
                  >
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-[#e7e5e4]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-semibold text-sm text-[#1c1917] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#b45309] mt-0.5">
                        {formatNaira(item.product.price)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#d6d3d1] rounded-lg overflow-hidden bg-[#faf9f6]">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 hover:bg-[#e7e5e4] text-[#44403c] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-[#1c1917]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 hover:bg-[#e7e5e4] text-[#44403c] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[#a8a29e] hover:text-rose-600 p-1.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#e7e5e4] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#78716c]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1c1917]">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#78716c]">
                  <span>Delivery & Installation</span>
                  <span className="text-xs text-[#b45309] font-medium">Calculated at Checkout</span>
                </div>
                <div className="pt-2 border-t border-[#e7e5e4] flex justify-between font-serif font-bold text-base text-[#1c1917]">
                  <span>Total</span>
                  <span className="text-[#b45309]">{formatNaira(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1c1917] text-white font-medium text-sm hover:bg-[#b45309] transition-colors shadow-md cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full text-center py-2 text-xs text-[#78716c] hover:text-[#1c1917] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
