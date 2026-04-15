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
            <div className="container mx-auto max-w-4xl relative">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/5 blur-[120px] pointer-events-none"></div>
                <div className="mb-12">
                    <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tighter mb-2">Order <span className="text-primary-500">History</span></h1>
                    <p className="text-text-secondary text-sm uppercase tracking-widest font-medium opacity-70">Telemetry of your past procurement cycles.</p>
                </div>

                {userOrders.length === 0 ? (
                    <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl p-20 text-center backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Package className="w-20 h-20 text-primary-500/20 mx-auto mb-6 group-hover:scale-110 group-hover:text-primary-400/30 transition-all duration-500" />
                        <h2 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight">Zero Records Found</h2>
                        <p className="text-text-muted mb-10 max-w-xs mx-auto text-sm leading-relaxed">Your procurement history is currently empty. Initialize your first acquisition from our inventory.</p>
                        <Link href="/categories" className="inline-flex items-center bg-primary-500 text-black font-black px-8 py-4 rounded-full hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/20 uppercase text-xs tracking-[0.2em]">
                            Initialize Search <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userOrders.map((order) => {
                            // Status mappings
                            const statusConfig = {
                                'DELIVERED': 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10',
                                'CANCELLED': 'text-red-400 bg-red-400/5 border-red-400/10',
                                'SHIPPED': 'text-blue-400 bg-blue-400/5 border-blue-400/10',
                                'PENDING': 'text-primary-400 bg-primary-400/5 border-primary-400/10',
                                'PROCESSING': 'text-primary-400 bg-primary-400/5 border-primary-400/10',
                            }
                            const statusColor = statusConfig[order.status as keyof typeof statusConfig] || 'text-gray-400 bg-gray-400/5 border-gray-400/10'

                            // Payment mapping
                            const payStatusColor = order.paymentStatus === 'VERIFIED' ? 'text-emerald-400' : 
                                                 order.paymentStatus === 'FAILED' ? 'text-red-400' : 'text-primary-400'

                            return (
                                <Link 
                                    key={order.id} 
                                    href={`/order-confirmation/${order.id}`}
                                    className="block group relative"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                                    <div className="relative bg-bg-elevated/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-300">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-8">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="text-white font-mono font-black text-xl uppercase tracking-tighter">
                                                        #{order.id.split('-').pop()?.toUpperCase()}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                                                        {order.status}
                                                    </span>
                                                    {order.paymentStatus === 'VERIFYING' && (
                                                        <span className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-400/5 px-3 py-1 rounded-md border border-amber-400/10">
                                                            <AlertCircle className="w-3 h-3" /> Verifying
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                                                    <div>
                                                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1 font-bold">Deployed</p>
                                                        <p className="text-sm text-white font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1 font-bold">Payload</p>
                                                        <p className="text-sm text-white font-medium">{order.items.length} Units</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1 font-bold">Cost</p>
                                                        <p className="text-sm text-primary-400 font-bold italic">৳{order.total.toLocaleString()}</p>
                                                    </div>
                                                    <div className="sm:text-right">
                                                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1 font-bold">Payment</p>
                                                        <p className={`text-sm font-bold uppercase tracking-widest ${payStatusColor}`}>{order.paymentStatus}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center md:justify-end">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:scale-110 text-white group-hover:text-black transition-all duration-500">
                                                    <ChevronRight className="w-6 h-6 ml-0.5" />
                                                </div>
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
