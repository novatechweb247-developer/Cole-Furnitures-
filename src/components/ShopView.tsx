import React, { useState, useMemo } from 'react';
import { Search, Filter, MessageSquare, ArrowRight, SlidersHorizontal, PackageOpen, Heart, ShoppingBag } from 'lucide-react';
import { Product, Category } from '../types';
import { motion } from 'motion/react';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  whatsappNumber: string;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export function ShopView({
  products,
  categories,
  onSelectProduct,
  whatsappNumber,
  favorites,
  onToggleFavorite,
  onAddToCart,
}: ShopViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // featured / sortOrder
      result.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleWhatsApp = (productName: string) => {
    const text = `Hello Cole World Furniture & Interior Designs, I would like to enquire/order about ${productName}.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-[#e7e5e4] pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Online Store</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917] mt-1">Furniture Catalogue</h1>
        <p className="text-sm text-[#78716c] mt-2">Browse our complete collection of handcrafted furniture pieces. Order directly via WhatsApp.</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#e7e5e4] shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search furniture (e.g. sofa, bed, desk)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309] transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#1c1917] text-white'
                : 'bg-[#faf9f6] text-[#44403c] border border-[#e7e5e4] hover:bg-[#f5f5f4]'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1c1917] text-white'
                  : 'bg-[#faf9f6] text-[#44403c] border border-[#e7e5e4] hover:bg-[#f5f5f4]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#78716c]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-full bg-[#faf9f6] border border-[#e7e5e4] text-xs font-medium text-[#44403c] focus:outline-none focus:border-[#b45309]"
          >
            <option value="featured">Featured / Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#e7e5e4] space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#faf5ed] text-[#b45309] flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#1c1917]">No Furniture Found</h3>
          <p className="text-sm text-[#78716c] max-w-md mx-auto">
            {products.length === 0 
              ? "The store currently has no products published. You can add items through the Admin Center."
              : "No products match your current search or category filter. Try clearing your search query."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2.5 rounded-full bg-[#1c1917] text-white text-xs font-semibold hover:bg-[#b45309] transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
            const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Furniture';
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelectProduct(product)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#f5f5f4]">
                  <img
                    src={product.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-[#1c1917] shadow-xs">
                      {categoryName}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-xs ${
                      product.availability === 'In Stock' ? 'bg-emerald-800 text-white' : 'bg-amber-800 text-white'
                    }`}>
                      {product.availability}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product.id);
                    }}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-[#1c1917] hover:bg-white shadow-md transition-all"
                    title={favorites.includes(product.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'text-rose-600 fill-rose-600' : 'text-[#44403c]'}`} />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#1c1917] group-hover:text-[#b45309] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#78716c] line-clamp-2 mt-1.5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#f5f5f4]">
                    <div>
                      <span className="text-xs text-[#78716c] block">Price</span>
                      <span className="font-serif font-bold text-lg text-[#1c1917]">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="p-2.5 rounded-full bg-[#faf9f6] border border-[#d6d3d1] text-[#1c1917] hover:bg-[#e7e5e4] transition-colors shadow-2xs"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsApp(product.name);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba5a] transition-all shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
