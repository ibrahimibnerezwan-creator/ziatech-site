"use client";

import React, { useState, useEffect } from 'react';
import { Printer, Tag, CheckSquare, Square, Package, ExternalLink } from 'lucide-react';

interface OrderRow {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  shippingCity: string;
  amount: number;
  paymentMethod: string;
  trackingCode: string | null;
  productTitle: string;
  rawStatus: string;
}

export default function LabelManager() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders?t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter to active orders needing shipment
          const active = data.filter((o: OrderRow) => o.rawStatus !== 'DELIVERED' && o.rawStatus !== 'CANCELLED');
          setOrders(active);
          setSelectedIds(new Set(active.map((o: OrderRow) => o.id)));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.id)));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedOrders = orders.filter((o) => selectedIds.has(o.id));

  return (
    <div className="space-y-6">
      {/* Control Bar (Hidden when printing) */}
      <div className="print:hidden bg-[#18110b] border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-orange-400" />
            Courier Packing Slips & Shipping Labels
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Print ready-to-stick address labels formatted for Steadfast Courier packaging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            {selectedIds.size === orders.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={handlePrint}
            disabled={selectedOrders.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-500/20"
          >
            <Printer className="w-4 h-4" /> Print {selectedOrders.length} Label(s)
          </button>
        </div>
      </div>

      {/* Order Selector List (Hidden when printing) */}
      <div className="print:hidden bg-[#18110b] border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Select Orders to Print ({selectedOrders.length} selected)
        </h3>

        {orders.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">No active shipments awaiting labels.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {orders.map((order) => {
              const isSelected = selectedIds.has(order.id);
              return (
                <div
                  key={order.id}
                  onClick={() => toggleSelect(order.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 select-none ${
                    isSelected
                      ? 'bg-orange-950/20 border-orange-500/40 text-white'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <button type="button" className="text-orange-400 shrink-0">
                    {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                  </button>
                  <div className="min-w-0 text-xs">
                    <p className="font-bold text-white truncate">{order.customerName}</p>
                    <p className="text-slate-400 font-mono text-[11px] truncate">
                      {order.phone} • ৳{order.amount} ({order.paymentMethod.toUpperCase()})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Sheet (Visible in Print + Preview) */}
      <div className="bg-white text-black p-4 sm:p-8 rounded-3xl print:p-0 print:rounded-none print:bg-white shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">
          {selectedOrders.map((order) => {
            const isPrepaid = order.paymentMethod !== 'cod';
            return (
              <div
                key={order.id}
                className="border-2 border-black p-4 rounded-xl print:rounded-none print:border-black space-y-3 relative text-black bg-white"
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-2">
                  <div>
                    <h4 className="font-black text-base tracking-tight leading-none uppercase">ZIA TECH SHOP</h4>
                    <p className="text-[10px] text-gray-700 mt-0.5">Electronics & Maker Hardware • Agargaon, Dhaka</p>
                    <p className="text-[10px] font-mono text-gray-700">Hotline: +880 1712-345678</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-black text-white font-mono font-bold text-[10px] uppercase rounded">
                      {order.paymentMethod.toUpperCase()}
                    </span>
                    <p className="font-mono text-[10px] font-bold mt-1">#{order.id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="space-y-1 text-xs">
                  <p className="text-[10px] font-bold text-gray-600 uppercase">Deliver To:</p>
                  <p className="font-black text-sm text-black">{order.customerName}</p>
                  <p className="font-mono font-bold text-sm text-black">{order.phone}</p>
                  <p className="text-xs text-gray-900 leading-snug">
                    {order.address}, <strong>{order.shippingCity}</strong>
                  </p>
                </div>

                {/* Contents & Amount */}
                <div className="border-t border-black pt-2 flex justify-between items-end">
                  <div className="max-w-[65%]">
                    <p className="text-[9px] font-bold text-gray-600 uppercase">Package Contents:</p>
                    <p className="text-[11px] font-medium line-clamp-2">{order.productTitle}</p>
                    {order.trackingCode && (
                      <p className="text-[10px] font-mono text-gray-700 mt-0.5">Steadfast: {order.trackingCode}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-600 uppercase">
                      {isPrepaid ? 'PREPAID AMOUNT' : 'COLLECT COD'}
                    </p>
                    <p className="text-xl font-black font-mono">৳{order.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
