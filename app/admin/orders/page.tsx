import { getAllOrders } from '@/lib/data'
import { ShoppingCart, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { format } from 'date-fns'

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
    PENDING: { label: 'Pending', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
    PROCESSING: { label: 'Processing', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Truck },
    SHIPPED: { label: 'Shipped', color: 'text-primary-400 bg-primary-500/10 border-primary-500/20', icon: Truck },
    DELIVERED: { label: 'Delivered', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
    CANCELLED: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle },
}

export default async function AdminOrdersPage() {
    const orderList = await getAllOrders()

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white">Orders</h1>
                <p className="text-text-secondary">Manage customer orders and fulfillments.</p>
            </div>

            {orderList.length === 0 ? (
                <div className="bg-bg-elevated/60 border border-primary-500/8 rounded-2xl p-12 flex flex-col items-center justify-center text-center backdrop-blur-md">
                    <div className="bg-primary-500/10 p-6 rounded-full border border-primary-500/15 mb-6">
                        <ShoppingCart className="w-12 h-12 text-text-muted" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">No orders yet</h2>
                    <p className="text-text-secondary max-w-md">
                        Once customers begin placing orders, they will appear here with real-time status tracking and management controls.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                        <div className="col-span-3">Customer</div>
                        <div className="col-span-2">Order ID</div>
                        <div className="col-span-2">Payment</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1">Total</div>
                        <div className="col-span-2">Date</div>
                    </div>

                    {orderList.map((order) => {
                        const config = statusConfig[order.status] || statusConfig.PENDING
                        const StatusIcon = config.icon

                        return (
                            <div key={order.id} className="bg-bg-elevated/60 border border-primary-500/8 rounded-2xl p-4 md:p-6 backdrop-blur-md hover:border-primary-500/15 transition-all">
                                {/* Mobile Layout */}
                                <div className="md:hidden space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-white">{order.customerName}</p>
                                            <p className="text-xs text-text-muted">{order.customerPhone}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {config.label}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">{order.paymentMethod.toUpperCase()}</span>
                                        <span className="font-display font-bold text-white">৳{order.total.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-text-muted">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-3">
                                        <p className="font-medium text-white">{order.customerName}</p>
                                        <p className="text-xs text-text-muted">{order.customerPhone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-text-secondary font-mono truncate">{order.id.slice(0, 8)}…</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-text-secondary">{order.paymentMethod.toUpperCase()}</p>
                                        {order.transactionId && (
                                            <p className="text-xs text-text-muted font-mono">TXN: {order.transactionId}</p>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {config.label}
                                        </span>
                                    </div>
                                    <div className="col-span-1">
                                        <p className="font-display font-bold text-white">৳{order.total.toLocaleString()}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-text-secondary">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                                        <p className="text-xs text-text-muted">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
