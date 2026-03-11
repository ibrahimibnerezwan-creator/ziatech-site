import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'

export default function CartPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1">
                <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

                <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl glass-card">
                    <ShoppingCart className="w-16 h-16 text-gray-500 mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-400 mb-8 max-w-md text-center">
                        Looks like you haven&apos;t added any components to your cart yet. Browse our categories and start building your next project!
                    </p>
                    <Link href="/">
                        <Button size="lg" className="bg-accent-500 text-black hover:bg-accent-600 font-bold uppercase tracking-wider">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    )
}
