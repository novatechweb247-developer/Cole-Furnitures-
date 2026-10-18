import React from 'react';
import { MapPin, Phone, MessageSquare, ShieldCheck, CheckCircle } from 'lucide-react';

interface AboutViewProps {
  whatsappNumber: string;
}

export function AboutView({ whatsappNumber }: AboutViewProps) {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Cole World Furniture & Interior Designs, I would like to make an enquiry about your brand and services.")}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-[#e7e5e4] pb-8 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Brand Story</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917]">About Cole World Furniture & Interior Designs</h1>
        <p className="text-sm text-[#78716c]">Crafting sophistication and comfort from Jos, Plateau State, Nigeria.</p>
      </div>

      {/* Main Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-14 rounded-3xl border border-[#e7e5e4] shadow-xs">
        <div className="space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Established Excellence</span>
          <h2 className="text-3xl font-serif font-bold text-[#1c1917]">
            Handcrafted Furniture & Bespoke Interior Solutions
          </h2>
          <p className="text-base text-[#57534e] leading-relaxed">
            Cole World Furniture & Interior Designs is dedicated to bringing sophistication, comfort, and durability to homes and offices. Based at No. 10 St Saviour Avenue, Lendere Kabong, Jos, Plateau, Nigeria, we pride ourselves on exceptional woodworking, premium upholstery, and personalized interior styling tailored to our clients' unique tastes.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
              <span className="text-sm text-[#1c1917] font-medium">Bespoke furniture fabrication for living rooms, bedrooms, and offices</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
              <span className="text-sm text-[#1c1917] font-medium">Professional interior design and spatial planning services</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
              <span className="text-sm text-[#1c1917] font-medium">Reliable customer support and direct ordering via WhatsApp</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"
              alt="Furniture Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-[#1c1917] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">Visit Our Showroom</span>
          <h3 className="text-2xl font-serif font-bold">Cole World Furniture & Interior Designs</h3>
          <div className="flex items-start gap-2 text-sm text-[#d6d3d1]">
            <MapPin className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
            <span>No. 10 St Saviour Avenue, Lendere Kabong, Jos 930105, Plateau, Nigeria</span>
          </div>
        </div>
        <div>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20ba5a] transition-all shadow-lg"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Contact on WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
}
