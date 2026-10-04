"use client";

import React, { useState } from "react";
import { ShoppingCart, Share2, Zap } from "lucide-react";
import { WishlistButton } from "./wishlist-button";
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

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast.success('Product link copied.'); }
    catch { window.prompt('Copy this product link:', window.location.href); }
  };

  return (
    <>
      <div className="product-quantity-row">
        <div className="quantity-control">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={product.stock === 0 || qty === 1}>−</button>
          <span aria-live="polite">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={product.stock === 0 || qty >= product.stock}>+</button>
        </div>
        <button className="shop-button" disabled={product.stock === 0} onClick={() => setCheckoutOpen(true)}><Zap size={17} />{product.stock === 0 ? 'স্টক শেষ' : 'সরাসরি অর্ডার করুন (Buy Now)'}</button>
      </div>
      <div className="detail-actions">
        <button disabled={product.stock === 0} onClick={handleAddToCart}><ShoppingCart size={17} />কার্টে যোগ করুন</button>
        <WishlistButton id={product.id} label />
        <button onClick={handleShare} title="Share" aria-label="Share product"><Share2 size={17} /></button>
      </div>
      {checkoutOpen && <CheckoutModal product={{id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock}} initialQuantity={qty} onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
