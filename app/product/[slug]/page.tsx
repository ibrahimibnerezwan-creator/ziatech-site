import { getProductBySlug, getRelatedProducts } from '@/lib/data'
import { notFound } from 'next/navigation'

export const revalidate = 3600;
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Star, ChevronRight, Cpu, Truck, Shield, RotateCcw } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { ProductActions } from '@/components/product/product-actions'
import { Footer } from '@/components/layout/footer'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    const specs = product.specs ? JSON.parse(product.specs) : {}

    const relatedProductsFormatted = product.categoryId
        ? await getRelatedProducts(product.categoryId, product.id, 4)
        : []

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary">
            <div className="container mx-auto px-4 pt-8 pb-16">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-text-muted mb-10">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    {product.category && (
                        <>
                            <Link href={`/category/${product.category.slug}`} className="hover:text-white transition-colors">{product.category.name}</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </>
                    )}
                    <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* Product Detail Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-bg-elevated/60 border border-white/5 backdrop-blur-xl group">
                            <Image
                                src={product.images[0]?.url || '/placeholder.png'}
                                alt={product.name}
                                fill
                                className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                                priority
                            />
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isFeatured && (
                                    <Badge className="bg-gold-500 text-black font-bold text-xs">Featured</Badge>
                                )}
                                {product.comparePrice && (
                                    <Badge variant="destructive" className="font-bold text-xs">
                                        -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {product.images.map((img, idx) => (
                                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-bg-elevated/40 border border-white/5 cursor-pointer hover:border-primary-500/30 transition-all duration-200 group/thumb">
                                        <Image src={img.url} alt={`${product.name} ${idx + 1}`} fill className="object-cover group-hover/thumb:scale-105 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6 lg:pt-4">
                        <div>
                            {product.brand?.name && (
                                <p className="text-primary-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">{product.brand.name}</p>
                            )}
                            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4 tracking-tight leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.avgRating) ? 'fill-gold-400 text-gold-400' : 'text-white/10'}`} />
                                    ))}
                                    <span className="text-text-secondary ml-2">{product.avgRating} ({product.reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-bg-elevated/40 rounded-2xl p-6 border border-white/5">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-display font-bold text-white">৳{product.price.toLocaleString()}</span>
                                {product.comparePrice && (
                                    <span className="text-xl text-text-muted line-through">৳{product.comparePrice.toLocaleString()}</span>
                                )}
                            </div>
                            {product.comparePrice && (
                                <p className="text-emerald-400 text-sm font-medium mt-2">
                                    You save ৳{(product.comparePrice - product.price).toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                                    <span className="text-emerald-400 font-medium text-sm">In Stock ({product.stock} available)</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <span className="text-red-400 font-medium text-sm">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="border-t border-white/5 pt-6">
                                <p className="text-text-secondary leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <ProductActions
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0]?.url || '',
                                slug: product.slug,
                                stock: product.stock
                            }}
                        />

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 pt-4">
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <Truck className="w-5 h-5 text-primary-400 mb-2" />
                                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <Shield className="w-5 h-5 text-emerald-400 mb-2" />
                                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Guaranteed</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <RotateCcw className="w-5 h-5 text-accent-400 mb-2" />
                                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
                            <Cpu className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white">Technical Specifications</h2>
                    </div>
                    <div className="bg-bg-elevated/40 border border-white/5 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
                        {Object.keys(specs).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                                {Object.entries(specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-3.5 border-b border-white/5 group hover:border-primary-500/20 transition-colors">
                                        <span className="text-text-muted text-sm">{key}</span>
                                        <span className="text-white font-mono text-sm font-medium">{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-muted text-center py-10 text-sm">No technical specifications available for this product.</p>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gold-500/10 rounded-xl border border-gold-500/20">
                                <Star className="w-5 h-5 text-gold-400" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white">Customer Reviews</h2>
                        </div>
                        {product.reviewCount > 0 && (
                            <div className="text-right">
                                <div className="text-3xl font-display font-bold text-white leading-none">{product.avgRating}</div>
                                <div className="flex items-center gap-0.5 mt-1 justify-end">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < Math.round(product.avgRating || 0) ? 'fill-gold-400 text-gold-400' : 'text-white/10'}`} />
                                    ))}
                                </div>
                                <p className="text-xs text-text-muted mt-1">{product.reviewCount} reviews</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review: any) => (
                                <div key={review.id} className="bg-bg-elevated/40 border border-white/5 p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden group hover:border-primary-500/15 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500/10 group-hover:bg-primary-500/40 transition-colors rounded-l-full"></div>
                                    <div className="flex justify-between items-start mb-4 pl-3">
                                        <div>
                                            <p className="text-white font-bold text-sm">{review.reviewerName}</p>
                                            <p className="text-xs text-text-muted mt-0.5">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-white/10'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm text-text-secondary leading-relaxed pl-3">{review.comment}</p>
                                    )}
                                    {review.adminReply && (
                                        <div className="mt-4 pt-4 border-t border-white/5 ml-3">
                                            <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-1">Store Response</p>
                                            <p className="text-xs text-text-muted leading-relaxed">{review.adminReply}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-2 text-center py-16 bg-bg-elevated/20 border border-dashed border-white/5 rounded-2xl">
                                <Star className="w-8 h-8 text-white/10 mx-auto mb-3" />
                                <p className="text-text-muted text-sm">No reviews yet. Be the first to share your experience.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProductsFormatted.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-display font-bold text-white mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProductsFormatted.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
