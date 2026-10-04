'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'
import { WishlistButton } from './wishlist-button'
import { toast } from 'sonner'
import { useCart } from '@/lib/cart-context'
import { CheckoutModal } from './CheckoutModal'

interface Product {
  id: string; name: string; slug?: string; price: number; oldPrice?: number;
  image: string; category: string; rating: number; reviews: number; isNew?: boolean; stock: number
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const discount = product.oldPrice && product.oldPrice > product.price ? Math.round((product.oldPrice - product.price) / product.oldPrice * 100) : 0
  const productUrl = `/product/${product.slug || product.id}`
  function addToCart() {
    const quantity = items.find(item => item.id === product.id)?.quantity || 0
    if (quantity >= product.stock) { toast.error(`You already have all ${product.stock} available units in your cart.`); return }
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug || '', stock: product.stock })
    toast.success(`${product.name} কার্টে যোগ করা হয়েছে`)
  }
  return <>
    <article className="product-card">
      <Link href={productUrl} aria-label={product.name} className="product-card-link">
        <div className="product-image-link"><img src={product.image || '/placeholder.svg'} alt={product.name} loading="lazy" width="400" height="300" /></div>
        <div className="product-details">
          <p className="product-category">{product.category && product.category !== 'Uncategorized' ? product.category : 'Electronics & components'}</p>
          <h3 className="product-title">{product.name}</h3>
          <div className="product-meta"><span className={`stock-label${product.stock > 0 ? '' : ' stock-label-out'}`}>{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>{product.reviews > 0 && <span className="product-rating"><Star size={11} />{product.rating} ({product.reviews})</span>}</div>
          <div className="product-price"><strong>৳{product.price.toLocaleString()}</strong>{discount > 0 && <del>৳{product.oldPrice?.toLocaleString()}</del>}</div>
        </div>
      </Link>
      {discount > 0 && <span className="product-badge">Save {discount}%</span>}
      <WishlistButton id={product.id} className="wishlist-control" />
      <div className="product-card-actions">
        <button className="quick-buy" disabled={product.stock <= 0} onClick={() => setCheckoutOpen(true)}>{product.stock <= 0 ? 'স্টক আউট' : 'অর্ডার করুন'}</button>
        <button className="add-cart" onClick={addToCart} disabled={product.stock <= 0} title="কার্টে যোগ করুন" aria-label="কার্টে যোগ করুন"><ShoppingBag size={18} /></button>
      </div>
    </article>
    {checkoutOpen && <CheckoutModal product={{ id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock }} onClose={() => setCheckoutOpen(false)} />}
  </>
}
