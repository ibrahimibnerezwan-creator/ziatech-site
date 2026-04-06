"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, FolderOpen, Settings, LogOut, Hexagon, MessageCircle, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/reviews', label: 'Reviews', icon: MessageCircle },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin'
        return pathname.startsWith(href)
    }

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/admin/logout', { method: 'POST' })
            if (res.ok) {
                router.push('/login')
                router.refresh()
            }
        } catch {
            // Fallback: just redirect
            router.push('/login')
        }
    }

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-primary-500/10 flex items-center space-x-2.5">
                <div className="bg-primary-500/15 p-2 rounded-xl">
                    <Hexagon className="w-6 h-6 text-primary-400" strokeWidth={1.5} />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white">
                    Zia<span className="text-primary-400">Tech</span>
                    <span className="text-[10px] text-text-muted font-body font-normal ml-1.5 uppercase tracking-widest">Admin</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link key={item.href} href={item.href} onClick={() => setIsMobileSidebarOpen(false)}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start rounded-xl transition-all duration-200 ${
                                    active
                                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/15 font-medium'
                                        : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <item.icon className={`w-4 h-4 mr-3 ${active ? 'text-primary-400' : ''}`} />
                                {item.label}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-primary-500/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                </Button>
            </div>
        </>
    )

    return (
        <div className="min-h-screen flex bg-bg-primary text-text-primary font-body">
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex w-64 border-r border-primary-500/8 flex-col glass fixed h-full z-50">
                <SidebarContent />
            </aside>

            {/* MOBILE HEADER BAR */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-primary-500/8 flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                    <Hexagon className="w-6 h-6 text-primary-400" strokeWidth={1.5} />
                    <span className="font-display font-bold text-white text-lg">
                        Zia<span className="text-primary-400">Tech</span>
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-text-secondary"
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                >
                    {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* MOBILE SIDEBAR OVERLAY */}
            {isMobileSidebarOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                    <aside className="md:hidden fixed top-0 left-0 bottom-0 w-72 z-50 bg-bg-elevated/95 backdrop-blur-xl border-r border-primary-500/10 flex flex-col animate-slide-in-left">
                        <SidebarContent />
                    </aside>
                </>
            )}

            {/* CONTENT AREA */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
                {children}
            </main>

            <style jsx>{`
                @keyframes slide-in-left {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.25s ease-out;
                }
            `}</style>
        </div>
    )
}
