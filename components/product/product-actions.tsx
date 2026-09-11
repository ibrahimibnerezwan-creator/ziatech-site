"use client";

import React, { useState } from "react";
import { ShoppingCart, Heart, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { CheckoutModal } from "@/components/product/CheckoutModal";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    stock: number;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addItem, items } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    const existingItem = items.find((i) => i.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity + qty > product.stock) {
      toast.error(`আপনি ইতিমধ্যে ${currentQuantity} টি কার্টে যোগ করেছেন। স্টকে আর নেই।`);
      return;
    }

    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        stock: product.stock,
      });
    }

    toast.success(`${product.name} (${qty} টি) কার্টে যোগ করা হয়েছে`);
  };

  const handleWishlist = () => {
    toast.success(`${product.name} উইশলিস্টে সেভ করা হয়েছে`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("লিংক কপি করা হয়েছে!");
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("লিংক কপি করা হয়েছে!");
    }
  };

  return (
    <>
      <div className="space-y-3 pt-2">
        {/* Quantity and Actions Bar */}
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-white/10 rounded-xl bg-white/[0.03] overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={product.stock === 0}
              className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 font-bold transition-colors disabled:opacity-40"
            >
              -
            </button>
            <span className="w-10 text-center font-mono font-bold text-white text-sm">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              disabled={product.stock === 0}
              className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 font-bold transition-colors disabled:opacity-40"
            >
              +
            </button>
          </div>

          {/* Instant Buy Now Button */}
          <Button
            size="lg"
            className="flex-1 h-11 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
            disabled={product.stock === 0}
            onClick={() => setCheckoutOpen(true)}
          >
            <Zap className="w-4 h-4 fill-black" />
            {product.stock === 0 ? "স্টক শেষ" : "সরাসরি অর্ডার করুন (Buy Now)"}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs rounded-xl"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            কার্টে যোগ করুন
          </Button>

          <Button
            variant="outline"
            className="w-10 h-10 p-0 border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 rounded-xl"
            onClick={handleWishlist}
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className="w-10 h-10 p-0 border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-400 rounded-xl"
            onClick={handleShare}
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
          }}
          initialQuantity={qty}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </>
  );
}
