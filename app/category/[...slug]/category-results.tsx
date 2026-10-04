'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'

type Product = { id: string; name: string; slug: string; price: number; oldPrice?: number; image: string; category: string; rating: number; reviews: number; stock: number; createdAt?: number; isFeatured?: boolean }
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest'
type Category = { id: string; name: string; slug: string; productCount: number }

export function CategoryResults({ products, categories, activeCategory }: { products: Product[]; categories: Category[]; activeCategory: string }) {
  const [sort, setSort] = useState<SortKey>('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const sorted = useMemo(() => {
    const list = inStockOnly ? products.filter(p => p.stock > 0) : [...products]
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price)
      case 'price-desc': return list.sort((a, b) => b.price - a.price)
      case 'newest': return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      default: return list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    }
  }, [products, sort, inStockOnly])
  return <div className="catalogue-layout">
    <aside className="catalogue-sidebar">
      <h2>Shop by category</h2><nav aria-label="Product categories" className="catalogue-categories">
        <Link href="/category/all" className={`category-filter ${activeCategory === 'all' ? 'active' : ''}`} aria-current={activeCategory === 'all' ? 'page' : undefined}>All components</Link>
        {categories.map(category => <Link key={category.id} href={`/category/${category.slug}`} className={`category-filter ${category.slug === activeCategory ? 'active' : ''}`} aria-current={category.slug === activeCategory ? 'page' : undefined}>{category.name}<span>{category.productCount}</span></Link>)}
      </nav>
      <h2>Availability</h2><label><input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />In Stock Only</label>
      <div className="catalogue-help"><strong>Looking for something?</strong><p>Tell us about the component you need. We&apos;ll help you find your next step.</p><Link href="/contact" className="text-link">Ask us <ArrowUpRight size={14} /></Link></div>
    </aside>
    <div className="catalogue-content">
      <div className="catalogue-toolbar"><p aria-live="polite">{sorted.length} {sorted.length === 1 ? 'component' : 'components'}</p><select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value as SortKey)}><option value="featured">Featured first</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="newest">Newest Arrivals</option></select></div>
      {sorted.length ? <div className="product-grid">{sorted.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><SearchX size={35} /><h2>No components found</h2><p>Try a different search or explore the full catalogue.</p>{inStockOnly && <button className="shop-button shop-button-outline" onClick={() => setInStockOnly(false)}>Show all availability</button>}<Link href="/category/all" className="shop-button">Browse all components</Link></div>}
    </div>
  </div>
}
