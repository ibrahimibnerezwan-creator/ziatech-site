import { getNewArrivals, getFlashSaleProducts } from '@/lib/data'
import { Hero } from '@/components/layout/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FlashSale } from '@/components/home/flash-sale'
import { NewArrivals } from '@/components/home/new-arrivals'
import { Footer } from '@/components/layout/footer'

export const revalidate = 60;

export default async function Home() {
  const [newProducts, flashProducts] = await Promise.all([
    getNewArrivals(4),
    getFlashSaleProducts(4),
  ])

  return (
    <div className="flex flex-col">
      <Hero />

      {/* Section Divider */}
      <div className="relative py-8">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/15 to-transparent" />
      </div>

      <CategoryGrid />

      <div className="relative py-6">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/10 to-transparent" />
      </div>

      <FlashSale products={flashProducts} />

      <div className="relative py-4">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/10 to-transparent" />
      </div>

      <NewArrivals products={newProducts} />

      <div className="h-16" />
      <Footer />
    </div>
  )
}
