import { getProductBySlug, getRelatedProducts } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, ChevronRight, Truck, MessageCircle } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { ProductActions } from '@/components/product/product-actions'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ReviewForm } from '@/components/product/ReviewForm'

export const revalidate = 3600

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  let specs: Record<string, unknown> = {}
  try { const parsed = product.specs ? JSON.parse(product.specs) : {}; if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) specs = parsed } catch { /* Retain compatibility with older free-text specifications. */ }
  const related = product.categoryId ? await getRelatedProducts(product.categoryId, product.id, 4) : []
  const savings = product.comparePrice && product.comparePrice > product.price ? product.comparePrice - product.price : 0

  return <div className="store-container shop-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight /><Link href="/category/all">Components</Link>{product.category && <><ChevronRight /><Link href={`/category/${product.category.slug}`}>{product.category.name}</Link></>}</nav>
    <div className="product-layout">
      <ProductGallery images={product.images} name={product.name} comparePrice={product.comparePrice} price={product.price} />
      <div className="product-info">
        <p className="product-category">{product.brand?.name || product.category?.name || 'Electronics & components'}</p>
        <h1>{product.name}</h1>
        <div className="product-meta"><span className={`stock-label${product.stock > 0 ? '' : ' stock-label-out'}`}>{product.stock > 0 ? `In stock · ${product.stock} available` : 'Out of stock'}</span><a href="#reviews" className="product-rating">{product.reviewCount > 0 && <Star size={14} />}{product.reviewCount > 0 ? `${product.avgRating} (${product.reviewCount} reviews)` : 'Be the first to review'}</a></div>
        <div className="detail-price"><div className="product-price"><strong>৳{product.price.toLocaleString()}</strong>{savings > 0 && <del>৳{product.comparePrice?.toLocaleString()}</del>}</div>{savings > 0 && <p>You save ৳{savings.toLocaleString()}</p>}</div>
        {product.description && <p className="product-description">{product.description}</p>}
        <ProductActions product={{ id: product.id, name: product.name, price: product.price, image: product.images[0]?.url || '', slug: product.slug, stock: product.stock }} />
        <div className="delivery-note"><Link href="/shipping"><Truck size={19} /><span>Delivered across Bangladesh<small>Dhaka ৳60 · Suburbs ৳100 · Outside Dhaka ৳120</small></span></Link><Link href="/contact"><MessageCircle size={19} /><span>Need to check compatibility?<small>Talk to us before you order.</small></span></Link></div>
      </div>
    </div>
    <section className="product-bottom-section"><h2>Technical specifications</h2>{Object.keys(specs).length > 0 ? <table className="spec-table"><tbody>{Object.entries(specs).map(([key, value]) => <tr key={key}><th scope="row">{key}</th><td>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</td></tr>)}</tbody></table> : <p className="text-sm text-text-secondary">Need a specific detail? <Link className="underline underline-offset-4" href="/contact">Ask us about this component.</Link></p>}</section>
    <section id="reviews" className="product-bottom-section"><h2>From the workbench</h2><div className="reviews-layout"><div>{product.reviews.length > 0 ? product.reviews.map(review => <article key={review.id} className="review-card"><header><strong>{review.reviewerName}</strong><span className="product-rating" aria-label={`${review.rating} out of 5 stars`}>{Array.from({length: 5}, (_, i) => <Star key={i} size={12} style={{fill: i < review.rating ? 'currentColor' : 'none'}} />)}</span></header><time dateTime={new Date(review.createdAt).toISOString()}>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>{review.comment && <p>{review.comment}</p>}{review.adminReply && <div className="review-reply"><strong>ZiaTech replied</strong><p>{review.adminReply}</p></div>}</article>) : <div className="empty-state"><Star size={28} /><h3 className="font-semibold">Tried it in your project?</h3><p>No reviews yet. Share your experience with other makers.</p></div>}</div><ReviewForm productId={product.id} /></div></section>
    {related.length > 0 && <section className="product-bottom-section"><h2>Keep building.</h2><div className={`product-grid ${related.length > 3 ? 'product-grid-four' : ''}`}>{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}
  </div>
}
