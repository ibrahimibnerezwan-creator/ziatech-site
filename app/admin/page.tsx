import { getProductCount, getOrderCount } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { CloudflareStatus } from '@/components/admin/cloudflare-status'
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'

// Dashboard Stats Card Component
function StatCard({ title, value, icon: Icon, trend }: any) {
    return (
        <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-accent-500/10 rounded-full border border-accent-500/20">
                    <Icon className="w-5 h-5 text-accent-500" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
                <span className="text-emerald-400 font-medium">{trend}</span>
                <span className="text-gray-500 ml-2">from last month</span>
            </div>
        </Card>
    )
}

export default async function AdminDashboard() {
    const productCount = await getProductCount()
    const orderCount = await getOrderCount()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Overview of your store's performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="৳0"
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
                    value={0}
                    icon={Users}
                    trend="+2"
                />
            </div>                    trend="+2"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    {/* RECENT ORDERS PLACEHOLDER */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                        <div className="text-gray-400 text-sm text-center py-10">
                            No orders yet. Start selling!
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <CloudflareStatus />
                </div>
            </div>
        </div>
    )
}
