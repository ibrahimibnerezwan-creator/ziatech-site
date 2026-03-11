"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface HeaderClientProps {
    categories: Array<{ id: string; name: string; slug: string }>
}

export function HeaderClient({ categories }: HeaderClientProps) {
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { toast } = useToast()

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
                        {/* Fake badge replaced with a simple dot for empty state, until cart logic is fully built */}
                        {/* <span className="absolute top-1 right-1 w-2 h-2 bg-accent-400 rounded-full"></span> */}
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => {
                        toast({
                            title: "Authentication Required",
                            description: "Login system will be available in the next update!",
                        })
                    }}
                >
                    <User className="w-5 h-5" />
                </Button>

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
