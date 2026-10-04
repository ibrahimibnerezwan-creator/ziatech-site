import Link from 'next/link'
import { ArrowUpRight, MoveRight, CircuitBoard } from 'lucide-react'
import { BoardIllustration } from '@/components/home/board-illustration'

export function Hero() {
  return (
    <section className="store-container hero">
      <div className="hero-copy">
        <p className="hero-intro"><span /> For the makers. The tinkerers. You.</p>
        <h1>Small parts.<br />Big possibilities.</h1>
        <p className="hero-description">Bring your next idea to life. Explore electronics, microcontrollers, and the components that make it all connect.</p>
        <div className="hero-actions">
          <Link href="/category/all" className="shop-button">Explore components <ArrowUpRight size={20} /></Link>
          <Link href="/categories" className="text-link">Shop by category <MoveRight size={18} /></Link>
        </div>
        <div className="hero-footnote"><span className="hero-footnote-line" /> From your first circuit to your next breakthrough.</div>
      </div>
      <div className="hero-workbench">
        <div className="workbench-top"><span><CircuitBoard size={18} /> The maker&apos;s workbench</span><span className="workbench-dot" /></div>
        <BoardIllustration />
        <div className="workbench-bottom"><span>A little hardware.<br /><strong>A lot of potential.</strong></span><span className="workbench-mark" aria-hidden="true">+</span></div>
      </div>
    </section>
  )
}
