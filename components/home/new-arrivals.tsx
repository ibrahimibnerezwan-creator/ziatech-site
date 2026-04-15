"use client"

import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function NewArrivals({ products }: { products: any[] }) {
    if (!products || products.length === 0) return null

    return (
        <section className="container px-4 mx-auto py-8">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">Just arrived</p>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white">New Arrivals</h2>
                    <p className="text-text-secondary mt-2">Latest tech just landed in our warehouse.</p>
                </div>
                <Link href="/categories">
                    <Button variant="link" className="hidden md:flex text-primary-400 font-bold">
                        View All <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}
