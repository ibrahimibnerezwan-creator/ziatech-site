"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import { useCart } from '@/lib/cart-context'

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
    
    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0

    // Use slug if available, otherwise fallback to id
    const productUrl = product.slug ? `/product/${product.slug}` : `/product/${product.id}`

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

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

        toast.success(`${product.name} added to cart`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-bg-elevated rounded-2xl overflow-hidden glass-card border border-white/5"
        >
            <Link href={productUrl}>
                {/* IMAGE CONTAINER */}
                <div className="relative aspect-square overflow-hidden bg-white/5 p-4">
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* BADGES */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && <Badge variant="neon">NEW</Badge>}
                        {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
                    </div>

                    {/* HOVER ACTIONS OVERLAY */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 justify-center bg-gradient-to-t from-black/80 to-transparent">
                        <Button
                            size="icon"
                            variant="glass"
                            className="rounded-full hover:bg-accent-500 hover:text-black"
                            disabled={product.stock === 0}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="glass"
                            className="rounded-full hover:bg-red-500 hover:text-white"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.success(`${product.name} added to wishlist`)
                            }}
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* DETAILS */}
                <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="font-medium text-white group-hover:text-accent-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>

                    <div className="flex items-center mt-2 space-x-1">
                        <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                        <span className="text-xs text-gray-400">{product.rating} ({product.reviews})</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white">৳{product.price.toLocaleString()}</span>
                            {product.oldPrice && (
                                <span className="text-xs text-gray-500 line-through">৳{product.oldPrice.toLocaleString()}</span>
                            )}
                        </div>
                        {product.stock === 0 ? (
                            <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Out of stock</span>
                        ) : product.stock < 5 ? (
                            <span className="text-xs text-red-400 animate-pulse">{product.stock} left!</span>
                        ) : null}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
