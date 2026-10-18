import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, LogOut, Lock, Mail, Phone, ShoppingBag, Heart, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { User, Order, Product } from '../types';
import { motion } from 'motion/react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenFavorites: () => void;
}

export function AccountModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  products,
  onSelectProduct,
  onOpenFavorites,
}: AccountModalProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoadingOrders(true);
      fetch(`/api/orders?userId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch(err => {
          console.error('Failed to fetch orders', err);
          setLoadingOrders(false);
        });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
    const payload = isSignup ? { name, email, phone, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      onLoginSuccess(data);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    }
  };

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#faf9f6] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#e7e5e4]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#e7e5e4]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#1c1917] text-white flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#1c1917]">
                {currentUser ? 'Customer Account' : isSignup ? 'Create Account' : 'Customer Login'}
              </h2>
              <p className="text-xs text-[#78716c]">
                {currentUser ? currentUser.email : 'Cole World Furniture & Interior Designs'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#78716c] hover:bg-[#f5f5f4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!currentUser ? (
            <div className="space-y-4">
              <div className="flex rounded-xl bg-[#e7e5e4] p-1">
                <button
                  type="button"
                  onClick={() => { setIsSignup(false); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    !isSignup ? 'bg-white text-[#1c1917] shadow-xs' : 'text-[#78716c]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignup(true); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isSignup ? 'bg-white text-[#1c1917] shadow-xs' : 'text-[#78716c]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isSignup && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#44403c] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Samuel Pam"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d6d3d1] rounded-xl text-sm focus:outline-none focus:border-[#1c1917]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#44403c] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 08030000000"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d6d3d1] rounded-xl text-sm focus:outline-none focus:border-[#1c1917]"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#44403c] mb-1">Email Address</label>
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
                  <label className="block text-xs font-medium text-[#44403c] mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d6d3d1] rounded-xl text-sm focus:outline-none focus:border-[#1c1917]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-[#1c1917] text-white font-medium text-sm hover:bg-[#b45309] transition-colors shadow-sm"
                >
                  {isSignup ? 'Create Account' : 'Log In'}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-4 bg-white rounded-xl border border-[#e7e5e4] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1c1917]">{currentUser.name}</h3>
                    <p className="text-xs text-[#78716c]">{currentUser.email} {currentUser.phone ? `• ${currentUser.phone}` : ''}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e7e5e4]">
                  <button
                    onClick={() => { onClose(); onOpenFavorites(); }}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#faf9f6] border border-[#d6d3d1] hover:bg-[#f5f5f4] text-xs font-medium text-[#1c1917] transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                    <span>Saved Favorites ({currentUser.favorites?.length || 0})</span>
                  </button>
                  <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#faf9f6] border border-[#d6d3d1] text-xs font-medium text-[#1c1917]">
                    <ShoppingBag className="w-4 h-4 text-[#b45309]" />
                    <span>{orders.length} Orders Placed</span>
                  </div>
                </div>
              </div>

              {/* Order & Payment History */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#1c1917] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#b45309]" />
                  <span>Order & Payment History</span>
                </h3>

                {loadingOrders ? (
                  <p className="text-xs text-[#78716c] text-center py-6">Loading your orders...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-xl border border-[#e7e5e4] p-4 space-y-2">
                    <ShoppingBag className="w-8 h-8 text-[#a8a29e] mx-auto" />
                    <p className="text-sm font-medium text-[#1c1917]">No orders yet</p>
                    <p className="text-xs text-[#78716c]">Your completed WhatsApp and Paystack orders will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 bg-white rounded-xl border border-[#e7e5e4] space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-semibold text-[#78716c]">#{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                            order.paymentStatus === 'success' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : order.paymentStatus === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {order.paymentStatus.toUpperCase()} ({order.paymentMethod.toUpperCase()})
                          </span>
                        </div>

                        <div className="text-xs text-[#44403c] space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-semibold">{formatNaira(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#e7e5e4] flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#78716c]">Total Amount:</span>
                          <span className="text-[#b45309]">{formatNaira(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
