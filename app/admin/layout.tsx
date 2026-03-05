import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex bg-bg-primary text-text-primary font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/10 flex flex-col glass fixed h-full z-50">
                <div className="p-6 border-b border-white/10 flex items-center space-x-2">
                    <div className="bg-accent-500/20 p-2 rounded-lg">
                        <Cpu className="w-6 h-6 text-accent-500" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase">
                        Zia Tech <span className="text-xs text-gray-500 font-normal ml-1">ADMIN</span>
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                            <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                            <Package className="w-4 h-4 mr-3" /> Products
                        </Button>
                    </Link>
                    <Link href="/admin/orders">
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                            <ShoppingCart className="w-4 h-4 mr-3" /> Orders
                        </Button>
                    </Link>
                    <Link href="/admin/customers">
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                            <Users className="w-4 h-4 mr-3" /> Customers
                        </Button>
                    </Link>
                    <Link href="/admin/settings">
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                            <Settings className="w-4 h-4 mr-3" /> Settings
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                    </Button>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
