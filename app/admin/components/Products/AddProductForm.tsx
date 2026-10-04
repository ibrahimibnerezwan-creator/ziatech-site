"use client";
import { uploadImage } from '@/lib/upload-client';

import React, { useEffect, useRef, useState } from 'react';
import { Plus, Loader2, Sparkles, Check, UploadCloud, X } from 'lucide-react';
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
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to prepare this photo. Please choose another image.');
  context.drawImage(drawSource, 0, 0, canvas.width, canvas.height);
  if (typeof ImageBitmap !== 'undefined' && drawSource instanceof ImageBitmap) drawSource.close();
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
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const analysisRequest = useRef<AbortController | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMsg || successMsg) {
      feedbackRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
      feedbackRef.current?.focus({ preventScroll: true });
    }
  }, [errorMsg, successMsg]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/ai/describe-product', { cache: 'no-store', signal: controller.signal })
      .then(async response => response.ok ? response.json() : null)
      .then(data => { if (!controller.signal.aborted) setAiAvailable(data?.available === true); })
      .catch(() => { /* Manual product entry remains available if this check fails. */ });
    return () => { controller.abort(); analysisRequest.current?.abort(); };
  }, []);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const stopAnalysis = () => {
    analysisRequest.current?.abort();
    analysisRequest.current = null;
    setIsAnalyzing(false);
  };

  const analyzeImageWithAI = async (file: File) => {
    stopAnalysis();
    const controller = new AbortController();
    analysisRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 20000);
    setIsAnalyzing(true);
    setAiMessage('');
    try {
      // 800px scaled canvas payload keeps base64 lightweight and fast
      const canvas = await fileToScaledCanvas(file, 800);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64 = dataUrl.split(',')[1];

      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error('AI assistance unavailable');
      }

      const data = await res.json();
      if (analysisRequest.current !== controller) return;
      if (typeof data.title === 'string') setTitle(current => current || data.title);
      if (typeof data.description === 'string') setDescription(current => current || data.description);
      if (typeof data.category === 'string') setCategory(current => current || data.category);
      if (data.specs) {
        setSpecs(current => current || (typeof data.specs === 'string' ? data.specs : JSON.stringify(data.specs, null, 2)));
      }
      setAiMessage('AI suggestions added to empty fields. Check the details before publishing.');
    } catch {
      if (analysisRequest.current === controller) {
        setAiMessage('AI সহায়তা এখন পাওয়া যাচ্ছে না। নাম ও দাম লিখে Publish Product to Catalog চাপুন—পণ্য সেভ হবে।');
      }
    } finally {
      clearTimeout(timeout);
      if (analysisRequest.current === controller) {
        analysisRequest.current = null;
        setIsAnalyzing(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopAnalysis();
    setAiMessage('');
    setErrorMsg('');
    setSuccessMsg('');
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Optional AI assistance is triggered explicitly by the administrator.
  };

  const handleRegenerate = () => {
    if (selectedFile && aiAvailable && !isPublishing) analyzeImageWithAI(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublishing) return;
    setErrorMsg('');
    setSuccessMsg('');
    if (!title.trim() || !price || !selectedFile) {
      setErrorMsg('Product name, price, and a photo are required.');
      return;
    }
    if (comparePrice !== '' && Number(comparePrice) < Number(price)) {
      setErrorMsg('Compare price cannot be lower than the selling price. ছাড় না থাকলে Compare Price খালি রাখুন।');
      return;
    }

    stopAnalysis();
    setIsPublishing(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Client-side canvas compression (max 1400px, JPEG 85%)
      setUploadStep('🗜️ Preparing image...');
      const canvas = await fileToScaledCanvas(selectedFile, 1400);
      const compressedBlob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Unable to prepare this photo. Please choose another image.')), 'image/jpeg', 0.85)
      );

      const safeName = selectedFile.name.replace(/\.[^.]+$/, '.jpg');

      setUploadStep('Uploading photo...');
      const publicUrl = await uploadImage(compressedBlob, safeName);

      // 4. Save to Turso DB via /api/products
      setUploadStep('💾 Saving product...');
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
      setAiMessage('');
      setIsFeatured(false);

      onProductAdded();
    } catch (err) {
      console.error(err);
      setErrorMsg((err instanceof Error ? err.message : '') || 'Error publishing product.');
    } finally {
      setIsPublishing(false);
      setUploadStep('');
    }
  };

  return (
    <div className="bg-[#18110b] border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6 relative overflow-hidden">
      {/* Top highlight bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400" />

      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-orange-400" />
          Add New Component
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          ছবি, পণ্যের নাম ও দাম দিন। তারপর নিচের Publish Product to Catalog বাটন চাপুন। AI ছাড়াই পণ্য সেভ করা যাবে।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo Upload Area */}
        <div>
          <label htmlFor="product-photo" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Primary Photo <span className="text-orange-400">*</span>
          </label>

          {previewUrl ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group">
              <Image src={previewUrl} alt="Preview" fill className="object-contain" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  aria-label="Remove photo"
                  disabled={isPublishing}
                  onClick={() => {
                    stopAnalysis();
                    setAiMessage('');
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="p-3 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl backdrop-blur-md transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 text-orange-300 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 animate-bounce text-amber-400" />
                  <span>Preparing optional AI suggestions...</span>
                </div>
              )}
            </div>
          ) : (
            <label htmlFor="product-photo" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700/80 hover:border-orange-500/50 rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all group">
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Choose component photo
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  JPG, PNG, WebP or GIF
                </p>
              </div>
            </label>
          )}
          <input
            id="product-photo"
            type="file"
            className="sr-only"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            onClick={event => { event.currentTarget.value = ''; }}
            disabled={isPublishing}
          />
          {previewUrl && aiAvailable && (
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isAnalyzing || isPublishing}
              className="mt-3 min-h-11 w-full px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-orange-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Fill details with AI (optional)
            </button>
          )}
          {aiMessage && <p role="status" className="mt-3 text-xs leading-relaxed text-slate-300">{aiMessage}</p>}
        </div>

        {/* Product Title */}
        <div>
          <label htmlFor="product-name" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Component Name <span className="text-orange-400">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. ESP32-WROOM-32D Development Board"
            required
            className="w-full h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-orange-400 focus:outline-none"
          />
        </div>

        {/* Pricing & Stock Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="product-price" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Price (৳) <span className="text-orange-400">*</span>
            </label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 450"
              required
              min="0"
              step="any"
              className="w-full h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-mono text-sm focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="product-compare-price" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Compare Price (৳)
            </label>
            <input
              id="product-compare-price"
              type="number"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              placeholder="MSRP / Regular"
              min="0"
              step="any"
              aria-describedby="product-compare-price-help"
              className="w-full h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-mono text-sm focus:border-orange-400 focus:outline-none"
            />
            <p id="product-compare-price-help" className="mt-2 text-xs leading-relaxed text-slate-400">
              ঐচ্ছিক। ছাড় থাকলে আগের বেশি দাম দিন; ছাড় না থাকলে খালি রাখুন। সমান দামেও সেভ হবে।
            </p>
          </div>

          <div>
            <label htmlFor="product-stock" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Stock Quantity
            </label>
            <input
              id="product-stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              min="0"
              className="w-full h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-mono text-sm focus:border-orange-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="product-category" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <div className="flex gap-2">
            <input
              id="product-category"
              type="text"
              list="cat-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Select or enter category..."
              className="flex-1 min-w-0 h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:border-orange-400 focus:outline-none"
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
          <label htmlFor="product-description" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Technical Description
          </label>
          <textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Key features, applications, and operating parameters..."
            className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:border-orange-400 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
          <input
            type="checkbox"
            id="featuredToggle"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-orange-500 bg-slate-800 border-slate-700 focus:ring-orange-400"
          />
          <label htmlFor="featuredToggle" className="text-xs text-slate-300 font-medium cursor-pointer select-none">
            Highlight on Storefront Homepage (Featured Badge)
          </label>
        </div>

        {/* Upload Status */}
        {isPublishing && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded-xl text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{uploadStep || 'Publishing...'}</span>
          </div>
        )}

        {(errorMsg || successMsg) && (
          <div ref={feedbackRef} tabIndex={-1} className="rounded-2xl focus:outline-none">
            {errorMsg ? (
              <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl text-sm flex items-center justify-between gap-3">
                <span>{errorMsg}</span>
                <button type="button" aria-label="Dismiss error" onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-white">✕</button>
              </div>
            ) : (
              <div role="status" className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl text-sm flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPublishing || !title || !price || !selectedFile}
          className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving product...
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
