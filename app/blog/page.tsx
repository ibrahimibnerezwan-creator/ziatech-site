import { Footer } from '@/components/layout/footer'
import { BookOpen } from 'lucide-react'

export default function BlogPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Project Tutorials</h1>
                <p className="text-lg text-gray-400 mb-12">Learn how to build amazing projects with our components.</p>

                <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                    <BookOpen className="w-12 h-12 text-gray-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
                    <p className="text-gray-400 text-center max-w-md">We&apos;re preparing tutorials and project guides to help you get the most out of our components. Check back soon!</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
