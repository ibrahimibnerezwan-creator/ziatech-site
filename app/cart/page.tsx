"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/layout/footer'
import { Trash2, ArrowRight, Minus, Plus } from 'lucide-react'
import Link from 'next/link'

// Mock Cart Data
const cartItems = [
    { id: 1, name: 'Arduino Uno R3', price: 1250, qty: 2, image: 'https://images.unsplash.com/photo-1555664424-778a69fdb6b8?q=80&w=200' },
    { id: 2, name: 'Jumper Wires (40pcs)', price: 120, qty: 1, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200' }
]

export default function CartPage() {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
    const shipping = 80
    const total = subtotal + shipping

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1">
                <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* CART ITEMS */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 items-center">
                                <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-overlay" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-400">Unit Price: ৳{item.price}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-white/10 rounded"><Minus className="w-4 h-4 text-gray-400" /></button>
                                    <span className="w-8 text-center font-mono text-white">{item.qty}</span>
                                    <button className="p-1 hover:bg-white/10 rounded"><Plus className="w-4 h-4 text-gray-400" /></button>
                                </div>

                                <div className="text-right min-w-[80px]">
                                    <p className="font-bold text-white">৳{item.price * item.qty}</p>
                                </div>

                                <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        <Link href="/" className="inline-block mt-6 text-accent-400 hover:underline text-sm">
                            ← Continue Shopping
                        </Link>
                    </div>

                    {/* SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>৳{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>৳{shipping}</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span>৳{total}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input placeholder="Coupon Code" className="bg-black/20 border-white/10" />
                                    <Button variant="outline" className="border-white/10">Apply</Button>
                                </div>

                                <Button size="lg" className="w-full text-lg group bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 border-0">
                                    Checkout Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <p className="text-xs text-center text-gray-500 mt-4">
                                    Secure checkout powered by SSLCommerz
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
