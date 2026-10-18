import React from 'react';
import { Category, Product } from '../types';
import { ArrowUpRight, Grid } from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  products: Product[];
  setCurrentView: (view: string) => void;
  onSelectProduct: (product: Product) => void;
}

export function CategoriesView({ categories, setCurrentView }: CategoriesViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="border-b border-[#e7e5e4] pb-8 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Collections</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917]">Shop by Category</h1>
        <p className="text-sm text-[#78716c]">Discover our exquisitely crafted furniture categories designed for sophisticated living and working spaces.</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => { setCurrentView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group relative h-96 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-[#e7e5e4]"
          >
            <img
              src={cat.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/90 via-[#1c1917]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-3">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl">{cat.name}</h3>
              <p className="text-sm text-[#d6d3d1] max-w-lg leading-relaxed">{cat.description}</p>
              <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-[#f59e0b] group-hover:underline">
                <span>Browse {cat.name} Catalogue</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
