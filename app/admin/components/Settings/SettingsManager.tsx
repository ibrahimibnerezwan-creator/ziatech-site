"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Loader2, Store, Phone, MessageCircle, Mail, MapPin, CreditCard, Truck, Share2 } from 'lucide-react';

export default function SettingsManager() {
  const [errorMsg, setErrorMsg] = useState('');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings?t=' + Date.now())
      .then((res) => { if(!res.ok) throw new Error('Unable to load settings. Please sign in again.'); return res.json(); })
      .then((data) => {
        if (data && typeof data === 'object') setSettings(data);
      })
      .catch(e => setErrorMsg(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccessMsg('Settings saved successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const body = await res.json().catch(()=>({})); setErrorMsg(body.error || 'Failed to save settings.');
      }
    } catch {
      setErrorMsg('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p role="status" className="text-orange-300">Loading store settings…</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[#18110b] border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-400" />
            Store Settings & Integrations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure hotline, bKash merchant accounts, Steadfast Courier keys, and store identity.
          </p>
        </div>

        {successMsg && (
          <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            {successMsg}
          </span>
        )}
      </div>

      {errorMsg && <p role="alert" className="text-red-300">{errorMsg}</p>}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity & Contact */}
        <div className="bg-[#18110b] border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Store className="w-4 h-4 text-orange-400" />
            Store Identity & Contact Lines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName ?? ''}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Customer Hotline Phone</label>
              <input
                type="text"
                value={settings.phone ?? ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Official WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp ?? ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Support Email</label>
              <input
                type="email"
                value={settings.email ?? ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Warehouse / Store Physical Address</label>
              <input
                type="text"
                value={settings.address ?? ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payments & MFS Accounts */}
        <div className="bg-[#18110b] border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4 text-amber-400" />
            Mobile Banking & Payment Receivers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">bKash Merchant / Personal No.</label>
              <input
                type="text"
                value={settings.bkash_number ?? ''}
                onChange={(e) => handleChange('bkash_number', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Nagad Merchant / Personal No.</label>
              <input
                type="text"
                value={settings.nagad_number ?? ''}
                onChange={(e) => handleChange('nagad_number', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Steadfast Courier Integration */}
        <div className="bg-[#18110b] border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Truck className="w-4 h-4 text-orange-400" />
            Steadfast Courier API Keys
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Steadfast API Key</label>
              <input
                type="text"
                value={settings.steadfast_api_key ?? ''}
                onChange={(e) => handleChange('steadfast_api_key', e.target.value)}
                placeholder="c5hrdhmpssren..."
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Steadfast Secret Key</label>
              <input
                type="password"
                value={settings.steadfast_secret_key ?? ''}
                onChange={(e) => handleChange('steadfast_secret_key', e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold rounded-2xl text-sm transition flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
