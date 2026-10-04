import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PrototypeIllustration } from '@/components/home/prototype-illustration'

export function Hero() {
  return (
    <section className="workshop-hero" aria-labelledby="workshop-title">
      <div className="store-container">
        <div className="workshop-intro"><span>Electronics for hands-on minds.</span><span>From Bangladesh, for your workbench.</span></div>
        <h1 id="workshop-title">Build. Test. Repeat.</h1>
        <div className="workshop-description">
          <p>For the circuit you sketched. The idea you can&apos;t leave alone.<br className="hidden sm:block" /> Find the components to make it work.</p>
          <Link href="/category/all" className="shop-button shop-button-dark">Shop components <ArrowRight size={19} /></Link>
        </div>
        <div className="prototype-stage"><PrototypeIllustration /></div>
        <div className="workshop-caption"><span>A little experimentation goes a long way.</span><Link href="#components">Find your next part <ArrowRight size={16} /></Link></div>
      </div>
    </section>
  )
}
