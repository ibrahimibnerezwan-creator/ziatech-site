import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import { Footer } from '@/components/layout/footer'

// Mock Data for Demo
const categoryProducts = Array.from({ length: 8 }).map((_, i) => ({
    id: `c-${i}`,
    name: i % 2 === 0 ? 'Arduino Uno R3 Original' : 'ESP32 Development Board',
    price: 1200 + (i * 100),
    image: i % 2 === 0
        ? 'https://images.unsplash.com/photo-1555664424-778a69fdb6b8?q=80&w=400'
        : 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400',
    category: 'Development Boards',
    rating: 4.5,
    reviews: 12 + i,
    stock: 20
}))

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string[] }>
}) {
    const { slug } = await params
    const categoryName = slug?.[0]?.replace('-', ' ') || 'All Products'

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-8 flex-1">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold capitalize text-white mb-2">{categoryName}</h1>
                        <p className="text-gray-400">Found {categoryProducts.length} results</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="border-white/10">
                            <Filter className="w-4 h-4 mr-2" /> Filters
                        </Button>
                        <select className="bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500">
                            <option>Sort by: Featured</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest Arrivals</option>
                        </select>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* SIDEBAR (Desktop) */}
                    <aside className="hidden md:block space-y-8 sticky top-24 h-fit">
                        <div className="space-y-4">
                            <h3 className="font-bold text-white">Price Range</h3>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-accent-500 rounded-full" />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>৳0</span>
                                <span>৳10,000</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-white mb-2">Brands</h3>
                            {['Arduino', 'Espressif', 'Raspberry Pi', 'Adafruit'].map((brand) => (
                                <label key={brand} className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                                    <input type="checkbox" className="rounded border-gray-600 bg-transparent focus:ring-accent-500 text-accent-500" />
                                    <span>{brand}</span>
                                </label>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-white mb-2">Availability</h3>
                            <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                                <input type="checkbox" className="rounded border-gray-600 bg-transparent focus:ring-accent-500 text-accent-500" />
                                <span>In Stock Only</span>
                            </label>
                        </div>
                    </aside>

                    {/* PRODUCT GRID */}
                    <div className="col-span-1 md:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <Button variant="ghost" className="bg-white/5 hover:bg-white/10">
                                Load More Products
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
