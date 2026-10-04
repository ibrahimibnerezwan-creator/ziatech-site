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

    // The unguessable confirmation link shows a receipt without exposing delivery details.
    // Determine status styling
    let statusColor = "text-yellow-400 bg-yellow-400/20"
    if (orderRow.paymentStatus === 'VERIFIED') statusColor = "text-emerald-700 bg-emerald-400/20"
    if (orderRow.paymentStatus === 'FAILED') statusColor = "text-red-700 bg-red-400/20"

    return (
        <div className="min-h-[60vh] pt-10 pb-12 px-4 flex items-center justify-center">
            <div className="max-w-3xl w-full">
                
                {/* Success Banner */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/50">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold text-text-primary mb-4 tracking-tight">Order Confirmed!</h1>
                    <p className="text-text-secondary text-lg">Thank you for shopping with ZiaTech.</p>
                </div>

                <div className="bg-bg-elevated border border-line p-8 rounded-2xl glass-card ">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-line pb-6 mb-6">
                        <div>
                            <p className="text-sm text-text-secondary font-medium uppercase tracking-widest mb-1">Order ID</p>
                            <p className="text-text-primary tabular-nums text-sm break-all">{orderRow.id}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right">
                            <p className="text-sm text-text-secondary font-medium uppercase tracking-widest mb-1">Payment Status</p>
                            <span className={`px-3 py-1 rounded inline-flex items-center text-sm font-bold ${statusColor}`}>
                                {orderRow.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Customer Details */}
                        <div className="bg-bg-primary p-5 rounded-xl border border-line">
                            <h3 className="text-accent-400 font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4"/> Delivery Details</h3>
                            <p className="text-text-primary font-medium">{orderRow.customerName}</p>
                            <p className="text-text-secondary text-sm mt-1">{orderRow.customerPhone.slice(0,3) + '*****' + orderRow.customerPhone.slice(-3)}</p>
                            <p className="text-text-secondary text-sm mt-1">{orderRow.shippingCity}</p>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-bg-primary p-5 rounded-xl border border-line">
                            <h3 className="text-accent-400 font-bold mb-4 flex items-center gap-2"><Truck className="w-4 h-4"/> Order Summary</h3>
                            <div className="flex justify-between text-sm text-text-secondary mb-2">
                                <span>Method:</span>
                                <span className="text-text-primary font-medium uppercase">{orderRow.paymentMethod}</span>
                            </div>
                            {orderRow.transactionId && (
                                <div className="flex justify-between text-sm text-text-secondary mb-4">
                                    <span>TrxID:</span>
                                    <span className="text-text-primary tabular-nums">{'Recorded for verification'}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg text-text-primary font-bold border-t border-line pt-2">
                                <span>Order Total:</span>
                                <span className="text-accent-400">৳{orderRow.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps for pending payments */}
                    {orderRow.paymentStatus === 'VERIFYING' && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-8">
                            <h4 className="text-primary-400 font-bold mb-2">Payment Verification Pending</h4>
                            <p className="text-text-secondary text-sm">We&apos;ve received your order and transaction ID. Our team will verify the payment before dispatch.</p>
                        </div>
                    )}

                    {orderRow.paymentMethod === 'cod' && (
                        <div className="bg-accent-400/10 border border-accent-400/20 rounded-xl p-5 mb-8 text-center">
                            <h4 className="text-accent-400 font-bold mb-2">Prepare exact change</h4>
                            <p className="text-text-secondary text-sm">Please keep <strong>৳{orderRow.total.toLocaleString()}</strong> ready for the delivery rider.</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <Link href="/my-orders" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full border-line text-text-primary hover:bg-bg-elevated">
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
