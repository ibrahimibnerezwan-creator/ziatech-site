"use client"

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/countdown-timer'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'


export function FlashSale({ products }: { products: any[] }) {
    const tomorrow = new Date()
    tomorrow.setHours(24, 0, 0, 0)

    // If no products, don't render
    if (!products || products.length === 0) return null

    return (
        <section className="container px-4 mx-auto py-12">
            <div className="bg-gradient-to-r from-red-600/20 via-orange-600/10 to-transparent border border-red-500/30 rounded-3xl p-6 md:p-12 relative overflow-hidden">

                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 blur-[100px] rounded-full animate-pulse" />

                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-red-500/20 rounded-full border border-red-500/50">
                                <Zap className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
                            </div>
                            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Flash Sale</h2>
                        </div>
                        <p className="text-gray-400">Limited time offers. Blink and you miss it.</p>
                    </div>

                    <CountdownTimer targetDate={tomorrow} />

                    <Button variant="outline" className="hidden md:flex border-red-500/30 text-red-400 hover:bg-red-500/10">
                        View All Deals <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-8 md:hidden flex justify-center">
                    <Button variant="outline" className="w-full border-red-500/30 text-red-400">
                        View All Deals
                    </Button>
                </div>
            </div>
        </section>
    )
}
