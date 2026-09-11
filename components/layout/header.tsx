import React from 'react'
import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { getAllCategoriesWithCount } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import { HeaderClient } from './header-client'

export async function Header() {
    // Fetch real categories from the database
    const dbCategories = await getAllCategoriesWithCount()
    
    // Fetch current user session
    const user = await getCurrentUser()
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0b0f17]/90 backdrop-blur-xl border-b border-white/10">
            {/* Top Announcement Bar */}
            <div className="bg-gradient-to-r from-cyan-950/90 via-[#0d1726] to-cyan-950/90 border-b border-white/5 py-1.5 px-4 text-center text-[11px] text-gray-300 flex items-center justify-center gap-3">
                <span className="flex items-center gap-1.5 font-medium text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ১০০% জেনুইন টেস্টেড কম্পোনেন্ট
                </span>
                <span className="text-white/20">|</span>
                <span className="hidden sm:inline text-gray-300">🚚 সারাদেশে ক্যাশ অন ডেলিভারি (Steadfast Courier)</span>
                <span className="hidden sm:inline text-white/20">|</span>
                <a
                    href="https://wa.me/8801755723451"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold flex items-center gap-1"
                >
                    📞 হটলাইন: 01755-723451
                </a>
            </div>

            <div className="container mx-auto h-16 px-4 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="flex items-center space-x-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10 group-hover:border-cyan-400 transition-colors">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-display font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors leading-none">
                            Zia<span className="text-cyan-400">Tech</span>
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-mono mt-0.5">
                            Maker Electronics
                        </span>
                    </div>
                </Link>

                {/* PASS CATEGORIES AND USER TO INTERACTIVE CLIENT COMPONENT */}
                <HeaderClient categories={dbCategories} user={user} />
            </div>
        </header>
    )
}
