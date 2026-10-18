import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { StoreBusiness } from '../types';

interface ContactViewProps {
  whatsappNumber: string;
  business?: StoreBusiness;
}

export function ContactView({ whatsappNumber, business }: ContactViewProps) {
  const businessName = business?.name || 'Cole World Furniture & Interior Designs';
  const businessAddress = business?.address || 'No. 10 St Saviour Avenue, Lendere Kabong, Jos 930105, Plateau, Nigeria';
  const displayPhone = business?.phone || '0706 571 2674';
  const [visitorName, setVisitorName] = React.useState('');
  const [visitorMessage, setVisitorMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitMessage('');
    const whatsappWindow = window.open('about:blank', '_blank');
    const text = `Hello ${businessName}, my name is ${visitorName}. ${visitorMessage}`;
    try {
      if (!supabase) throw new Error('The enquiry service is not configured.');
      const { error: saveError } = await supabase.from('enquiries').insert({
        full_name: visitorName.trim(),
        category: 'General',
        subject: 'Website enquiry',
        message: visitorMessage.trim(),
        preferred_contact: 'WhatsApp',
        status: 'new',
      });
      if (saveError) throw saveError;
      setSubmitMessage('Your enquiry has been recorded. Opening WhatsApp so you can contact our team too.');
    } catch (error) {
      console.error('Failed to record contact enquiry:', error);
      setSubmitMessage('We could not save the enquiry just now. Opening WhatsApp so you can still contact our team.');
    } finally {
      setSubmitting(false);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = whatsappUrl;
      } else {
        setSubmitMessage(current => current + ' If WhatsApp did not open, use the WhatsApp contact button on this page.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-[#e7e5e4] pb-8 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917]">Contact {businessName}</h1>
        <p className="text-sm text-[#78716c]">We are ready to assist you with furniture orders, custom woodwork, and interior design consultations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#e7e5e4] shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-2xl text-[#1c1917]">Showroom & Office</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#b45309]/10 text-[#b45309] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-base text-[#1c1917]">Address</h4>
                <p className="text-sm text-[#57534e] mt-1 leading-relaxed">
                  {businessName}<br />
                  {businessAddress.split(', ').map((part, index) => <React.Fragment key={`${part}-${index}`}>{index > 0 && <br />}{part}</React.Fragment>)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-base text-[#1c1917]">WhatsApp & Phone</h4>
                <p className="text-sm text-[#57534e] mt-1">
                  <a href={`tel:${whatsappNumber}`} className="hover:text-[#b45309] font-medium block">
                    {displayPhone}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1c1917]/10 text-[#1c1917] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-base text-[#1c1917]">Working Hours</h4>
                <p className="text-sm text-[#57534e] mt-1">
                  Monday – Saturday: 8:00 AM – 6:00 PM<br />
                  Sunday: By Appointment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick WhatsApp Inquiry Form */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e7e5e4] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#b45309]">Instant Message</span>
            <h3 className="font-serif font-bold text-2xl text-[#1c1917] mt-1">Send a WhatsApp Inquiry</h3>
            <p className="text-sm text-[#78716c] mt-1">Fill out the quick form below to start a WhatsApp conversation with our team.</p>
          </div>

          {submitMessage && <p role="status" className="text-sm text-[#57534e] bg-[#faf9f6] border border-[#e7e5e4] rounded-xl p-3">{submitMessage}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Your Name</label>
              <input
                type="text"
                required
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403c] mb-1">Your Enquiry / Message</label>
              <textarea
                required
                rows={4}
                value={visitorMessage}
                onChange={(e) => setVisitorMessage(e.target.value)}
                placeholder="I would like to enquire about..."
                className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] text-sm focus:outline-none focus:border-[#b45309]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#25D366] text-white font-semibold text-base shadow-md hover:bg-[#20ba5a] transition-all disabled:opacity-60"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>{submitting ? 'Recording Enquiry...' : 'Send Message on WhatsApp'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
