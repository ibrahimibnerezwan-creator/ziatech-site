"use client"

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowLeft, ArrowRight, Trash2, Plus, Minus, Package, Shield } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-screen">
                <div className="container px-4 mx-auto py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-24 bg-bg-elevated/40 border border-white/5 rounded-3xl backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                            <ShoppingCart className="w-12 h-12 text-white/20" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-3">Your cart is empty</h2>
                        <p className="text-text-secondary mb-10 max-w-md text-center leading-relaxed">
                            Start exploring our collection and add components to build your next project.
                        </p>
                        <Link href="/categories">
                            <Button size="lg" className="bg-primary-500 text-white hover:bg-primary-600 rounded-full px-8 font-bold group shadow-lg shadow-primary-500/20">
                                Browse Products <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className="container px-4 mx-auto py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Shopping Cart</h1>
                        <p className="text-text-secondary mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full"
                        onClick={() => confirm('Clear all items from your cart?') && clearCart()}
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Clear All
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {items.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex gap-5 bg-bg-elevated/60 border border-white/5 rounded-2xl p-5 backdrop-blur-xl group hover:border-primary-500/20 transition-all duration-300"
                                >
                                    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/5">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-white/20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <Link href={`/product/${item.slug}`} className="text-white font-display font-bold hover:text-primary-400 transition-colors text-lg tracking-tight">
                                                {item.name}
                                            </Link>
                                            <p className="text-primary-400 font-mono font-bold text-lg mt-1">৳{item.price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center bg-white/5 rounded-full border border-white/10 overflow-hidden">
                                                <button
                                                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="text-white font-bold w-10 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            {item.quantity >= item.stock && (
                                                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/10">
                                                    Max
                                                </span>
                                            )}
                                            <div className="ml-auto flex items-center gap-4">
                                                <span className="text-white font-display font-bold text-lg">
                                                    ৳{(item.price * item.quantity).toLocaleString()}
                                                </span>
                                                <button
                                                    className="w-9 h-9 rounded-full text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-fit sticky top-24"
                    >
                        <div className="bg-bg-elevated/60 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
                            <h3 className="text-xl font-display font-bold text-white mb-6">Order Summary</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span className="text-white font-mono font-bold">৳{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Shipping</span>
                                    <span className="text-primary-400 text-xs font-bold uppercase tracking-wider">At checkout</span>
                                </div>
                                <div className="border-t border-white/5 pt-4 flex justify-between">
                                    <span className="text-lg font-display font-bold text-white">Total</span>
                                    <span className="text-2xl font-display font-bold text-primary-400">৳{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                            <Link href="/checkout" className="block mt-8">
                                <Button
                                    size="lg"
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full group shadow-lg shadow-primary-500/20"
                                >
                                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/categories" className="block mt-3">
                                <Button variant="ghost" className="w-full text-text-muted hover:text-white rounded-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
                                </Button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-text-muted uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Secure checkout</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span>Free returns</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
