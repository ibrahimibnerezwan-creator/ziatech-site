"use client"

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/product/product-card'

type Product = {
    id: string
    name: string
    slug: string
    price: number
    oldPrice?: number
    image: string
    category: string
    rating: number
    reviews: number
    stock: number
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest'

export function CategoryResults({ products }: { products: Product[] }) {
    const [sort, setSort] = useState<SortKey>('featured')
    const [inStockOnly, setInStockOnly] = useState(false)

    const sorted = useMemo(() => {
        let list = [...products]
        if (inStockOnly) list = list.filter(p => p.stock > 0)
        switch (sort) {
            case 'price-asc':
                list.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                list.sort((a, b) => b.price - a.price)
                break
            case 'newest':
            case 'featured':
            default:
                break
        }
        return list
    }, [products, sort, inStockOnly])

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="hidden md:block space-y-8 sticky top-24 h-fit">
                <div className="space-y-2">
                    <h3 className="font-bold text-white mb-2">Availability</h3>
                    <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                            className="rounded border-gray-600 bg-transparent focus:ring-accent-500 text-accent-500"
                        />
                        <span>In Stock Only</span>
                    </label>
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold text-white mb-2">Sort</h3>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest Arrivals</option>
                    </select>
                </div>
            </aside>

            <div className="col-span-1 md:col-span-3">
                {sorted.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        No products match your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sorted.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
