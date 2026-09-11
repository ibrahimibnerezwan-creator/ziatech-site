"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: Array<{ id: string; url: string }>;
  name: string;
  isFeatured?: boolean;
  comparePrice?: number | null;
  price: number;
}

export function ProductGallery({
  images,
  name,
  isFeatured,
  comparePrice,
  price,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex]?.url || "/placeholder.png";

  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

  return (
    <div className="space-y-4">
      {/* Main Large Display */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 backdrop-blur-xl group flex items-center justify-center p-6 shadow-2xl">
        <Image
          src={activeImage}
          alt={name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          priority
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isFeatured && (
            <Badge className="bg-amber-400 text-black font-bold text-xs shadow-md">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="font-bold text-xs shadow-md">
              -{discount}% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* Multi-Image Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white/[0.02] border transition-all shrink-0 p-1 flex items-center justify-center ${
                  isSelected
                    ? "border-cyan-500 shadow-md shadow-cyan-500/20 ring-2 ring-cyan-500/30"
                    : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={`${name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
