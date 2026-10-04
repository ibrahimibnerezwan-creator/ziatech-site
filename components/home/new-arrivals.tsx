import type { ProductForCard } from '@/lib/data'
import { ProductCard } from '@/components/product/product-card'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export function NewArrivals({ products }: { products: ProductForCard[] }) {
  if (!products.length) return null
  return <section className="bench-products" aria-labelledby="products-heading">
    <div className="section-heading"><div><h2 id="products-heading">On the bench.</h2><p>The latest components in the shop.</p></div><Link href="/category/all" className="text-link">View the catalogue <ArrowUpRight size={18} /></Link></div>
    <div className="product-grid">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  </section>
}
