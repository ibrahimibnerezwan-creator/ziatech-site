import { getAllCategoriesWithCount } from '@/lib/data'
import { CategoryGridClient } from './category-grid-client'

export async function CategoryGrid() {
  const categories = await getAllCategoriesWithCount()
  if (!categories.length) return null
  return <section className="store-container category-section" aria-labelledby="categories-heading">
    <div className="category-intro"><h2 id="categories-heading">Find your starting point.</h2><p>Browse by category</p></div>
    <CategoryGridClient categories={categories} />
  </section>
}
