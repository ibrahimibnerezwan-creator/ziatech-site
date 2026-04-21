"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileSearchQuery, setMobileSearchQuery] = useState('')
    const router = useRouter()
    const { totalItems } = useCart()

    function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>, query: string) {
        e.preventDefault()
        const q = query.trim()
        if (!q) return
        setIsMobileMenuOpen(false)
        router.push(`/category/all?q=${encodeURIComponent(q)}`)
    }

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
                        className="text-sm font-medium text-text-secondary hover:text-white transition-colors relative group"
                    >
                        {item.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-300 group-hover:w-full rounded-full" />
                    </Link>
                ))}
            </nav>

            {/* SEARCH BAR */}
            <form
                onSubmit={(e) => handleSearchSubmit(e, searchQuery)}
                className="hidden md:block relative w-96 mx-4"
            >
                <motion.div
                    animate={{ scale: isSearchFocused ? 1.02 : 1 }}
                    className="relative"
                >
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search components, kits, modules..."
                        className="pl-10 bg-bg-void/60 border-primary-700/30 text-white placeholder:text-text-muted rounded-full focus:ring-primary-500/40 focus:border-primary-500/40"
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                    <button type="submit" aria-label="Search" className="absolute left-3 top-2.5 text-text-muted hover:text-white">
                        <Search className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                        {isSearchFocused && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 -z-10 bg-primary-500/15 blur-xl rounded-full"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            </form>

            {/* ACTIONS */}
            <div className="flex items-center space-x-4">
                <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative text-text-secondary hover:text-white hover:bg-white/5">
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Button>
                </Link>

                {user ? (
                    <div className="relative hidden md:block">
                        <Button
                            variant="ghost"
                            className="text-text-secondary hover:text-white hover:bg-white/5 flex items-center space-x-2"
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
                                    className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-primary-700/20 rounded-2xl shadow-xl overflow-hidden z-50 py-1"
                                >
                                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                    </div>
                                    <Link
                                        href="/my-orders"
                                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-primary-400 transition-colors"
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
                        <Button variant="ghost" size="icon" className="hidden md:flex text-text-secondary hover:text-white hover:bg-white/5">
                            <User className="w-5 h-5" />
                        </Button>
                    </Link>
                )}

                {/* MOBILE MENU TOGGLE */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-text-secondary"
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
                        className="absolute top-20 left-0 right-0 md:hidden bg-bg-elevated/95 backdrop-blur-xl border-b border-primary-700/15 overflow-hidden shadow-2xl"
                    >
                        <div className="p-4 space-y-4">
                            <form onSubmit={(e) => handleSearchSubmit(e, mobileSearchQuery)}>
                                <Input
                                    value={mobileSearchQuery}
                                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="bg-bg-void/60 border-primary-700/20 rounded-xl"
                                />
                            </form>
                            <nav className="flex flex-col space-y-1">
                                {categories.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/category/${item.slug}`}
                                        className="p-3 text-text-secondary hover:text-white hover:bg-primary-500/5 rounded-xl font-medium transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            {user ? (
                                <div className="pt-2 border-t border-white/5 space-y-1">
                                    <Link
                                        href="/my-orders"
                                        className="block p-3 text-text-secondary hover:text-white hover:bg-primary-500/5 rounded-xl font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        className="w-full text-left p-3 text-red-400 hover:bg-red-500/5 rounded-xl font-medium"
                                        onClick={async () => {
                                            setIsMobileMenuOpen(false)
                                            await logoutAction()
                                            window.location.href = '/'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-2 border-t border-white/5">
                                    <Link
                                        href="/login"
                                        className="block p-3 text-primary-400 hover:bg-primary-500/5 rounded-xl font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
