import Link from 'next/link'
import { getNewArrivals, getFlashSaleProducts } from '@/lib/data'
import { Hero } from '@/components/layout/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FlashSale } from '@/components/home/flash-sale'
import { NewArrivals } from '@/components/home/new-arrivals'
import { ArrowUpRight, Banknote, MessageCircle, Truck, BookOpen } from 'lucide-react'

export const revalidate = 60

export default async function Home() {
  const [newProducts, flashProducts] = await Promise.all([getNewArrivals(4), getFlashSaleProducts(4)])
  return <>
    <Hero />
    <div className="service-strip"><div className="store-container service-grid">
      <Link href="/shipping"><Truck size={23} strokeWidth={1.5} /><span><strong>Nationwide delivery</strong><small>From our shop to you, starting at ৳60</small></span><ArrowUpRight size={16} /></Link>
      <Link href="/shipping"><Banknote size={23} strokeWidth={1.5} /><span><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span><ArrowUpRight size={16} /></Link>
      <Link href="/contact"><MessageCircle size={23} strokeWidth={1.5} /><span><strong>Here to help</strong><small>Talk to us about your project</small></span><ArrowUpRight size={16} /></Link>
    </div></div>
    <CategoryGrid />
    <NewArrivals products={newProducts} />
    <FlashSale products={flashProducts} />
    <section className="store-container help-section">
      <div className="help-panel"><div><span className="help-icon"><CircuitIcon /></span><h2>Great ideas start<br />with a little curiosity.</h2><p>Finding the right component? Planning your first build?<br className="hidden sm:block" /> We&apos;re here to help you take the next step.</p><Link href="/contact" className="shop-button shop-button-dark">Let&apos;s talk about your project <ArrowUpRight size={19} /></Link></div>
      <Link href="/blog" className="guide-link"><BookOpen size={32} strokeWidth={1.3} /><span><strong>Learn. Connect. Create.</strong><small>Explore our project guides and get started with the basics.</small></span><ArrowUpRight size={23} /></Link></div>
    </section>
  </>
}

function CircuitIcon() {
  return <svg viewBox="0 0 50 30" width="50" height="30" fill="none" aria-hidden="true"><path d="M2 15h14l9-10h23M16 15l9 10h23" stroke="currentColor" strokeWidth="2" /><circle cx="3" cy="15" r="2" fill="currentColor" /><circle cx="47" cy="5" r="2" fill="currentColor" /><circle cx="47" cy="25" r="2" fill="currentColor" /></svg>
}
