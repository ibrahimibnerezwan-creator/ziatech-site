'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Search, 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ChevronRight, 
  Phone, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string | null;
}

export interface OrderRecord {
  id: string;
  shortId?: string;
  customerName?: string;
  customerPhone?: string;
  shippingCity?: string;
  address?: string;
  total: number;
  deliveryCharge?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  status: string;
  courierTrackingId?: string | null;
  createdAt: string | Date;
  items: OrderItem[];
}

interface OrdersClientProps {
  initialOrders: OrderRecord[];
  isLoggedIn: boolean;
}

export default function OrdersClient({ initialOrders, isLoggedIn }: OrdersClientProps) {
  const [support, setSupport] = useState('');
  useEffect(()=>{fetch('/api/settings').then(r=>r.json()).then(s=>setSupport((s.whatsapp||s.phone||'').replace(/\D/g,'').replace(/^0/,'880'))).catch(()=>{});},[]);
  const [phone, setPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedOrders, setSearchedOrders] = useState<OrderRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setError('সঠিক মোবাইল নম্বর বা অর্ডার আইডি লিখুন (কমপক্ষে ৩ অক্ষর)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(searchQuery.trim())}&phone=${encodeURIComponent(phone)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'অর্ডার ট্র্যাক করতে সমস্যা হয়েছে');
      }

      if (!data.orders || data.orders.length === 0) {
        setError(data.message || 'কোনো অর্ডার পাওয়া যায়নি। মোবাইল নম্বর বা অর্ডার আইডি সঠিক কিনা যাচাই করুন।');
        setSearchedOrders([]);
      } else {
        setSearchedOrders(data.orders);
      }
    } catch (err) {
      setError((err instanceof Error ? err.message : '') || 'অর্ডার খুঁজে পাওয়া যায়নি');
    } finally {
      setLoading(false);
    }
  };

  const displayedOrders = searchedOrders !== null ? searchedOrders : initialOrders;

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case 'PENDING':
        return <span className="text-xs text-amber-800">অর্ডার গ্রহণ করা হয়েছে (Awaiting confirmation)</span>;
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> ডেলিভার্ড (Delivered)
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Truck className="w-3.5 h-3.5" /> কুরিয়ারে পাঠানো হয়েছে (Shipped)
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-700">
            <XCircle className="w-3.5 h-3.5" /> বাতিল (Cancelled)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/30 text-primary-400">
            <Clock className="w-3.5 h-3.5" /> প্রসেসিং চলছে (Processing)
          </span>
        );
    }
  };

  return (
    <div className="min-h-[60vh] pt-10 pb-16 px-4 bg-bg-elevated text-text-primary">
      <div className="container mx-auto max-w-4xl relative">
        {/* Ambient Glow */}

        {/* Header Title */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" /> অর্ডার ট্র্যাকিং ও হিস্ট্রি
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            অর্ডার ট্র্যাক করুন <span className="text-primary-400">/ Track Order</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            আপনার মোবাইল নম্বর এবং সম্পূর্ণ অর্ডার আইডি দিয়ে সরাসরি বর্তমান স্ট্যাটাস জানুন।
          </p>
        </div>

        {/* Search / Track Box */}
        <div className="bg-bg-elevated border border-orange-500/20 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Full order ID" placeholder="Full order ID from your confirmation"
                className="w-full pl-12 pr-4 py-3.5 bg-bg-primary border border-line rounded-xl text-text-primary placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <input aria-label="Order phone number" type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Order phone number" className="min-w-0 px-4 py-3 bg-bg-primary border border-line rounded-xl text-text-primary" />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-none active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" /> ট্র্যাক করুন
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Orders List */}
        {displayedOrders.length === 0 ? (
          <div className="bg-bg-elevated border border-line rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-primary-400/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">কোনো অর্ডার পাওয়া যায়নি</h3>
            <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
              আপনার সঠিক ফোন নম্বর এবং সম্পূর্ণ অর্ডার আইডি দিয়ে উপরে সার্চ করুন, অথবা আমাদের স্টোর থেকে নতুন অর্ডার করুন।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                পণ্য দেখুন <ChevronRight className="w-4 h-4" />
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-bg-elevated hover:bg-bg-elevated text-text-primary font-medium text-xs uppercase tracking-wider rounded-xl border border-line transition-colors"
                >
                  লগইন করুন
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={order.id}
                  className="bg-bg-elevated border border-orange-500/20 hover:border-orange-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-none relative overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-primary-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums font-bold text-text-primary text-base">
                            #{order.shortId || order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-xs text-text-secondary">• {formattedDate}</span>
                        </div>
                        {order.customerName && (
                          <p className="text-xs text-text-secondary">গ্রাহক: {order.customerName}</p>
                        )}
                      </div>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center justify-between gap-3 text-sm bg-bg-primary p-2.5 rounded-xl border border-line"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.image ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-bg-primary shrink-0 border border-line">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-primary-400 shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-text-primary text-xs font-semibold truncate">{item.name}</p>
                            <p className="text-text-secondary text-[11px]">পরিমাণ: {item.quantity} টি</p>
                          </div>
                        </div>
                        <span className="tabular-nums font-bold text-primary-400 text-xs shrink-0">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing & Steadfast Courier Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-line text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-text-secondary block text-[10px] uppercase">সর্বমোট প্রদেয়</span>
                        <span className="text-primary-400 font-bold tabular-nums text-base">
                          ৳{order.total.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-[10px] uppercase">পেমেন্ট মোড</span>
                        <span className="text-text-primary font-medium uppercase">{order.paymentMethod || 'COD'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.courierTrackingId ? (
                        <a
                          href={`https://steadfast.com.bd/tracking/${order.courierTrackingId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-primary-400 font-semibold transition-colors text-xs"
                        >
                          <Truck className="w-3.5 h-3.5" /> Steadfast ট্র্যাক ({order.courierTrackingId})
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      ) : (
                        <span className="text-text-muted italic text-[11px]">ডিসপ্যাচের অপেক্ষায়</span>
                      )}

                      <a
                        href={`https://wa.me/${support}?text=${encodeURIComponent(`Hello Zia's Tech Shop! I want to check my order #${order.shortId || order.id.slice(0, 8)}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-700 font-semibold transition-colors text-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> সাহায্য নিন
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
