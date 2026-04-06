import { Footer } from '@/components/layout/footer'
import { Hexagon, Users, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1 max-w-4xl">
                <h1 className="text-4xl font-display font-bold text-white mb-4">About ZiaTech</h1>
                <p className="text-lg text-text-secondary mb-12">Your trusted source for premium electronics and tech components in Bangladesh.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="forge-card p-8 space-y-3">
                        <Hexagon className="w-8 h-8 text-primary-400" strokeWidth={1.5} />
                        <h3 className="text-xl font-display font-bold text-white">Quality Components</h3>
                        <p className="text-text-secondary text-sm">We source only genuine, high-quality electronics and components from trusted manufacturers worldwide.</p>
                    </div>
                    <div className="forge-card p-8 space-y-3">
                        <Zap className="w-8 h-8 text-primary-400" />
                        <h3 className="text-xl font-display font-bold text-white">Fast Delivery</h3>
                        <p className="text-text-secondary text-sm">Quick processing and reliable shipping across Bangladesh. Most orders ship within 24 hours.</p>
                    </div>
                    <div className="forge-card p-8 space-y-3">
                        <Shield className="w-8 h-8 text-primary-400" />
                        <h3 className="text-xl font-display font-bold text-white">Warranty Support</h3>
                        <p className="text-text-secondary text-sm">All products come with manufacturer warranty. We stand behind everything we sell.</p>
                    </div>
                    <div className="forge-card p-8 space-y-3">
                        <Users className="w-8 h-8 text-primary-400" />
                        <h3 className="text-xl font-display font-bold text-white">Expert Team</h3>
                        <p className="text-text-secondary text-sm">Our team of tech enthusiasts is always ready to help you find the right components for your projects.</p>
                    </div>
                </div>

                <div className="forge-card p-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-4">Our Story</h2>
                    <div className="text-text-secondary space-y-4 leading-relaxed">
                        <p>ZiaTech started with a simple mission: make quality electronics accessible to everyone in Bangladesh. From hobbyists building their first Arduino project to professionals designing industrial systems, we serve all levels of tech enthusiasts.</p>
                        <p>Located in the heart of Dhaka, we have grown from a small components shop to one of the most trusted names in electronics retail. Our commitment to quality, fair pricing, and excellent customer service has earned us a loyal customer base across the country.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
