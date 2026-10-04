import type { MetadataRoute } from 'next'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allProducts, allCategories] = await Promise.all([
    db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products),
    db.select({ slug: categories.slug, updatedAt: categories.updatedAt }).from(categories),
  ])

  return [
    ...['', '/categories', '/category/all', '/terms', '/about', '/contact', '/blog', '/shipping', '/privacy'].map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
      priority: path === '' ? 1 : 0.6,
    })),
    ...allProducts.map((product) => ({
      url: `${SITE_URL}/product/${encodeURIComponent(product.slug)}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...allCategories.map((category) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(category.slug)}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
