import { prisma } from '@/lib/prisma'
import { Hero } from '@/components/layout/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FlashSale } from '@/components/home/flash-sale'
import { NewArrivals } from '@/components/home/new-arrivals'
import { Footer } from '@/components/layout/footer'

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch new arrivals and flash sale products in parallel
  const [newProductsRaw, flashProductsRaw] = await Promise.all([
    prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { images: true, category: true }
    }),
    prisma.product.findMany({
      where: {
        comparePrice: { not: null }
      },
      take: 4,
      include: { images: true, category: true }
    })
  ])

  // Map to ProductCard interface
  const newProducts = newProductsRaw.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.comparePrice || undefined,
    image: p.images[0]?.url || 'https://via.placeholder.com/400',
    category: p.category?.name || 'Uncategorized',
    rating: 0,
    reviews: 0,
    isNew: true,
    stock: p.stock
  }))

  const flashProducts = flashProductsRaw.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.comparePrice || undefined,
    image: p.images[0]?.url || 'https://via.placeholder.com/400',
    category: p.category?.name || 'Uncategorized',
    rating: 0,
    reviews: 0,
    stock: p.stock
  }))

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
