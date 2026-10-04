"use client"

import { useCart } from '@/lib/cart-context'
import { ShoppingBag, ArrowUpRight, Trash2, Minus, Plus, ChevronRight, Truck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  return <div className="store-container shop-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight /><span>Your cart</span></nav>
    <div className="section-heading"><div className="page-heading"><h1>Your next build starts here.</h1><p>{totalItems} {totalItems === 1 ? 'item' : 'items'} in your shopping cart</p></div>{items.length > 0 && <button className="text-link" onClick={() => confirm('Clear all items from your cart?') && clearCart()}><Trash2 size={15} />Clear cart</button>}</div>
    {items.length === 0 ? <div className="empty-state"><ShoppingBag size={38} /><h2>Your cart is empty</h2><p>Find the right parts and bring your next idea to life.</p><Link href="/category/all" className="shop-button">Explore components <ArrowUpRight size={18} /></Link></div> : <div className="cart-layout">
      <div className="cart-items">{items.map(item => <article className="cart-item" key={item.id}>
        <div className="cart-image"><Image src={item.image || '/placeholder.svg'} alt={item.name} fill sizes="120px" /></div>
        <div className="cart-item-info"><Link href={`/product/${item.slug || item.id}`}>{item.name}</Link><p>৳{item.price.toLocaleString()} each</p><div className="quantity-control"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button><span>{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}><Plus size={14} /></button></div></div>
        <div className="cart-item-total"><strong>৳{(item.price * item.quantity).toLocaleString()}</strong><button aria-label={`Remove ${item.name} from cart`} onClick={() => removeItem(item.id)}><Trash2 size={17} /></button></div>
      </article>)}<Link className="text-link mt-5" href="/category/all">Continue exploring <ArrowUpRight size={16} /></Link></div>
      <aside className="cart-summary"><h2>Order summary</h2><dl><div><dt>Subtotal ({totalItems} items)</dt><dd>৳{totalPrice.toLocaleString()}</dd></div><div><dt>Delivery</dt><dd>Calculated at checkout</dd></div><div className="cart-subtotal"><dt>Subtotal</dt><dd>৳{totalPrice.toLocaleString()}</dd></div></dl><Link className="shop-button" href="/checkout">Proceed to Checkout <ArrowUpRight size={18} /></Link><p><Truck size={16} />Cash on delivery available</p><Link className="cart-delivery-link" href="/shipping">View delivery fees & return policy</Link></aside>
    </div>}
  </div>
}
