"use client";

import React, { useState } from 'react';
import { X, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface AddMediaModalProps {
  productId: string;
  onClose: () => void;
  onMediaAdded: () => void;
}

// Client-side scaling helper for instant uploads & small payload sizes
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

export default function AddMediaModal({ productId, onClose, onMediaAdded }: AddMediaModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stepMsg, setStepMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMsg('');
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMsg('');

    try {
      setStepMsg('🗜️ Optimizing image...');
      const canvas = await fileToScaledCanvas(selectedFile, 1400);
      const compressedBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85)
      );

      const safeName = selectedFile.name.replace(/\.[^.]+$/, '.jpg');

      setStepMsg('🔐 Securing upload authorization...');
      const urlRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: safeName,
          contentType: 'image/jpeg',
        }),
      });

      if (!urlRes.ok) {
        throw new Error('Upload authentication failed. Check admin session.');
      }

      const { uploadUrl, publicUrl } = await urlRes.json();

      setStepMsg('☁️ Storing photo in Cloudflare R2...');
      const r2Res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: compressedBlob,
      });

      if (!r2Res.ok) {
        throw new Error('Direct R2 upload failed.');
      }

      setStepMsg('💾 Linking photo to product...');
      const mediaRes = await fetch('/api/products/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          url: publicUrl,
          type: 'image',
        }),
      });

      if (!mediaRes.ok) {
        throw new Error('Failed to attach image to product catalog.');
      }

      onMediaAdded();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setStepMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18110b] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-400" />
            Add Product Photo
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {previewUrl ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
              <Image src={previewUrl} alt="Preview" fill className="object-contain" />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-700/80 hover:border-orange-500/50 rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all group">
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-orange-400 mb-2 transition-colors" />
                <p className="text-sm font-semibold text-slate-300 group-hover:text-white">
                  Select photo to add
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Automatic compression to max 1400px / JPEG 85%
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          )}

          {isUploading && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{stepMsg || 'Uploading...'}</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            Attach Photo
          </button>
        </div>
      </div>
    </div>
  );
}
