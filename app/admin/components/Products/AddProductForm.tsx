"use client";

import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Loader2, Sparkles, RefreshCw, Check, UploadCloud, X, Cpu } from 'lucide-react';
import Image from 'next/image';

interface AddProductFormProps {
  existingCategories: string[];
  onProductAdded: () => void;
}

// Decode and scale canvas for client-side compression
async function fileToScaledCanvas(file: File, maxSize: number): Promise<HTMLCanvasElement> {
  let width: number;
  let height: number;
  let drawSource: CanvasImageSource;

  try {
    const bitmap = await createImageBitmap(file);
    drawSource = bitmap;
    width = bitmap.width;
    height = bitmap.height;
  } catch {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      const url = URL.createObjectURL(file);
      el.onload = () => { URL.revokeObjectURL(url); resolve(el); };
      el.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image could not be decoded')); };
      el.src = url;
    });
    drawSource = img;
    width = img.naturalWidth;
    height = img.naturalHeight;
  }

  if (!width || !height) throw new Error('Image has zero dimensions');
  const scale = Math.min(maxSize / width, maxSize / height, 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext('2d')!.drawImage(drawSource, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export default function AddProductForm({ existingCategories, onProductAdded }: AddProductFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // AI & Upload State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const analyzeImageWithAI = async (file: File) => {
    setIsAnalyzing(true);
    setErrorMsg('');
    try {
      // 800px scaled canvas payload keeps base64 lightweight and fast
      const canvas = await fileToScaledCanvas(file, 800);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64 = dataUrl.split(',')[1];

      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'AI vision service unavailable');
      }

      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.category) setCategory(data.category);
      if (data.specs) {
        setSpecs(typeof data.specs === 'string' ? data.specs : JSON.stringify(data.specs, null, 2));
      }
    } catch (err: any) {
      console.warn('AI analysis skipped/failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Automatically trigger AI Vision description
    analyzeImageWithAI(file);
  };

  const handleRegenerate = () => {
    if (selectedFile) analyzeImageWithAI(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !selectedFile) {
      setErrorMsg('Product name, price, and a photo are required.');
      return;
    }

    setIsPublishing(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Client-side canvas compression (max 1400px, JPEG 85%)
      setUploadStep('🗜️ Optimizing product image...');
      const canvas = await fileToScaledCanvas(selectedFile, 1400);
      const compressedBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85)
      );

      const safeName = selectedFile.name.replace(/\.[^.]+$/, '.jpg');

      // 2. Obtain presigned R2 upload URL
      setUploadStep('🔐 Authorizing Cloudflare storage...');
      const urlRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: safeName, contentType: 'image/jpeg' }),
      });

      if (!urlRes.ok) {
        throw new Error('Upload authorization failed. Session expired?');
      }
      const { uploadUrl, publicUrl } = await urlRes.json();

      // 3. Direct PUT to R2
      setUploadStep('☁️ Uploading directly to R2 bucket...');
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: compressedBlob,
      });

      if (!putRes.ok) {
        throw new Error('Image transfer to Cloudflare failed.');
      }

      // 4. Save to Turso DB via /api/products
      setUploadStep('💾 Registering product in Turso DB...');
      const createRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          comparePrice: comparePrice ? parseFloat(comparePrice) : null,
          stock: parseInt(stock) || 0,
          category: category || 'Components',
          description,
          specs: specs ? specs : null,
          isFeatured,
          images: [publicUrl],
        }),
      });

      if (!createRes.ok) {
        const createData = await createRes.json().catch(() => ({}));
        throw new Error(createData.error || 'Failed to save product record');
      }

      setSuccessMsg('Product added successfully!');
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      setPrice('');
      setComparePrice('');
      setDescription('');
      setSpecs('');
      setIsFeatured(false);

      onProductAdded();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error publishing product.');
    } finally {
      setIsPublishing(false);
      setUploadStep('');
    }
  };

  return (
    <div className="bg-[#111927] border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6 relative overflow-hidden">
      {/* Top highlight bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-amber-400" />

      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-cyan-400" />
          Add New Component
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload hardware photo for automatic AI specs generation & R2 cloud storage.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl text-xs flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-white">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo Upload Area */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Primary Photo <span className="text-cyan-400">*</span>
          </label>

          {previewUrl ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group">
              <Image src={previewUrl} alt="Preview" fill className="object-contain" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-cyan-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition shadow-lg"
                  title="Re-run Gemini AI Vision analysis"
                >
                  {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Re-analyze</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="p-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl backdrop-blur-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 text-cyan-300 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 animate-bounce text-amber-400" />
                  <span>Gemini Vision analyzing component specs...</span>
                </div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700/80 hover:border-cyan-500/50 rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all group">
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Click or drag component photo
                </p>
                <p className="text-[11px] text-cyan-400/80 flex items-center gap-1 mt-1 font-mono">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Auto-detects specs via Gemini Vision
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPublishing}
              />
            </label>
          )}
        </div>

        {/* Product Title */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Component Name <span className="text-cyan-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. ESP32-WROOM-32D Development Board"
            required
            className="w-full h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Pricing & Stock Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Price (৳) <span className="text-cyan-400">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 450"
              required
              min="0"
              step="any"
              className="w-full h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Compare Price (৳)
            </label>
            <input
              type="number"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              placeholder="MSRP / Regular"
              min="0"
              step="any"
              className="w-full h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Stock Quantity
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              min="0"
              className="w-full h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              list="cat-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Select or enter category..."
              className="flex-1 h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
            <datalist id="cat-suggestions">
              {existingCategories.map((c) => (
                <option key={c} value={c} />
              ))}
              <option value="Microcontrollers" />
              <option value="Sensors & Modules" />
              <option value="Robotics & Motors" />
              <option value="Power & Batteries" />
              <option value="Displays" />
              <option value="Tools & Accessories" />
              <option value="Components" />
            </datalist>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Technical Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Key features, applications, and operating parameters..."
            className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
          <input
            type="checkbox"
            id="featuredToggle"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-400"
          />
          <label htmlFor="featuredToggle" className="text-xs text-slate-300 font-medium cursor-pointer select-none">
            Highlight on Storefront Homepage (Featured Badge)
          </label>
        </div>

        {/* Upload Status */}
        {isPublishing && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-xl text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{uploadStep || 'Publishing...'}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPublishing || !title || !price || !selectedFile}
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving to Cloud & Database...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Publish Product to Catalog
            </>
          )}
        </button>
      </form>
    </div>
  );
}
