import { db } from '@/db'
import { orders, orderItems, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Package, Truck, ArrowRight, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const orderRow = await db.query.orders.findFirst({
        where: eq(orders.id, id),
        with: {
            items: {
                with: {
                    product: true
                }
            }
        }
    })

    if (!orderRow) {
        notFound()
    }

    // Determine status styling
    let statusColor = "text-yellow-400 bg-yellow-400/20"
    if (orderRow.paymentStatus === 'VERIFIED') statusColor = "text-emerald-400 bg-emerald-400/20"
    if (orderRow.paymentStatus === 'FAILED') statusColor = "text-red-400 bg-red-400/20"

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="max-w-3xl w-full">
                
                {/* Success Banner */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/50">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Order Confirmed!</h1>
                    <p className="text-gray-400 text-lg">Thank you for shopping with ZiaTech.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl glass-card backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-6">
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Order ID</p>
                            <p className="text-white font-mono text-lg">{orderRow.id.split('-').pop()?.toUpperCase()}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right">
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Payment Status</p>
                            <span className={`px-3 py-1 rounded inline-flex items-center text-sm font-bold ${statusColor}`}>
                                {orderRow.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Customer Details */}
                        <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                            <h3 className="text-accent-400 font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4"/> Delivery Details</h3>
                            <p className="text-white font-medium">{orderRow.customerName}</p>
                            <p className="text-gray-300 text-sm mt-1">{orderRow.customerPhone}</p>
                            <p className="text-gray-300 text-sm mt-1">{orderRow.address}, {orderRow.shippingCity}</p>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                            <h3 className="text-accent-400 font-bold mb-4 flex items-center gap-2"><Truck className="w-4 h-4"/> Order Summary</h3>
                            <div className="flex justify-between text-sm text-gray-300 mb-2">
                                <span>Method:</span>
                                <span className="text-white font-medium uppercase">{orderRow.paymentMethod}</span>
                            </div>
                            {orderRow.transactionId && (
                                <div className="flex justify-between text-sm text-gray-300 mb-4">
                                    <span>TrxID:</span>
                                    <span className="text-white font-mono">{orderRow.transactionId}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg text-white font-bold border-t border-white/10 pt-2">
                                <span>Total Paid:</span>
                                <span className="text-accent-400">৳{orderRow.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps for pending payments */}
                    {orderRow.paymentStatus === 'VERIFYING' && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-8">
                            <h4 className="text-orange-400 font-bold mb-2">Payment Verification Pending</h4>
                            <p className="text-gray-300 text-sm">We've received your order and transaction ID. Our team is currently verifying the payment. You will receive an update shortly.</p>
                        </div>
                    )}

                    {orderRow.paymentMethod === 'cod' && (
                        <div className="bg-accent-400/10 border border-accent-400/20 rounded-xl p-5 mb-8 text-center">
                            <h4 className="text-accent-400 font-bold mb-2">Prepare exact change</h4>
                            <p className="text-gray-300 text-sm">Please keep <strong>৳{orderRow.total.toLocaleString()}</strong> ready for the delivery rider.</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <Link href="/my-orders" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
                                <Package className="w-4 h-4 mr-2" /> Track Order
                            </Button>
                        </Link>
                        <Link href="/categories" className="w-full sm:w-auto">
                            <Button className="w-full bg-accent-500 text-black hover:bg-accent-600 font-bold">
                                Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
