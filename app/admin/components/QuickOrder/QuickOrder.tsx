"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, Loader2, Sparkles, Phone, MapPin, User, Package } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface QuickOrderProps {
  onOrderCreated: () => void;
}

export default function QuickOrder({ onOrderCreated }: QuickOrderProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('Dhaka');
  const [deliveryCharge, setDeliveryCharge] = useState('60');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/products?t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          if (data.length > 0) setSelectedProductId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const unitPrice = selectedProduct?.price || 0;
  const qty = Math.max(1, parseInt(quantity) || 1);
  const shipCharge = parseFloat(deliveryCharge) || 0;
  const totalAmount = unitPrice * qty + shipCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !customerName || !customerPhone || !address) {
      setMsg({ type: 'error', text: 'Please fill in all required customer details and pick a product.' });
      return;
    }

    setIsSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          address,
          shippingCity,
          deliveryCharge: shipCharge,
          paymentMethod,
          transactionId: trxId || null,
          items: [{ id: selectedProductId, quantity: qty, price: unitPrice }],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Order created successfully! (ID: ${data.orderId.slice(-6).toUpperCase()})` });
        setCustomerName('');
        setCustomerPhone('');
        setAddress('');
        setTrxId('');
        onOrderCreated();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to submit quick order.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error placing order.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#111927] border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-400" />

      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-cyan-400" />
          Quick Order Entry
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Create manual orders for customers who reach out via WhatsApp, phone, or Facebook inbox.
        </p>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}
        >
          {msg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : null}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
              Select Component <span className="text-cyan-400">*</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ৳{p.price} ({p.stock} in stock)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
              Customer Name <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Tanvir Ahmed"
              required
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
              Mobile Number (01X) <span className="text-cyan-400">*</span>
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="01712345678"
              required
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
            Delivery Street Address <span className="text-cyan-400">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House #, Road #, Area / Thana"
            required
            className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* City & Delivery Zone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">City / District</label>
            <input
              type="text"
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
              placeholder="e.g. Dhaka, Chittagong, Sylhet"
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">Delivery Charge (৳)</label>
            <select
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            >
              <option value="60">Inside Dhaka (৳60)</option>
              <option value="100">Dhaka Suburbs (৳100)</option>
              <option value="120">Outside Dhaka (৳120)</option>
              <option value="0">Free Delivery (৳0)</option>
            </select>
          </div>
        </div>

        {/* Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
            </select>
          </div>

          {paymentMethod !== 'cod' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">Transaction ID (TrxID)</label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. 9J28DAK1"
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Calculation summary */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex justify-between items-center text-xs">
          <span className="text-slate-400">Total payable by customer:</span>
          <span className="text-lg font-mono font-bold text-cyan-400">৳{totalAmount.toLocaleString()}</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting & Dispatching...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Place & Dispatch Order
            </>
          )}
        </button>
      </form>
    </div>
  );
}
