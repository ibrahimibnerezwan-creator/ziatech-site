"use client"

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="container px-4 mx-auto py-12 flex-1">
                    <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl glass-card">
                        <ShoppingCart className="w-16 h-16 text-gray-500 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-md text-center">
                            Browse our categories and start building your next project!
                        </p>
                        <Link href="/categories">
                            <Button size="lg" className="bg-accent-500 text-black hover:bg-accent-600 font-bold uppercase tracking-wider">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Browse Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Shopping Cart ({totalItems} items)</h1>
                    <Button
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={clearCart}
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Clear All
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white/5 shrink-0">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingCart className="w-8 h-8 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/product/${item.slug}`} className="text-white font-medium hover:text-accent-400 transition-colors">
                                        {item.name}
                                    </Link>
                                    <p className="text-lg font-bold text-white mt-1">৳{item.price.toLocaleString()}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <Button
                                            size="icon"
                                            className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                                        <Button
                                            size="icon"
                                            className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="w-8 h-8 text-red-400 hover:bg-red-500/20 ml-auto"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal ({totalItems} items)</span>
                                <span className="text-white">৳{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span className="text-accent-400">Calculated at checkout</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-lg font-bold text-white">৳{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <Link href="/checkout" className="block mt-6">
                            <Button
                                size="lg"
                                className="w-full bg-accent-500 hover:bg-accent-600 text-black font-bold"
                            >
                                Proceed to Checkout
                            </Button>
                        </Link>
                        <Link href="/categories" className="block mt-3">
                            <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
