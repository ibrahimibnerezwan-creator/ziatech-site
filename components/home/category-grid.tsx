import { getAllCategoriesWithCount } from '@/lib/data'
import { CategoryGridClient } from './category-grid-client'
import Link from 'next/link'
import { Banknote, Truck, Package } from 'lucide-react'

export async function CategoryGrid() {
  const categories = await getAllCategoriesWithCount()
  return <aside className="parts-index" aria-labelledby="categories-heading">
    <h2 id="categories-heading">Parts index</h2>
    <Link href="/category/all" className="index-all">Browse all components <span>↗</span></Link>
    <CategoryGridClient categories={categories} />
    <div className="workshop-delivery">
      <Link href="/shipping"><Truck size={18} /><span>Across Bangladesh<small>Delivery starts at ৳60</small></span></Link>
      <Link href="/shipping"><Banknote size={18} /><span>Cash on delivery<small>Pay when it arrives</small></span></Link>
      <Link href="/my-orders"><Package size={18} /><span>Track your order</span></Link>
    </div>
  </aside>
}
