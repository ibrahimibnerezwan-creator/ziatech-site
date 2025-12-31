import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react'

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
    // Fetch actual counts
    const productCount = await prisma.product.count()
    const orderCount = await prisma.order.count()
    const customerCount = await prisma.user.count({ where: { role: 'CUSTOMER' } })

    // Calculate revenue (mock for now as we use Float and SQLite aggregation might be tricky without seed)
    const totalRevenue = 0

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Overview of your store's performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`৳${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+20.1%"
                />
                <StatCard
                    title="Orders"
                    value={orderCount}
                    icon={ShoppingBag}
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
                    value={customerCount}
                    icon={Users}
                    trend="+2"
                />
            </div>

            {/* RECENT ORDERS PLACEHOLDER */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="text-gray-400 text-sm text-center py-10">
                    No orders yet. Start selling!
                </div>
            </div>
        </div>
    )
}
