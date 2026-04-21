import { Footer } from '@/components/layout/footer'
import { getProductsByCategory } from '@/lib/data'
import { CategoryResults } from './category-results'

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string[] }>
    searchParams: Promise<{ q?: string }>
}) {
    const { slug } = await params
    const { q } = await searchParams
    const categorySlug = slug?.[0] || 'all'

    const { products: categoryProducts, categoryName } = await getProductsByCategory(categorySlug)

    const query = (q || '').trim().toLowerCase()
    const filtered = query
        ? categoryProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        )
        : categoryProducts

    const heading = query ? `Results for "${q}"` : categoryName

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-8 flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold capitalize text-white mb-2">{heading}</h1>
                        <p className="text-gray-400">Found {filtered.length} results{query && categorySlug !== 'all' ? ` in ${categoryName}` : ''}</p>
                    </div>
                </div>

                <CategoryResults products={filtered} />
            </div>

            <Footer />
        </div>
    )
}
