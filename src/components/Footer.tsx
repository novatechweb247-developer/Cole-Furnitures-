import React from 'react';
import { Phone, MessageSquare, MapPin, Armchair, ChevronRight } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  whatsappNumber: string;
}

export function Footer({ setCurrentView, whatsappNumber }: FooterProps) {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Cole World Furniture & Interior Designs, I would like to enquire about your furniture items and interior design services.")}`, '_blank');
  };

  return (
    <footer className="bg-[#1c1917] text-[#e7e5e4] pt-16 pb-12 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#292524]">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#b45309] text-white flex items-center justify-center font-serif font-bold text-lg">
                CW
              </div>
              <div>
                <span className="block font-serif font-bold text-lg text-white">
                  Cole World
                </span>
                <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#a8a29e]">
                  Furniture & Interiors
                </span>
              </div>
            </div>
            <p className="text-sm text-[#a8a29e] leading-relaxed">
              Crafting premium luxury furniture and offering bespoke interior design solutions for homes and executive spaces in Jos and across Nigeria.
            </p>
            <div className="pt-2">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#20ba5a] transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-white text-base tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'shop', label: 'Shop Furniture' },
                { id: 'categories', label: 'Categories' },
                { id: 'about', label: 'About Brand' },
                { id: 'services', label: 'Interior Design Services' },
                { id: 'contact', label: 'Contact Us' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => { setCurrentView(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-[#a8a29e] hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#b45309] group-hover:translate-x-0.5 transition-transform" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Address */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-white text-base tracking-wide">
              Our Location
            </h3>
            <div className="flex items-start gap-3 text-sm text-[#a8a29e]">
              <MapPin className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Cole World Furniture & Interior Designs</p>
                <p className="mt-1">No. 10 St Saviour Avenue,</p>
                <p>Lendere Kabong,</p>
                <p>Jos 930105, Plateau, Nigeria</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-white text-base tracking-wide">
              Direct Contact
            </h3>
            <div className="space-y-3 text-sm text-[#a8a29e]">
              <a
                href={`tel:${whatsappNumber}`}
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#b45309]" />
                <span>0706 571 2674</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: 0706 571 2674</span>
              </a>
              <div className="pt-2 text-xs text-[#78716c]">
                Working Hours: Mon - Sat: 8:00 AM - 6:00 PM
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716c] gap-4">
          <p>© {new Date().getFullYear()} Cole World Furniture & Interior Designs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Jos, Plateau State, Nigeria</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
