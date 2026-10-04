import { ArrowUpRight, Tag } from 'lucide-react'
import type { ProductForCard } from '@/lib/data'
import Link from 'next/link'

export function FlashSale({ products }: { products: ProductForCard[] }) {
  const offer = products.find(p => p.oldPrice && p.oldPrice > p.price && p.stock > 0)
  if (!offer || !offer.oldPrice) return null
  return <section id="offers" className="offer-section" aria-label="Current offer">
    <div className="offer-band">
      <div className="offer-label"><Tag size={22} /><strong>Bench deal</strong></div>
      <div className="offer-product"><span>Save ৳{(offer.oldPrice - offer.price).toLocaleString()}</span><h2>{offer.name}</h2></div>
      <div className="offer-price"><strong>৳{offer.price.toLocaleString()}</strong><del>৳{offer.oldPrice.toLocaleString()}</del></div>
      <Link className="shop-button shop-button-white" href={`/product/${offer.slug || offer.id}`}>Take a look <ArrowUpRight size={18} /></Link>
    </div>
  </section>
}
