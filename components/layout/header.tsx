"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, Menu, X, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function Header() {
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 glass border-b border-white/5">
            <div className="container mx-auto h-full px-4 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="relative">
                        <Cpu className="w-8 h-8 text-accent-400 animate-pulse-glow" />
                        <div className="absolute inset-0 bg-accent-400/20 blur-lg rounded-full" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white group-hover:text-accent-400 transition-colors">
                        NEXUS<span className="text-accent-400">.</span>
                    </span>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex items-center space-x-8">
                    {['Arduino', 'Raspberry Pi', 'IoT', 'Robotics', 'Sensors'].map((item) => (
                        <Link
                            key={item}
                            href={`/category/${item.toLowerCase().replace(' ', '-')}`}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                        >
                            {item}
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
                            <Badge variant="neon" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                                3
                            </Badge>
                        </Button>
                    </Link>

                    <Button variant="ghost" size="icon" className="hidden md:flex text-gray-300 hover:text-white hover:bg-white/5">
                        <User className="w-5 h-5" />
                    </Button>

                    {/* MOBILE MENU TOGGLE */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-gray-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-bg-elevated/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <Input placeholder="Search..." className="bg-black/20" />
                            <nav className="flex flex-col space-y-2">
                                {['Arduino', 'Raspberry Pi', 'IoT', 'Robotics', 'Sensors'].map((item) => (
                                    <Link
                                        key={item}
                                        href={`/category/${item.toLowerCase().replace(' ', '-')}`}
                                        className="p-2 text-gray-300 hover:bg-white/5 rounded-md"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
