"use client"

import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function NewArrivals({ products }: { products: any[] }) {
    if (!products || products.length === 0) return null

    return (
        <section className="container px-4 mx-auto py-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">New Arrivals</h2>
                    <p className="text-gray-400 mt-1">Latest tech just landed in our warehouse.</p>
                </div>
                <Link href="/categories">
                    <Button variant="link" className="hidden md:flex text-accent-400">
                        View All New Items <ArrowRight className="ml-2 w-4 h-4" />
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
