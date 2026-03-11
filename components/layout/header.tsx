import React from 'react'
import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { getAllCategoriesWithCount } from '@/lib/data'
import { HeaderClient } from './header-client'

export async function Header() {
    // Fetch real categories from the database
    const dbCategories = await getAllCategoriesWithCount()
    
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
                        Z's <span className="text-accent-400 text-sm font-medium">Tech Shop</span>
                    </span>
                </Link>

                {/* PASS CATEGORIES TO INTERACTIVE CLIENT COMPONENT */}
                <HeaderClient categories={dbCategories} />
            </div>
        </header>
    )
}
