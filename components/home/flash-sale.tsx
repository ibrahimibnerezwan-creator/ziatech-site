"use client"

import { Zap, ArrowRight } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/countdown-timer'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function FlashSale({ products }: { products: any[] }) {
    const tomorrow = new Date()
    tomorrow.setHours(24, 0, 0, 0)

    if (!products || products.length === 0) return null

    return (
        <section className="container px-4 mx-auto py-8">
            <div className="bg-gradient-to-br from-red-600/15 via-orange-600/5 to-transparent border border-red-500/15 rounded-3xl p-6 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/10 blur-[80px] rounded-full" />

                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 relative z-10">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-red-500/15 rounded-xl border border-red-500/25">
                                <Zap className="w-5 h-5 text-red-400 fill-red-400" />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-white">Flash Sale</h2>
                        </div>
                        <p className="text-text-secondary text-sm">Limited time offers. Don&apos;t miss out.</p>
                    </div>

                    <CountdownTimer targetDate={tomorrow} />

                    <Link href="/categories">
                        <Button variant="outline" className="hidden md:flex border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-full font-bold">
                            View All Deals <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-8 md:hidden flex justify-center relative z-10">
                    <Link href="/categories" className="w-full">
                        <Button variant="outline" className="w-full border-red-500/20 text-red-400 rounded-full">
                            View All Deals <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
