"use client"

import React from 'react'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCart } from '@/lib/cart-context'

interface ProductActionsProps {
    product: {
        id: string
        name: string
        price: number
        image: string
        slug: string
        stock: number
    }
}

export function ProductActions({ product }: ProductActionsProps) {
    const { addItem, items } = useCart()

    const handleAddToCart = () => {
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
            slug: product.slug,
            stock: product.stock,
        })
        toast.success(`${product.name} added to cart`)
    }

    const handleWishlist = () => {
        toast.success(`${product.name} added to wishlist`)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                url: window.location.href,
            }).catch(() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Link copied to clipboard')
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied to clipboard')
        }
    }

    return (
        <div className="flex gap-4 pt-4">
            <Button
                size="lg"
                className="flex-1 bg-accent-500 hover:bg-accent-600 text-black font-bold"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
            >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
            </Button>
            <Button
                size="lg"
                className="w-14 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:text-red-400"
                onClick={handleWishlist}
            >
                <Heart className="w-5 h-5" />
            </Button>
            <Button
                size="lg"
                className="w-14 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:text-accent-400"
                onClick={handleShare}
            >
                <Share2 className="w-5 h-5" />
            </Button>
        </div>
    )
}
