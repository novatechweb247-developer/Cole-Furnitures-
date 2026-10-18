import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, MessageSquare, CreditCard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CartItem, User, Order } from '../types';
import { motion } from 'motion/react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentUser: User | null;
  whatsappNumber: string;
  onOrderSuccess: (order: Order) => void;
  clearCart: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  currentUser,
  whatsappNumber,
  onOrderSuccess,
  clearCart,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [loadingPaystack, setLoadingPaystack] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paystackPubKey, setPaystackPubKey] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  useEffect(() => {
    // Fetch Paystack public key
    fetch('/api/paystack/pubkey')
      .then(res => res.json())
      .then(data => {
        if (data.publicKey) setPaystackPubKey(data.publicKey);
      })
      .catch(err => console.error('Failed to load Paystack pubkey', err));
  }, []);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG');
  };

  // Option 1: Order via WhatsApp
  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      setErrorMsg('Please fill in your name, phone number, and delivery address.');
      return;
    }
    setErrorMsg('');

    try {
      // Save order to backend as whatsapp order
      const orderPayload = {
        userId: currentUser?.id || null,
        customerName,
        email: email || 'guest@coleworldfurniture.com',
        phone,
        address,
        items: cart.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0] || ''
        })),
        subtotal,
        total: subtotal,
        paymentMethod: 'whatsapp'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const order = await res.json();

      // Format WhatsApp message
      const itemsList = cart.map(i => `• ${i.product.name} (Qty: ${i.quantity}) - ${formatNaira(i.product.price * i.quantity)}`).join('\n');
      const text = `*NEW ORDER - COLE WORLD FURNITURE*\n\n*Customer Details:*\nName: ${customerName}\nPhone: ${phone}\nAddress: ${address}\n\n*Order Items:*\n${itemsList}\n\n*Total:* ${formatNaira(subtotal)}\n\n*Payment Choice:* Order via WhatsApp`;

      onOrderSuccess(order);
      clearCart();
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order');
    }
  };

  // Option 2: Pay Securely with Paystack
  const handlePaystackCheckout = async () => {
    if (!customerName || !email || !phone || !address) {
      setErrorMsg('Please fill in your name, email, phone number, and delivery address.');
      return;
    }
    setErrorMsg('');
    setLoadingPaystack(true);

    try {
      const orderData = {
        userId: currentUser?.id || null,
        customerName,
        email,
        phone,
        address,
        items: cart.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0] || ''
        })),
        subtotal,
        total: subtotal
      };

      // 1. Initialize Paystack on server
      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: subtotal,
          orderData
        })
      });
      const initData = await initRes.json();

      if (!initRes.ok) {
        throw new Error(initData.error || 'Failed to initialize Paystack payment');
      }

      const { reference, orderId } = initData;

      // 2. Open Paystack Inline Pop-up if window.PaystackPop is available
      if (window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: paystackPubKey || 'pk_test_b4bfa2804b4c7980b188092289c0deea1394d07d',
          email,
          amount: Math.round(subtotal * 100),
          currency: 'NGN',
          ref: reference,
          callback: async function (response: any) {
            // Verify on server
            try {
              const verifyRes = await fetch('/api/paystack/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference: response.reference })
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                onOrderSuccess(verifyData.order);
                clearCart();
                alert('Payment successful! Your order has been placed and confirmed.');
                onClose();
              } else {
                alert('Payment verification failed.');
              }
            } catch (err) {
              console.error('Verification error', err);
            } finally {
              setLoadingPaystack(false);
            }
          },
          onClose: function () {
            setLoadingPaystack(false);
            alert('Transaction was closed.');
          }
        });
        handler.openIframe();
      } else {
        // Fallback to authorization_url redirect if inline is not loaded
        if (initData.authorization_url) {
          window.location.href = initData.authorization_url;
        } else {
          throw new Error('Paystack pop-up loader unavailable');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Paystack payment initialization error');
      setLoadingPaystack(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#faf9f6] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#e7e5e4]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#e7e5e4]">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#1c1917]">Secure Checkout</h2>
            <p className="text-xs text-[#78716c]">Cole World Furniture & Interior Designs</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#78716c] hover:bg-[#f5f5f4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Details Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#78716c]">
              1. Delivery & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#44403c] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Dr. Samuel Pam"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d6d3d1] rounded-xl text-sm focus:outline-none focus:border-[#1c1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#44403c] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08030000000"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d6d3d1] rounded-xl text-sm focus:outline-none focus:border-[#1c1917]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#44403c] mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. samuel@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#d6d3d1] rounded-xl text-sm focus:outline-none focus:border-[#1c1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#44403c] mb-1">Delivery Address (Jos or Nationwide) *</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. No. 12 Rayfield GRA, Jos, Plateau State"
                className="w-full px-3.5 py-2.5 bg-white border border-[#d6d3d1] rounded-xl text-sm focus:outline-none focus:border-[#1c1917]"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-white rounded-xl border border-[#e7e5e4] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716c]">Order Summary</h4>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs text-[#44403c]">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="font-semibold">{formatNaira(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#e7e5e4] flex justify-between font-serif font-bold text-sm text-[#1c1917]">
              <span>Total Amount</span>
              <span className="text-[#b45309]">{formatNaira(subtotal)}</span>
            </div>
          </div>

          {/* TWO PAYMENT OPTIONS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#78716c]">
              2. Choose Your Payment / Ordering Method
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {/* Option 1: WhatsApp */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white border-2 border-[#25D366]/60 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1c1917] group-hover:text-[#1b9a4c]">
                      Option 1: Order Through WhatsApp
                    </h4>
                    <p className="text-xs text-[#78716c]">
                      Send your pre-filled order directly to {whatsappNumber}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1.5 bg-[#25D366] text-white rounded-lg shadow-2xs">
                  Order via WhatsApp
                </span>
              </button>

              {/* Option 2: Paystack */}
              <button
                onClick={handlePaystackCheckout}
                disabled={loadingPaystack}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white border-2 border-[#091133]/20 hover:border-[#091133] hover:bg-[#091133]/5 transition-all group text-left cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#091133] text-white flex items-center justify-center shrink-0 shadow-sm">
                    {loadingPaystack ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CreditCard className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1c1917] group-hover:text-[#091133]">
                      Option 2: Pay Securely with Paystack
                    </h4>
                    <p className="text-xs text-[#78716c]">
                      Pay online with Card, Bank Transfer, or USSD (Verified instantly)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1.5 bg-[#091133] text-white rounded-lg shadow-2xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pay Online
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
