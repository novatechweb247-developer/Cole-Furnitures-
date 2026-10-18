import React, { useState } from 'react';
import { X, MessageSquare, Shield, Truck, Heart, ShoppingBag, Plus, Minus, CreditCard, Check } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  whatsappNumber: string;
  categories: { id: string; name: string }[];
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenCheckout: () => void;
}

export function ProductDetailModal({
  product,
  onClose,
  whatsappNumber,
  categories,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onOpenCheckout,
}: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Furniture';
  const isFavorited = favorites.includes(product.id);

  const handleWhatsAppOrder = () => {
    const text = `Hello Cole World Furniture & Interior Designs, I would like to enquire/order about ${product.name} (Qty: ${quantity}).`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-[#faf9f6] rounded-2xl shadow-2xl overflow-hidden border border-[#e7e5e4] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e5e4] bg-white">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#b45309]">
                {categoryName}
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1c1917] truncate max-w-md">
                {product.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(product.id)}
                className="p-2.5 rounded-full bg-[#f5f5f4] hover:bg-[#e7e5e4] transition-colors"
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'text-rose-600 fill-rose-600' : 'text-[#44403c]'}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full text-[#78716c] hover:bg-[#f5f5f4] hover:text-[#1c1917] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#f5f5f4] border border-[#e7e5e4] shadow-xs">
                  <img
                    src={product.images[selectedImageIndex] || product.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
                      product.availability === 'In Stock' 
                        ? 'bg-emerald-800 text-white' 
                        : 'bg-amber-800 text-white'
                    }`}>
                      {product.availability}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          selectedImageIndex === idx ? 'border-[#b45309] shadow-md scale-105' : 'border-[#e7e5e4] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Action */}
              <div className="space-y-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917]">
                    {formatPrice(product.price * quantity)}
                  </div>
                  <p className="text-xs text-[#78716c] mt-1">
                    {quantity > 1 ? `${formatPrice(product.price)} each • ` : ''}Price inclusive of standard finish (Jos, Nigeria)
                  </p>
                </div>

                <div className="border-t border-b border-[#e7e5e4] py-4 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#44403c]">Description</h3>
                  <p className="text-sm sm:text-base text-[#57534e] leading-relaxed">
                    {product.description || "Crafted with premium materials and immaculate attention to detail by Cole World Furniture & Interior Designs."}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#e7e5e4]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#44403c]">Quantity</span>
                  <div className="flex items-center border border-[#d6d3d1] rounded-lg overflow-hidden bg-[#faf9f6]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-[#e7e5e4] text-[#44403c] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-[#1c1917]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-[#e7e5e4] text-[#44403c] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Actions: Add to Cart & Paystack / WhatsApp */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleAdd}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all shadow-md ${
                      addedAnimation 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-[#1c1917] text-white hover:bg-[#b45309]'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart Successfully!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart ({quantity})</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleWhatsAppOrder}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-medium text-xs hover:bg-[#20ba5a] transition-all shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Order on WhatsApp</span>
                    </button>

                    <button
                      onClick={() => {
                        onAddToCart(product, quantity);
                        onClose();
                        onOpenCheckout();
                      }}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#091133] text-white font-medium text-xs hover:bg-[#1a2d6b] transition-all shadow-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Online</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 bg-white p-4 rounded-xl border border-[#e7e5e4] text-xs">
                  <div className="flex items-center gap-2.5 text-[#57534e]">
                    <Shield className="w-4 h-4 text-[#b45309]" />
                    <span>Genuine Quality Craftsmanship Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#57534e]">
                    <Truck className="w-4 h-4 text-[#b45309]" />
                    <span>Delivery and Professional Setup Available from Jos</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
