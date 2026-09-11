"use client";

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Package,
  ShoppingCart,
  Zap,
  Tag,
  MessageSquare,
  FolderOpen,
  Settings,
  LogOut,
  RefreshCw,
  Loader2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import ProductManager from './Products/ProductManager';
import OrderManager from './Orders/OrderManager';
import QuickOrder from './QuickOrder/QuickOrder';
import LabelManager from './Labels/LabelManager';
import ReviewManager from './Reviews/ReviewManager';
import CategoryManager from './Categories/CategoryManager';
import SettingsManager from './Settings/SettingsManager';

interface AdminLayoutProps {
  onLogout: () => void;
}

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<
    'products' | 'orders' | 'quick-order' | 'labels' | 'reviews' | 'categories' | 'settings'
  >('products');

  // Steadfast Sync State
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  // Refresh counters
  const [productRefreshKey, setProductRefreshKey] = useState(0);
  const [orderRefreshKey, setOrderRefreshKey] = useState(0);

  // Badge counts
  const [ordersPendingCount, setOrdersPendingCount] = useState(0);
  const [reviewsPendingCount, setReviewsPendingCount] = useState(0);

  const fetchBadges = () => {
    fetch('/api/admin/orders?t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrdersPendingCount(data.filter((o) => o.rawStatus === 'PENDING').length);
        }
      })
      .catch(() => {});

    fetch('/api/admin/reviews?t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviewsPendingCount(data.filter((r) => r.status === 'pending').length);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBadges();
  }, [orderRefreshKey]);

  const handleSyncSteadfast = async () => {
    setIsSyncingOrders(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/admin/sync-orders', { method: 'POST' });
      const data = await res.json();
      if (data.message) {
        setSyncMsg(data.message);
      } else {
        setSyncMsg('Steadfast courier status check complete.');
      }
      setOrderRefreshKey((prev) => prev + 1);
    } catch {
      setSyncMsg('Steadfast sync request failed.');
    } finally {
      setIsSyncingOrders(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <header className="bg-[#111927]/90 border border-slate-800/80 rounded-3xl p-5 md:px-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  ZiaTech <span className="text-cyan-400">HQ</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-[10px] font-mono">
                  v2.0 • Production
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Electronics & Maker Logistics Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-between md:justify-end">
            {/* Sync Steadfast Button */}
            <button
              onClick={handleSyncSteadfast}
              disabled={isSyncingOrders}
              className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs rounded-xl transition flex items-center gap-2 disabled:opacity-50"
              title="Poll Steadfast Courier API for delivery updates"
            >
              {isSyncingOrders ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              )}
              Sync Steadfast
            </button>

            {/* View Live Store */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              Live Store
            </a>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-slate-900 hover:bg-rose-500/10 border border-slate-700/80 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </header>

        {/* Sync Alert Banner */}
        {syncMsg && (
          <div className="px-5 py-3 bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 rounded-2xl text-xs flex justify-between items-center shadow-lg">
            <span>{syncMsg}</span>
            <button onClick={() => setSyncMsg(null)} className="text-cyan-400 hover:text-white ml-3">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <nav className="flex gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'products', label: 'Manage Products', icon: Package, badge: 0 },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: ordersPendingCount },
            { id: 'quick-order', label: 'Quick Order', icon: Zap, badge: 0 },
            { id: 'labels', label: 'Print Labels', icon: Tag, badge: 0 },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare, badge: reviewsPendingCount },
            { id: 'categories', label: 'Categories', icon: FolderOpen, badge: 0 },
            { id: 'settings', label: 'Store Settings', icon: Settings, badge: 0 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-[#111927]/60 hover:bg-[#111927] text-slate-400 hover:text-white border border-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-slate-950 text-cyan-300' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Tab View */}
        <main className="transition-all duration-200">
          {activeTab === 'products' && <ProductManager refreshKey={productRefreshKey} />}
          {activeTab === 'orders' && <OrderManager refreshKey={orderRefreshKey} />}
          {activeTab === 'quick-order' && (
            <QuickOrder
              onOrderCreated={() => {
                setOrderRefreshKey((c) => c + 1);
                setActiveTab('orders');
              }}
            />
          )}
          {activeTab === 'labels' && <LabelManager />}
          {activeTab === 'reviews' && <ReviewManager />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </main>
      </div>
    </div>
  );
}
