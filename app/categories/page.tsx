import { getAllCategoriesWithCount } from '@/lib/data'
import { CategoryGridClient } from '@/components/home/category-grid-client'
import Link from 'next/link'
import { ChevronRight, Layers } from 'lucide-react'

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithCount()
  return <div className="store-container shop-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight /><span>Categories</span></nav>
    <div className="page-heading"><h1>A place to start.</h1><p>Explore our component collections and find the parts for your next idea.</p></div>
    {categories.length ? <CategoryGridClient categories={categories} /> : <div className="empty-state"><Layers size={35} /><h2>More components are on the way</h2><p>Browse the shop or contact us for help finding a part.</p><Link href="/category/all" className="shop-button">Browse components</Link></div>}
  </div>
}
