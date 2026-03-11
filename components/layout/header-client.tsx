"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/lib/cart-context'
import { logoutAction } from '@/app/auth/actions'

interface HeaderClientProps {
    categories: Array<{ id: string; name: string; slug: string }>
    user?: { id: string; name: string } | null
}

export function HeaderClient({ categories, user }: HeaderClientProps) {
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const { toast } = useToast()
    const { totalItems } = useCart()

    // Take up to 5 categories for the top nav
    const topCategories = categories.slice(0, 5)

    return (
        <>
            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center space-x-8">
                {topCategories.map((item) => (
                    <Link
                        key={item.id}
                        href={`/category/${item.slug}`}
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                    >
                        {item.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-400 transition-all duration-300 group-hover:w-full" />
                    </Link>
                ))}
            </nav>

            {/* SEARCH BAR (AI Powered) */}
            <div className="hidden md:block relative w-96 mx-4">
                <motion.div
                    animate={{ scale: isSearchFocused ? 1.02 : 1 }}
                    className="relative"
                >
                    <Input
                        placeholder="Ask AI: 'Components for a drone'..."
                        className="pl-10 bg-black/40 border-primary-500/20 text-white placeholder:text-gray-500 rounded-full focus:ring-accent-500/50"
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

                    {/* AI Glow Effect when focused */}
                    <AnimatePresence>
                        {isSearchFocused && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 -z-10 bg-accent-400/20 blur-xl rounded-full"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center space-x-4">
                <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-white/5">
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Button>
                </Link>

                {user ? (
                    <div className="relative hidden md:block">
                        <Button
                            variant="ghost"
                            className="text-gray-300 hover:text-white hover:bg-white/5 flex items-center space-x-2"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <User className="w-5 h-5" />
                            <span className="max-w-[100px] truncate text-sm font-medium">{user.name}</span>
                        </Button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                                >
                                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                    </div>
                                    <Link
                                        href="/my-orders"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-accent-400 transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                                        onClick={async () => {
                                            setIsUserMenuOpen(false)
                                            await logoutAction()
                                            window.location.href = '/'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <Link href="/login">
                        <Button variant="ghost" size="icon" className="hidden md:flex text-gray-300 hover:text-white hover:bg-white/5">
                            <User className="w-5 h-5" />
                        </Button>
                    </Link>
                )}

                {/* MOBILE MENU TOGGLE */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="absolute top-20 left-0 right-0 md:hidden bg-bg-elevated/95 backdrop-blur-xl border-b border-white/10 overflow-hidden shadow-2xl"
                    >
                        <div className="p-4 space-y-4">
                            <Input placeholder="Search..." className="bg-black/20" />
                            <nav className="flex flex-col space-y-2">
                                {categories.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/category/${item.slug}`}
                                        className="p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-md font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
