import { Footer } from '@/components/layout/footer'
import { Truck, RotateCcw, Shield, HelpCircle } from 'lucide-react'

export default function ShippingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Shipping &amp; Returns</h1>
                <p className="text-lg text-gray-400 mb-12">Everything you need to know about our delivery and return policies.</p>

                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <Truck className="w-7 h-7 text-accent-400" />
                            <h2 className="text-2xl font-bold text-white">Shipping Policy</h2>
                        </div>
                        <div className="text-gray-400 space-y-3 leading-relaxed">
                            <p>We deliver across Bangladesh through trusted courier partners.</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong className="text-white">Dhaka City:</strong> 1-2 business days</li>
                                <li><strong className="text-white">Outside Dhaka:</strong> 3-5 business days</li>
                                <li><strong className="text-white">Shipping Cost:</strong> Calculated at checkout based on weight and location</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <RotateCcw className="w-7 h-7 text-accent-400" />
                            <h2 className="text-2xl font-bold text-white">Return Policy</h2>
                        </div>
                        <div className="text-gray-400 space-y-3 leading-relaxed">
                            <p>We want you to be happy with your purchase. If something isn&apos;t right:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Returns accepted within <strong className="text-white">7 days</strong> of delivery</li>
                                <li>Item must be unused and in original packaging</li>
                                <li>Defective products can be exchanged or refunded</li>
                                <li>Contact us via WhatsApp or email to initiate a return</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <Shield className="w-7 h-7 text-accent-400" />
                            <h2 className="text-2xl font-bold text-white">Warranty</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed">All products come with the manufacturer&apos;s warranty. For warranty claims, please contact us with your order number and a description of the issue.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
