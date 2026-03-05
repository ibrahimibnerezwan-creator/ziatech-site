"use client"

import React from 'react'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface ProductActionsProps {
    product: {
        id: string
        name: string
        stock: number
    }
}

export function ProductActions({ product }: ProductActionsProps) {
    const handleAddToCart = () => {
        toast({
            title: "Added to Cart",
            description: `${product.name} has been added to your cart.`,
        })
    }

    const handleWishlist = () => {
        toast({
            title: "Wishlist Updated",
            description: `${product.name} has been added to your wishlist.`,
        })
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                url: window.location.href,
            }).catch(() => {
                toast({
                    title: "Link Copied",
                    description: "Product link copied to clipboard.",
                })
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast({
                title: "Link Copied",
                description: "Product link copied to clipboard.",
            })
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
                variant="glass"
                className="w-14"
                onClick={handleWishlist}
            >
                <Heart className="w-5 h-5 hover:text-red-500 transition-colors" />
            </Button>
            <Button
                size="lg"
                variant="glass"
                className="w-14"
                onClick={handleShare}
            >
                <Share2 className="w-5 h-5 hover:text-accent-400 transition-colors" />
            </Button>
        </div>
    )
}
