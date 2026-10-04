import type { ProductForCard } from '@/lib/data'
import { ProductCard } from '@/components/product/product-card'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export function NewArrivals({ products }: { products: ProductForCard[] }) {
  if (!products.length) return null
  return <section className="store-container product-section" aria-labelledby="products-heading">
    <div className="section-heading"><div><h2 id="products-heading">Ready for your next build.</h2><p>Discover the latest additions to our workbench.</p></div><Link href="/category/all" className="text-link">All components <ArrowUpRight size={18} /></Link></div>
    <div className={`product-grid ${products.length > 3 ? 'product-grid-four' : ''}`}>
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  </section>
}
