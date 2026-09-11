import React from 'react'
import Link from 'next/link'
import { Hexagon } from 'lucide-react'
import { getAllCategoriesWithCount } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import { HeaderClient } from './header-client'

export async function Header() {
    const dbCategories = await getAllCategoriesWithCount()
    const user = await getCurrentUser()
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0c0906]/90 backdrop-blur-xl border-b border-orange-500/10">
            {/* Top Announcement Bar */}
            <div className="bg-gradient-to-r from-orange-950/90 via-[#1c1208] to-orange-950/90 border-b border-orange-500/10 py-1.5 px-4 text-center text-[11px] text-gray-300 flex items-center justify-center gap-3">
                <span className="flex items-center gap-1.5 font-medium text-orange-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ১০০% জেনুইন টেস্টেড কম্পোনেন্ট
                </span>
                <span className="text-white/20">|</span>
                <span className="hidden sm:inline text-gray-300">🚚 সারাদেশে ক্যাশ অন ডেলিভারি (Steadfast Courier)</span>
                <span className="text-white/20 hidden sm:inline">|</span>
                <a
                    href="https://wa.me/8801755723451"
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400 hover:text-orange-300 hover:underline font-semibold flex items-center gap-1"
                >
                    📞 হটলাইন: 01755-723451
                </a>
            </div>

            <div className="container mx-auto h-16 px-4 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="flex items-center space-x-2.5 group">
                    <div className="relative">
                        <Hexagon className="w-8 h-8 text-orange-500 transition-transform duration-300 group-hover:rotate-[30deg]" strokeWidth={1.75} />
                        <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-display font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors leading-none">
                            Zia<span className="text-orange-500">Tech</span>
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-mono mt-0.5">
                            Maker Electronics
                        </span>
                    </div>
                </Link>

                <HeaderClient categories={dbCategories} user={user} />
            </div>
        </header>
    )
}
