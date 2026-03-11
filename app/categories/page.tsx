import { getAllCategoriesWithCount } from '@/lib/data'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { Layers } from 'lucide-react'

export default async function CategoriesPage() {
    const categories = await getAllCategoriesWithCount()

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">All Categories</h1>
                <p className="text-gray-400 mb-8">Browse our full range of product collections.</p>

                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                        <Layers className="w-12 h-12 text-gray-500 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">No categories yet</h2>
                        <p className="text-gray-400">Categories will appear here once they are added by the admin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-accent-500/50 transition-all"
                            >
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-accent-500/20 to-primary-500/20 flex items-center justify-center">
                                        <Layers className="w-12 h-12 text-white/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                                    <p className="text-gray-300 text-sm">{cat.productCount} Products</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
