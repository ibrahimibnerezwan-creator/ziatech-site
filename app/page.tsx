import Link from 'next/link'
import { getNewArrivals, getFlashSaleProducts } from '@/lib/data'
import { Hero } from '@/components/layout/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FlashSale } from '@/components/home/flash-sale'
import { NewArrivals } from '@/components/home/new-arrivals'
import { ArrowRight, BookOpen, MessageSquare } from 'lucide-react'

export const revalidate = 60

export default async function Home() {
  const [newProducts, flashProducts] = await Promise.all([getNewArrivals(6), getFlashSaleProducts(4)])
  return <>
    <Hero />
    <div id="components" className="store-container parts-floor">
      <CategoryGrid />
      <div className="parts-catalogue"><NewArrivals products={newProducts} /><FlashSale products={flashProducts} /></div>
    </div>
    <section className="workshop-support">
      <div className="store-container support-counter">
        <MessageSquare size={34} strokeWidth={1.3} />
        <div><h2>Stuck on a part?</h2><p>Send us the part number or tell us what you&apos;re building.</p></div>
        <Link href="/contact" className="shop-button shop-button-dark">Ask the workshop <ArrowRight size={18} /></Link>
        <Link href="/blog" className="workshop-guides"><BookOpen size={24} strokeWidth={1.4} /><span>Learn as you build<strong>Explore project guides</strong></span><ArrowRight size={18} /></Link>
      </div>
    </section>
  </>
}
