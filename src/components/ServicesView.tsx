import React from 'react';
import { StoreBusiness, StoreContent } from '../types';
import { Palette, MessageSquare, CheckCircle, ArrowRight, Shield } from 'lucide-react';

interface ServicesViewProps {
  whatsappNumber: string;
  business?: StoreBusiness;
  content?: StoreContent;
}

export function ServicesView({ whatsappNumber, business, content }: ServicesViewProps) {
  const businessName = business?.name || 'Cole World Furniture & Interior Designs';
  const handleWhatsApp = () => {
    const text = `Hello ${businessName}, I would like to book an interior design consultation.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const servicesList = [
    {
      title: "Residential Interior Styling",
      description: "Transform your living rooms, bedrooms, and dining areas into sanctuaries of comfort and luxury with curated furniture and spatial planning."
    },
    {
      title: "Corporate & Office Fit-Outs",
      description: "Design inspiring workspaces, executive offices, and reception areas that project professionalism, efficiency, and prestige."
    },
    {
      title: "Bespoke Furniture Fabrication",
      description: "Custom-built furniture designed to exact dimensions, wood finishes, and upholstery specifications matching your interior architecture."
    },
    {
      title: "Spatial Layout & 3D Visualization",
      description: "Professional spatial planning and expert color palette harmonization to ensure every square meter is functional and aesthetically pleasing."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-[#e7e5e4] pb-8 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Bespoke Services</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917]">{content?.interiorDesignTitle || 'Interior Design & Spatial Planning'}</h1>
        <p className="text-sm text-[#78716c]">{content?.interiorDesignText || 'Comprehensive design solutions tailored for homes, offices, and commercial lounges in Jos and beyond.'}</p>
      </div>

      {/* Hero Service Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-14 rounded-3xl border border-[#e7e5e4] shadow-xs">
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#b45309]/10 text-[#b45309] flex items-center justify-center">
            <Palette className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1c1917]">
            Professional Interior Design & Spatial Planning
          </h2>
          <p className="text-base text-[#57534e] leading-relaxed">
            {content?.interiorDesignText || 'We offer comprehensive interior design services for homes, corporate offices, hotels, and lounges. From initial spatial layout planning and 3D visualization to bespoke furniture fabrication and final styling, our team ensures every corner reflects elegance and functional harmony.'}
          </p>
          <div className="pt-2">
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20ba5a] transition-all shadow-md"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Book Consultation on WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={content?.visuals?.servicesPageImage || "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1000"}
            alt="Interior Design Studio"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Detailed Services Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917]">Our Core Design Capabilities</h2>
          <p className="text-sm text-[#78716c] mt-2">Executed with precision craftsmanship from our base in Jos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesList.map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-[#e7e5e4] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1c1917] text-white flex items-center justify-center font-serif font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-serif font-bold text-xl text-[#1c1917]">{service.title}</h3>
              </div>
              <p className="text-sm text-[#57534e] leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
