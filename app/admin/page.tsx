import { getProductCount, getOrderCount, getTotalRevenue, getAllOrders, getUserCount, getRecentReviews } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { CloudflareStatus } from '@/components/admin/cloudflare-status'
import { Package, ShoppingCart, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Dashboard Stats Card Component — Prism Forge Style
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend: string;
    trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, trend, trendUp = true }: StatCardProps) {
    return (
        <Card className="relative p-6 border-white/5 bg-bg-elevated/40 backdrop-blur-xl rounded-3xl group hover:border-primary-500/20 transition-all duration-500 overflow-hidden shadow-2xl">
            {/* Prism Forge: Card Accent Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
            
            <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{title}</p>
                    <h3 className="text-3xl font-display font-black text-white tracking-tighter">{value}</h3>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="w-6 h-6 text-white/40 group-hover:text-primary-400 transition-colors" />
                </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 relative z-10">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 ${trendUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
                    {trend}
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">vs last cycle</span>
            </div>
        </Card>
    )
}

export default async function AdminDashboard() {
    const [productCount, orderCount, totalRevenue, allOrders, userCount, recentReviews] = await Promise.all([
        getProductCount(),
        getOrderCount(),
        getTotalRevenue(),
        getAllOrders(),
        getUserCount(),
        getRecentReviews(5)
    ])

    const recentOrders = allOrders.slice(0, 5)

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">System <span className="text-primary-500">Overview</span></h1>
                    <p className="text-text-secondary">Granular performance metrics for ZiaTech Prism Forge.</p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-primary-500/50 bg-primary-500/5 px-3 py-1.5 rounded-full border border-primary-500/10">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`৳${totalRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    trend="+20.1%"
                />
                <StatCard
                    title="Orders"
                    value={orderCount}
                    icon={ShoppingCart}
                    trend="+12%"
                />
                <StatCard
                    title="Products"
                    value={productCount}
                    icon={Package}
                    trend="+4"
                />
                <StatCard
                    title="Active Customers"
                    value={userCount}
                    icon={Users}
                    trend="+2"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl h-full">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary-500/10 rounded-xl border border-primary-500/20">
                                    <Clock className="w-5 h-5 text-primary-400" />
                                </div>
                                <h2 className="text-xl font-display font-black text-white uppercase tracking-tighter">
                                    Recent <span className="text-primary-500">Logistics</span>
                                </h2>
                            </div>
                            <Link href="/admin/orders" className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all">
                                <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest transition-colors">Audit All</span>
                                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        </div>
 
                        {recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                    <ShoppingCart className="w-10 h-10 text-white/10" />
                                </div>
                                <p className="text-white/30 font-display font-medium text-lg italic">The forge is silent. Awaiting the first transmission...</p>
                            </div>
                        ) : (
                            <div className="space-y-3 relative z-10">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-bg-void border border-white/10 flex items-center justify-center text-primary-400 font-display font-black text-sm group-hover:border-primary-500/40 transition-colors shadow-inner">
                                                {order.customerName.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-white tracking-tight">{order.customerName}</p>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.1em]">{order.id.slice(-8)}</p>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.1em]">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1.5">
                                            <p className="text-lg font-mono font-black text-white tracking-tighter">৳{order.total.toLocaleString()}</p>
                                            <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${
                                                order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                order.status === 'SHIPPED' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                                                order.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <CloudflareStatus />
 
                    <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16" />
                         
                         <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center relative z-10">
                            <TrendingUp className="w-3.5 h-3.5 mr-2 text-primary-500" />
                            Feed Analytics
                        </h2>
                        
                        <div className="space-y-6 relative z-10">
                            {recentReviews.length === 0 ? (
                                <div className="py-8 text-center border border-dashed border-white/10 rounded-2xl">
                                    <p className="text-[9px] text-white/20 font-black uppercase tracking-widest italic">No Signal Detected</p>
                                </div>
                            ) : (
                                recentReviews.map((review) => (
                                    <div key={review.id} className="relative group pl-5 border-l-2 border-white/5 hover:border-primary-500/40 transition-colors">
                                        <div className="absolute top-0 left-[-2px] w-1 h-3 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                        <p className="text-[9px] font-black text-primary-500/60 uppercase tracking-widest mb-1">Customer Intel</p>
                                        <p className="text-xs text-white leading-relaxed font-medium line-clamp-2">
                                            <span className="text-primary-400">{review.userName}</span> verified <span className="text-white/60">{review.productName}</span>
                                        </p>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-1 h-1 rounded-full ${i < review.rating ? 'bg-primary-500' : 'bg-white/10'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
 
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="bg-bg-void/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Network Stability</span>
                                    <span className="text-[9px] font-mono text-emerald-400">99.9%</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[99.9%] bg-emerald-500/40 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
