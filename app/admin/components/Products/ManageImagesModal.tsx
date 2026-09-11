"use client";

import React, { useState } from 'react';
import { X, Trash2, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ProductImage {
  id: string;
  url: string;
}

interface ProductItem {
  id: string;
  name: string;
  images: ProductImage[];
}

interface ManageImagesModalProps {
  product: ProductItem;
  onClose: () => void;
  onImageDeleted: () => void;
}

export default function ManageImagesModal({ product, onClose, onImageDeleted }: ManageImagesModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (imageId: string) => {
    if (product.images.length <= 1) {
      setErrorMsg("A product must keep at least 1 image. Please add another image first before deleting this one.");
      return;
    }

    if (!confirm("Are you sure you want to delete this photo? This cannot be undone.")) return;

    setDeletingId(imageId);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/products/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onImageDeleted();
      } else {
        setErrorMsg(data.error || "Failed to delete image.");
      }
    } catch {
      setErrorMsg("Network error deleting photo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111927] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              Manage Product Photos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {product.images.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No photos currently uploaded for this product.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {product.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group"
                >
                  <Image
                    src={img.url}
                    alt={`Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {/* Photo Index Tag */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-white">
                    #{idx + 1}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={deletingId === img.id || product.images.length <= 1}
                    className={`absolute top-2 right-2 p-2 rounded-xl backdrop-blur-md transition-all ${
                      product.images.length <= 1
                        ? 'bg-black/40 text-slate-500 cursor-not-allowed'
                        : 'bg-rose-500/80 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                    }`}
                    title={product.images.length <= 1 ? "Cannot delete the last remaining photo" : "Delete photo"}
                  >
                    {deletingId === img.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>{product.images.length} photo(s) total</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
