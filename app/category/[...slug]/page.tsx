import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getProductsByCategory, getAllCategoriesWithCount } from '@/lib/data'
import { CategoryResults } from './category-results'

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ slug: string[] }>; searchParams: Promise<{ q?: string }>
}) {
  const { slug } = await params
  const { q } = await searchParams
  const categorySlug = slug?.[0] || 'all'
  const [{ products, categoryName }, categories] = await Promise.all([getProductsByCategory(categorySlug), getAllCategoriesWithCount()])
  const query = (q || '').trim().toLowerCase()
  const filtered = query ? products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)) : products
  const heading = query ? `Results for "${q}"` : categorySlug === 'all' ? 'The component shop.' : categoryName
  return <div className="store-container shop-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight /><span>{query ? 'Search' : 'Components'}</span></nav>
    <div className="page-heading"><h1>{heading}</h1><p>{query ? `${filtered.length} ${filtered.length === 1 ? 'component' : 'components'} found. Find the right fit for your project.` : 'Good ideas need the right parts. Find yours here.'}</p></div>
    <CategoryResults products={filtered} categories={categories} activeCategory={categorySlug} />
  </div>
}
