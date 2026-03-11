import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MyOrdersPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    const userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, user.id),
        orderBy: [desc(orders.createdAt)],
        with: {
            items: true
        }
    })

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
                    <p className="text-gray-400">View and track your recent purchases.</p>
                </div>

                {userOrders.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center glass-card">
                        <Package className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                        <h2 className="text-xl font-bold text-white mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-6">Looks like you haven't placed any orders with us.</p>
                        <Link href="/categories" className="inline-block bg-accent-500 text-black font-bold px-6 py-3 rounded-md hover:bg-accent-600 transition-colors tracking-wide uppercase text-sm">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userOrders.map((order) => {
                            // Status colors
                            let statusColor = "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                            if (order.status === 'DELIVERED') statusColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            if (order.status === 'CANCELLED') statusColor = "text-red-400 bg-red-400/10 border-red-400/20"
                            if (order.status === 'SHIPPED') statusColor = "text-accent-400 bg-accent-400/10 border-accent-400/20"

                            // Payment colors
                            let payColor = "text-yellow-400"
                            if (order.paymentStatus === 'VERIFIED') payColor = "text-emerald-400"
                            if (order.paymentStatus === 'FAILED') payColor = "text-red-400"

                            return (
                                <Link 
                                    key={order.id} 
                                    href={`/order-confirmation/${order.id}`}
                                    className="block bg-white/5 border border-white/10 rounded-xl p-6 glass-card hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-white font-mono font-bold text-lg">
                                                    #{order.id.split('-').pop()?.toUpperCase()}
                                                </span>
                                                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${statusColor}`}>
                                                    {order.status}
                                                </span>
                                                {order.paymentStatus === 'VERIFYING' && (
                                                    <span className="flex items-center gap-1 text-xs text-orange-400 bg-orange-400/10 px-2.5 py-0.5 rounded border border-orange-400/20">
                                                        <AlertCircle className="w-3 h-3" /> Verifying Payment
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                                                <p>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                <p>{order.items.length} items</p>
                                                <p>Total: <span className="text-white font-bold">৳{order.total.toLocaleString()}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment</p>
                                                <p className={`text-sm font-bold ${payColor}`}>{order.paymentStatus}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-500 group-hover:text-black text-gray-400 transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
