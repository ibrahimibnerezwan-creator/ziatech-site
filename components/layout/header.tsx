import React from 'react'
import Link from 'next/link'
import { Hexagon } from 'lucide-react'
import { getAllCategoriesWithCount } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import { HeaderClient } from './header-client'

export async function Header() {
    // Fetch real categories from the database
    const dbCategories = await getAllCategoriesWithCount()
    
    // Fetch current user session
    const user = await getCurrentUser()
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 glass border-b border-primary-500/5">
            <div className="container mx-auto h-full px-4 flex items-center justify-between">
                {/* LOGO — Prism Forge Identity */}
                <Link href="/" className="flex items-center space-x-2.5 group">
                    <div className="relative">
                        <Hexagon className="w-9 h-9 text-primary-400 transition-transform duration-300 group-hover:rotate-[30deg]" strokeWidth={1.5} />
                        <div className="absolute inset-0 bg-primary-400/15 blur-xl rounded-full transition-opacity group-hover:opacity-100 opacity-60" />
                    </div>
                    <span className="text-2xl font-display font-bold tracking-tight text-white group-hover:text-primary-400 transition-colors">
                        Zia<span className="text-primary-400">Tech</span>
                    </span>
                </Link>

                {/* PASS CATEGORIES AND USER TO INTERACTIVE CLIENT COMPONENT */}
                <HeaderClient categories={dbCategories} user={user} />
            </div>
        </header>
    )
}
