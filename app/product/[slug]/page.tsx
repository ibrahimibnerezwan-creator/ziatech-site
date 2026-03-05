import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const revalidate = 3600; // Revalidate every hour
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { ProductActions } from '@/components/product/product-actions'

export default async function ProductPage({ params }: { params: { slug: string } }) {
    // Fetch product from database
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: {
            images: true,
            category: true,
            brand: true
        }
    })

    // If product not found, show 404
    if (!product) {
        notFound()
    }

    // Parse specs from JSON string
    const specs = product.specs ? JSON.parse(product.specs) : {}

    // Fetch related products from same category
    const relatedProducts = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            id: { not: product.id } // Exclude current product
        },
        take: 4,
        include: {
            images: true,
            category: true
        }
    })

    // Map related products to ProductCard format
    const relatedProductsFormatted = relatedProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0]?.url || 'https://via.placeholder.com/400',
        category: p.category?.name || 'Uncategorized',
        rating: 0,
        reviews: 0,
        stock: p.stock
    }))

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-16">
            <div className="container mx-auto px-4">

                {/* Breadcrumb */}
                <div className="text-sm text-gray-400 mb-8">
                    <span>Home</span> / <span>{product.category?.name}</span> / <span className="text-white">{product.name}</span>
                </div>

                {/* Product Detail Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                            <Image
                                src={product.images[0]?.url || 'https://via.placeholder.com/800'}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            {product.isFeatured && (
                                <Badge className="absolute top-4 left-4 bg-gold-500 text-black">Featured</Badge>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-accent-400 transition-colors">
                                        <Image src={img.url} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                                    ))}
                                    <span className="text-gray-400 ml-2">(0 reviews)</span>
                                </div>
                                <span className="text-gray-500">|</span>
                                <span className="text-gray-400">Brand: <span className="text-accent-400">{product.brand?.name || 'Generic'}</span></span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-bold text-white">৳{product.price.toLocaleString()}</span>
                            {product.comparePrice && (
                                <>
                                    <span className="text-2xl text-gray-500 line-through">৳{product.comparePrice.toLocaleString()}</span>
                                    <Badge variant="neon" className="text-sm">
                                        Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-emerald-400 font-medium">In Stock ({product.stock} available)</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <span className="text-red-400 font-medium">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="border-t border-white/10 pt-6">
                            <p className="text-gray-300 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Actions */}
                        <ProductActions
                            product={{
                                id: product.id,
                                name: product.name,
                                stock: product.stock
                            }}
                        />
                    </div>
                </div>

                {/* Specifications Tab */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6">Technical Specifications</h2>
                    <div className="glass-card p-8">
                        {Object.keys(specs).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-3 border-b border-white/5">
                                        <span className="text-gray-400">{key}</span>
                                        <span className="text-white font-medium">{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No specifications available</p>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProductsFormatted.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProductsFormatted.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
