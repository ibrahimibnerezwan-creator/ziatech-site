"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import { useCart } from '@/lib/cart-context'
import { CheckoutModal } from '@/components/product/CheckoutModal'

interface Product {
    id: string
    name: string
    slug?: string
    price: number
    oldPrice?: number
    image: string
    category: string
    rating: number
    reviews: number
    isNew?: boolean
    stock: number
}

export function ProductCard({ product }: { product: Product }) {
    const { addItem, items } = useCart()
    const [checkoutOpen, setCheckoutOpen] = useState(false)
    
    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0

    // Use slug if available, otherwise fallback to id
    const productUrl = product.slug ? `/product/${product.slug}` : `/product/${product.id}`

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const existingItem = items.find(i => i.id === product.id)
        const currentQuantity = existingItem ? existingItem.quantity : 0

        if (currentQuantity >= product.stock) {
            toast.error(`You already have all ${product.stock} available units in your cart.`)
            return
        }

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            slug: product.slug || '',
            stock: product.stock,
        })

        toast.success(`${product.name} কার্টে যোগ করা হয়েছে`)
    }

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (product.stock === 0) {
            toast.error("দুঃখিত, এই পণ্যটি বর্তমানে স্টক আউট রয়েছে।")
            return
        }
        setCheckoutOpen(true)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-[#0f141c]/90 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 transition-all flex flex-col justify-between"
            >
                <Link href={productUrl} className="block">
                    {/* IMAGE CONTAINER */}
                    <div className="relative aspect-square overflow-hidden bg-white/[0.02] p-4 flex items-center justify-center">
                        <img
                            src={product.image || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />

                        {/* BADGES */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                            {product.isNew && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                    NEW
                                </span>
                            )}
                            {discount > 0 && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                                    -{discount}%
                                </span>
                            )}
                        </div>

                        {/* WISHLIST BUTTON */}
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toast.success(`${product.name} উইশলিস্টে যুক্ত হয়েছে`)
                            }}
                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors z-10"
                        >
                            <Heart className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* DETAILS */}
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="text-[11px] font-medium text-cyan-400/80 mb-1 uppercase tracking-wider">
                            {product.category || 'Component'}
                        </div>
                        <h3 className="font-semibold text-sm text-gray-100 group-hover:text-cyan-400 transition-colors line-clamp-2 min-h-[2.5rem] leading-snug">
                            {product.name}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex items-center text-amber-400">
                                <Star className="w-3 h-3 fill-amber-400" />
                            </div>
                            <span className="text-[11px] text-gray-400">
                                {product.rating || '5.0'} ({product.reviews || 0})
                            </span>
                        </div>

                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-lg font-bold font-mono text-white">৳{product.price.toLocaleString()}</span>
                            {product.oldPrice && (
                                <span className="text-xs text-gray-500 line-through font-mono">৳{product.oldPrice.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                </Link>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="px-4 pb-4 pt-1 flex gap-2">
                    <button
                        onClick={handleBuyNow}
                        disabled={product.stock === 0}
                        className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {product.stock === 0 ? 'স্টক আউট' : 'অর্ডার করুন'}
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        title="কার্টে যোগ করুন"
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* QUICK CHECKOUT MODAL */}
            {checkoutOpen && (
                <CheckoutModal
                    product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        stock: product.stock,
                    }}
                    onClose={() => setCheckoutOpen(false)}
                />
            )}
        </>
    )
}
