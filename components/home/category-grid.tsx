import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getAllCategoriesWithCount } from '@/lib/data'
import { CategoryGridClient } from './category-grid-client'

export async function CategoryGrid() {
    const dbCategories = await getAllCategoriesWithCount()

    // Map DB categories to the required props for the grid, applying dynamic sizing patterns based on index
    const mappedCategories = dbCategories.map((cat, i) => {
        // Pattern for the grid layout (similar to the hardcoded one)
        let className = 'md:col-span-1 md:row-span-1'
        let gradient = 'from-blue-500/20 to-cyan-500/20'

        if (i % 4 === 0) {
            className = 'md:col-span-2 md:row-span-2'
            gradient = 'from-blue-500/20 to-cyan-500/20'
        } else if (i % 4 === 1) {
            gradient = 'from-purple-500/20 to-pink-500/20'
        } else if (i % 4 === 2) {
            gradient = 'from-green-500/20 to-emerald-500/20'
        } else if (i % 4 === 3) {
            className = 'md:col-span-2 md:row-span-1'
            gradient = 'from-red-500/20 to-orange-500/20'
        }

        return {
            id: cat.id,
            slug: cat.slug,
            name: cat.name,
            description: `${cat.productCount} Products`,
            className,
            gradient,
            // Fallback to a placeholder gradient if no image was uploaded
            image: cat.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop'
        }
    })

    return (
        <section className="container px-4 mx-auto">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <p className="text-primary-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">Browse by category</p>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                        Explore Categories
                    </h2>
                    <p className="text-text-secondary mt-2">Everything you need for your next invention.</p>
                </div>
                <Link
                    href="/categories"
                    className="hidden md:flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors group text-sm font-bold"
                >
                    View All <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <CategoryGridClient categories={mappedCategories} />
        </section>
    )
}
