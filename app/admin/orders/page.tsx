import { ShoppingCart } from 'lucide-react'

export default function AdminOrdersPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Orders</h1>
                <p className="text-gray-400">Manage customer orders and fulfillments.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-white/5 p-6 rounded-full border border-white/10 mb-6">
                    <ShoppingCart className="w-12 h-12 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
                <p className="text-gray-400 max-w-md">
                    You haven't received any orders yet. Once the checkout system is fully integrated, new customer orders will appear here automatically.
                </p>
            </div>
        </div>
    )
}
