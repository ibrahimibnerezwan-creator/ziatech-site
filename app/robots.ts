import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/cart', '/checkout', '/login', '/register', '/my-orders', '/wishlist', '/order-confirmation/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
