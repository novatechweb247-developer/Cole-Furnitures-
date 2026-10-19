import React, { useRef } from 'react';
import { MessageSquare, ArrowRight, ShieldCheck, Sparkles, MapPin, Star, CheckCircle, Phone, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { StoreContent, Product, Category, StoreBusiness } from '../types';
import { motion } from 'motion/react';
import { ScrollPopUp } from './ScrollPopUp';

interface HomeViewProps {
  content: StoreContent;
  products: Product[];
  categories: Category[];
  setCurrentView: (view: string) => void;
  onSelectProduct: (product: Product) => void;
  whatsappNumber: string;
  business?: StoreBusiness;
  gallery?: Array<{ id: string; title: string; category: string; image: string; description: string; sortOrder: number }>;
}

export function HomeView({ content, products, categories, setCurrentView, onSelectProduct, whatsappNumber, business, gallery = [] }: HomeViewProps) {
  const businessName = business?.name || 'Cole World Furniture & Interior Designs';
  const featuredProducts = products.filter(p => p.isFeatured);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleWhatsApp = (productName?: string) => {
    const text = productName 
      ? `Hello Cole World Furniture & Interior Designs, I would like to enquire/order about ${productName}.`
      : `Hello Cole World Furniture & Interior Designs, I would like to make an enquiry about your furniture and interior design services.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative bg-[#1c1917] text-[#faf9f6] overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src={content.promo?.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"}
            alt="Interior Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917] via-[#1c1917]/90 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b45309]/20 border border-[#b45309]/40 text-[#f59e0b] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{business?.address || 'Jos, Plateau State, Nigeria'}</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.15]"
            >
              {content.heroTitle || "Timeless Elegance & Bespoke Interior Design"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base sm:text-lg text-[#d6d3d1] font-sans leading-relaxed"
            >
              {content.heroSubtitle || "Welcome to Cole World Furniture & Interior Designs. Located at No. 10 St Saviour Avenue, Lendere Kabong, Jos, we craft and curate exquisite furniture pieces and transform residential and commercial interiors with unmatched craftsmanship."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => { setCurrentView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#b45309] text-white font-semibold text-base shadow-lg hover:bg-[#92400e] transition-all transform active:scale-95"
              >
                <span>Shop Furniture</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleWhatsApp()}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold text-base shadow-lg hover:bg-[#20ba5a] transition-all transform active:scale-95"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Contact on WhatsApp</span>
              </button>
            </motion.div>

            <div className="pt-6 border-t border-[#292524] flex items-center gap-8 text-xs text-[#a8a29e]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b45309]" />
                <span>Verified Artisan Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#b45309]" />
                <span>{business?.address || 'No. 10 St Saviour Avenue, Jos'}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Curated Selection</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917] mt-1">Featured Products</h2>
          </div>
          <button
            onClick={() => { setCurrentView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1c1917] hover:text-[#b45309] transition-colors group"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e7e5e4]">
            <p className="text-[#78716c]">No featured products available yet. Visit the Admin Center to mark products as Featured.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation buttons for desktop */}
            <div className="hidden md:flex absolute -top-16 right-0 items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-2.5 rounded-full bg-white border border-[#e7e5e4] text-[#1c1917] hover:bg-[#f5f5f4] shadow-xs transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-2.5 rounded-full bg-white border border-[#e7e5e4] text-[#1c1917] hover:bg-[#f5f5f4] shadow-xs transition-colors"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 pt-2 scrollbar-none no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredProducts.map((product) => {
                const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Furniture';
                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group w-[280px] sm:w-[320px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-[#f5f5f4]">
                      <img
                        src={product.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-[#1c1917] shadow-xs">
                          {categoryName}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#1c1917] group-hover:text-[#b45309] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#78716c] line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#f5f5f4]">
                        <span className="font-serif font-bold text-lg text-[#1c1917]">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsApp(product.name);
                          }}
                          className="p-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all shadow-xs"
                          title="Order on WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Spaces & Living</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917] mt-1">Shop by Category</h2>
          <p className="text-sm text-[#78716c] mt-2">Explore handcrafted furniture designed for every corner of your home or office.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => { setCurrentView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-[#e7e5e4]"
            >
              <img
                src={cat.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/90 via-[#1c1917]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                <h3 className="font-serif font-bold text-xl">{cat.name}</h3>
                <p className="text-xs text-[#d6d3d1] line-clamp-2">{cat.description}</p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#f59e0b] group-hover:underline">
                  <span>Browse Category</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About / Brand Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-14 border border-[#e7e5e4] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Our Brand Identity</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917]">
              {content.aboutTitle || "About Cole World Furniture & Interior Designs"}
            </h2>
            <p className="text-base text-[#57534e] leading-relaxed">
              {content.aboutText || "Cole World Furniture & Interior Designs is dedicated to bringing sophistication, comfort, and durability to homes and offices. Based at No. 10 St Saviour Avenue, Lendere Kabong, Jos, Plateau, Nigeria, we pride ourselves on exceptional woodworking, premium upholstery, and personalized interior styling tailored to our clients' unique tastes."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[#1c1917]">Custom Woodworking & Joinery</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[#1c1917]">Residential & Office Interiors</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => { setCurrentView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c1917] text-white text-sm font-medium hover:bg-[#b45309] transition-colors"
              >
                <span>Read More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000"
              alt="Showroom Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Interior Design Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1c1917] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1000"
              alt="Interior Service"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 max-w-xl space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">Bespoke Services</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              {content.interiorDesignTitle || "Professional Interior Design & Spatial Planning"}
            </h2>
            <p className="text-base text-[#d6d3d1] leading-relaxed">
              {content.interiorDesignText || "We offer comprehensive interior design services for homes, corporate offices, hotels, and lounges. From initial spatial layout planning and 3D visualization to bespoke furniture fabrication and final styling, our team ensures every corner reflects elegance and functional harmony."}
            </p>
            <div className="pt-2">
              <button
                onClick={() => { setCurrentView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#b45309] text-white font-semibold text-sm hover:bg-[#92400e] transition-colors"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Excellence Assured</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917] mt-1">Why Choose Us</h2>
          <p className="text-sm text-[#78716c] mt-2">Built on uncompromising standards and dedication to client satisfaction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.whyChooseUs?.map((item, idx) => (
            <div key={item.id || idx} className="bg-white p-8 rounded-2xl border border-[#e7e5e4] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#b45309]/10 text-[#b45309] flex items-center justify-center font-serif font-bold text-lg">
                0{idx + 1}
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1c1917]">{item.title}</h3>
              <p className="text-sm text-[#57534e] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured / Promotional Section */}
      {content.promo && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-[#faf5ed] border border-[#e7e5e4] p-8 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#b45309] text-white text-xs font-semibold uppercase tracking-wider">
                  {content.promo.badge || "New Collection"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917]">
                  {content.promo.title}
                </h2>
                <p className="text-base text-[#57534e] leading-relaxed">
                  {content.promo.subtitle}
                </p>
                <div>
                  <button
                    onClick={() => { setCurrentView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1c1917] text-white font-semibold text-sm hover:bg-[#b45309] transition-colors"
                  >
                    <span>{content.promo.buttonText || "Shop Collection"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={content.promo.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000"}
                  alt="Promotional Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Client Feedback</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917] mt-1">Customer Testimonials</h2>
          <p className="text-sm text-[#78716c] mt-2">Read what our esteemed clients have to say about our furniture and services.</p>
        </div>

        {(!content.testimonials || content.testimonials.length === 0) ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#e7e5e4]">
            <p className="text-sm text-[#78716c]">No testimonials added yet. You can add them through the Admin Center.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.testimonials.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-2xl border border-[#e7e5e4] shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#f59e0b]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-base font-serif italic text-[#1c1917] leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>
                <div className="pt-4 border-t border-[#f5f5f4] flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-[#1c1917]">{t.author}</h3>
                    <p className="text-xs text-[#78716c]">{t.location}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-[#f5f5f4] text-[#57534e]">
                    Verified Client
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Strong WhatsApp CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1c1917] to-[#292524] text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f59e0b]">Direct Assistance</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold">Ready to Elevate Your Space?</h2>
            <p className="text-sm sm:text-base text-[#d6d3d1]">
              Contact {businessName} directly via WhatsApp for custom furniture orders, catalogue enquiries, and interior consultations.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleWhatsApp()}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold text-base shadow-lg hover:bg-[#20ba5a] transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp ({business?.phone || '0706 571 2674'})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
