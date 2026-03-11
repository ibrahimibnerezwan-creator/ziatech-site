import { getNewArrivals, getFlashSaleProducts } from '@/lib/data'
import { Hero } from '@/components/layout/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FlashSale } from '@/components/home/flash-sale'
import { NewArrivals } from '@/components/home/new-arrivals'
import { Footer } from '@/components/layout/footer'

export const revalidate = 60; // ISR: cache for 60s, then revalidate in background

export default async function Home() {
  const [newProducts, flashProducts] = await Promise.all([
    getNewArrivals(4),
    getFlashSaleProducts(4),
  ])

  return (
    <div className="flex flex-col gap-10">
      <Hero />

      <div className="h-0 md:h-10" />
      <CategoryGrid />

      <FlashSale products={flashProducts} />
      <NewArrivals products={newProducts} />

      <div className="h-20" />
      <Footer />
    </div>
  )
}
