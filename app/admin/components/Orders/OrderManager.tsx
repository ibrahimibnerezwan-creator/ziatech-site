"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  RotateCcw,
  Trash2,
  Phone,
  MessageCircle,
  Loader2,
  Search,
  Truck,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
}

interface OrderRow {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  shippingCity: string;
  amount: number;
  deliveryCharge: number;
  paymentMethod: string;
  trxId: string | null;
  paymentStatus: string;
  trackingCode: string | null;
  status: string;
  rawStatus: string;
  productTitle: string;
  productImageUrl: string | null;
  items: OrderItem[];
  createdAt: string;
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('880') && digits.length >= 13) return '0' + digits.slice(3);
  if (digits.startsWith('0')) return digits;
  return digits;
}

function formatWhatsAppLink(phone: string, orderId: string, name: string): string {
  const digits = phone.replace(/\D/g, '');
  const bdNumber = digits.startsWith('0') ? '880' + digits.slice(1) : digits.startsWith('880') ? digits : '880' + digits;
  const msg = encodeURIComponent(`Hi ${name}! Thank you for your order at ZiaTech (Order #${orderId.slice(-6).toUpperCase()}). We are preparing your shipment!`);
  return `https://wa.me/${bdNumber}?text=${msg}`;
}

export default function OrderManager({ refreshKey }: { refreshKey?: number }) {
  const [ordersList, setOrdersList] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setOrdersList(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]);

  // Periodic polling every 60s
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) fetchOrders();
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus.toLowerCase(), rawStatus: newStatus } : o))
        );
      } else {
        alert('Failed to update order status');
      }
    } catch {
      alert('Network error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string, customerName: string) => {
    if (!confirm(`Delete order from ${customerName}? This will permanently remove this record.`)) return;

    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrdersList((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        alert('Failed to delete order.');
      }
    } catch {
      alert('Error deleting order.');
    }
  };

  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchesSearch =
        o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone?.includes(searchTerm) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.trackingCode?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'ALL' || o.rawStatus.toUpperCase() === selectedStatus.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [ordersList, searchTerm, selectedStatus]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: ordersList.length, PENDING: 0, PROCESSING: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 };
    for (const o of ordersList) {
      const s = o.rawStatus?.toUpperCase();
      if (map[s] !== undefined) map[s]++;
    }
    return map;
  }, [ordersList]);

  return (
    <div className="space-y-6">
      {/* Search & Status Pill Filters */}
      <div className="bg-[#111927] border border-slate-800 rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, phone, order ID..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto p-1">
          {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedStatus === st
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{st}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedStatus === st ? 'bg-slate-950/30 text-slate-950 font-mono' : 'bg-slate-800 text-slate-300'}`}>
                {counts[st] || 0}
              </span>
            </button>
          ))}

          <button
            onClick={fetchOrders}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition ml-1"
            title="Reload orders"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#111927] border border-slate-800 rounded-3xl p-16 text-center text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-600">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No orders found</h3>
          <p className="text-xs text-slate-500">
            {searchTerm || selectedStatus !== 'ALL'
              ? 'Try changing your search term or filter pill.'
              : 'Customer orders will appear here as soon as they are placed.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-[#111927]/90 border border-slate-800/80 hover:border-cyan-500/30 rounded-3xl p-5 md:p-6 backdrop-blur-xl transition-all duration-200 space-y-4 shadow-lg group"
              >
                {/* Top Row: Customer & Order ID & Status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {order.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-base leading-tight">
                          {order.customerName}
                        </h3>
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
                    {/* Status Dropdown */}
                    <div className="relative inline-flex items-center">
                      <select
                        value={order.rawStatus.toUpperCase()}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`h-9 px-3 pr-8 rounded-xl text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer focus:outline-none transition border ${
                          order.rawStatus.toUpperCase() === 'DELIVERED'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : order.rawStatus.toUpperCase() === 'SHIPPED'
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                            : order.rawStatus.toUpperCase() === 'PROCESSING'
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                            : order.rawStatus.toUpperCase() === 'CANCELLED'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        <option value="PENDING" className="bg-slate-900 text-amber-300">PENDING</option>
                        <option value="PROCESSING" className="bg-slate-900 text-cyan-300">PROCESSING</option>
                        <option value="SHIPPED" className="bg-slate-900 text-blue-300">SHIPPED</option>
                        <option value="DELIVERED" className="bg-slate-900 text-emerald-300">DELIVERED</option>
                        <option value="CANCELLED" className="bg-slate-900 text-rose-300">CANCELLED</option>
                      </select>
                      <div className="absolute right-2.5 pointer-events-none text-slate-400">
                        {updatingId === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : '▼'}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(order.id, order.customerName)}
                      className="p-2 bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 rounded-xl transition"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Middle Grid: Items Summary & Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {/* Items List */}
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Ordered Products ({order.items?.length || 1})
                    </p>
                    <div className="space-y-1.5 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-2 py-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-mono font-bold flex items-center justify-center text-cyan-400 shrink-0">
                                ×{item.quantity}
                              </span>
                              <span className="text-slate-200 font-medium truncate">{item.productName}</span>
                            </div>
                            <span className="font-mono text-slate-400 shrink-0">
                              ৳{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-300 font-medium">{order.productTitle}</div>
                      )}
                    </div>
                  </div>

                  {/* Delivery & Payment Info */}
                  <div className="space-y-2 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Contact & Shipping
                    </p>
                    <div className="space-y-1 text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-cyan-300 font-bold">{order.phone}</span>
                        <div className="flex items-center gap-1.5">
                          {/* Call shortcut */}
                          <a
                            href={`tel:${order.phone}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Call customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          {/* WhatsApp shortcut */}
                          <a
                            href={formatWhatsAppLink(order.phone, order.id, order.customerName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <p className="text-slate-400 line-clamp-2 leading-relaxed">
                        {order.address}, <span className="text-slate-200 font-semibold">{order.shippingCity}</span>
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 uppercase font-mono">Payment:</span>
                        <span className="font-bold text-amber-400 uppercase">
                          {order.paymentMethod} {order.trxId ? `(Trx: ${order.trxId})` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Total & Courier Tracking */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-800/80 bg-slate-900/20 -mx-5 -mb-5 px-5 py-3 rounded-b-3xl">
                  {/* Courier Tracking */}
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    {order.trackingCode ? (
                      <a
                        href={`https://steadfast.com.bd/t/${order.trackingCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg hover:border-cyan-400 transition"
                      >
                        Steadfast: {order.trackingCode} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No courier tracking code yet</span>
                    )}
                  </div>

                  {/* Financial Total */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">Total payable:</span>
                    <span className="text-lg font-mono font-bold text-white tracking-tight">
                      ৳{order.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      (incl. ৳{order.deliveryCharge || 60} delivery)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
