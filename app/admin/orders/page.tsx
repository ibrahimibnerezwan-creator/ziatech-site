import { getAllOrders } from '@/lib/data'
import { ShoppingCart, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { format } from 'date-fns'
import { StatusSelect } from './status-select'
import { OrderFilters } from './order-filters'

export default async function AdminOrdersPage({
    searchParams
}: {
    searchParams: Promise<{ status?: string; search?: string }>
}) {
    const { status, search } = await searchParams
    const orderList = await getAllOrders({ status, search })

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">System <span className="text-primary-500">Orders</span></h1>
                <p className="text-text-secondary italic">Manage customer orders and real-time fulfillments.</p>
            </div>

            <OrderFilters />

            {orderList.length === 0 ? (
                <div className="bg-bg-elevated/60 border border-primary-500/8 rounded-2xl p-12 flex flex-col items-center justify-center text-center backdrop-blur-md">
                    <div className="bg-primary-500/10 p-6 rounded-full border border-primary-500/15 mb-6">
                        <ShoppingCart className="w-12 h-12 text-text-muted opacity-50" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">No orders found</h2>
                    <p className="text-text-secondary max-w-sm">
                        Waiting for the first spark. Customer orders will appear here for processing.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                        <div className="col-span-3">Customer Profile</div>
                        <div className="col-span-2">Order ID</div>
                        <div className="col-span-2">Payment Stream</div>
                        <div className="col-span-2">Status Node</div>
                        <div className="col-span-1 text-right">Settlement</div>
                        <div className="col-span-2 text-right">Timestamp</div>
                    </div>

                    {orderList.map((order) => {
                        return (
                            <div key={order.id} className="group relative bg-bg-elevated/60 border border-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-md hover:border-primary-500/20 hover:bg-bg-elevated/80 transition-all duration-300">
                                {/* Subtle inner glow on hover */}
                                <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />

                                {/* Mobile Layout */}
                                <div className="md:hidden space-y-4 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-white tracking-tight">{order.customerName}</p>
                                            <p className="text-[10px] text-text-muted font-mono">{order.customerPhone}</p>
                                        </div>
                                        <StatusSelect orderId={order.id} currentStatus={order.status} />
                                    </div>
                                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                                        <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                                            {order.paymentMethod}
                                        </div>
                                        <div className="text-lg font-display font-black text-white">
                                            <span className="text-xs font-normal text-text-muted mr-1">৳</span>
                                            {order.total.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-text-muted/60 font-mono italic">
                                        {format(new Date(order.createdAt), 'dd MMM yyyy · hh:mm a')}
                                    </div>
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden md:grid grid-cols-12 gap-4 items-center relative z-10">
                                    <div className="col-span-3">
                                        <p className="font-bold text-white tracking-tight">{order.customerName}</p>
                                        <p className="text-[10px] text-text-muted font-mono">{order.customerPhone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-text-muted font-mono bg-white/5 px-2 py-1 rounded inline-block">
                                            #{order.id.slice(0, 8)}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-bold text-text-secondary tracking-widest uppercase">{order.paymentMethod}</p>
                                        {order.transactionId && (
                                            <p className="text-[10px] text-text-muted font-mono truncate max-w-full" title={order.transactionId}>
                                                TXN: {order.transactionId}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <StatusSelect orderId={order.id} currentStatus={order.status} />
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <p className="font-display font-black text-white text-lg leading-none">
                                            {order.total.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-text-muted uppercase">BDT</p>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <p className="text-xs font-bold text-text-secondary">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                                        <p className="text-[10px] text-text-muted font-mono opacity-60">{format(new Date(order.createdAt), 'hh:mm a')}</p>
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
