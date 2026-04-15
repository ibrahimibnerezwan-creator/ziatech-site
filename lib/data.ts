import { db } from '@/db';
import { products, categories, productImages, brands, orders, orderItems, storeSettings, reviews, users } from '@/db/schema';
import { eq, desc, ne, isNotNull, sql, and, or, like } from 'drizzle-orm';

// ==================== PRODUCT QUERIES ====================

export interface ProductForCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  stock: number;
}

export async function getNewArrivals(limit = 4): Promise<ProductForCard[]> {
  const result = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    limit: limit,
    with: {
      images: {
        limit: 1,
        orderBy: [desc(productImages.sortOrder)],
      },
      category: true,
      reviews: {
        where: eq(reviews.status, 'approved'),
      }
    }
  });

  return result.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.comparePrice ?? undefined,
    image: p.images[0]?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop', // Better placeholder
    category: p.category?.name || 'Uncategorized',
    rating: p.reviews.length > 0 
      ? parseFloat((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
      : 0,
    reviews: p.reviews.length,
    isNew: true,
    stock: p.stock,
  }));
}

export async function getFeaturedProducts(limit = 4): Promise<ProductForCard[]> {
  const result = await db.query.products.findMany({
    where: eq(products.isFeatured, true),
    orderBy: [desc(products.createdAt)],
    limit: limit,
    with: {
      images: {
        limit: 1,
        orderBy: [desc(productImages.sortOrder)],
      },
      category: true,
      reviews: {
        where: eq(reviews.status, 'approved'),
      }
    }
  });

  return result.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.comparePrice ?? undefined,
    image: p.images[0]?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
    category: p.category?.name || 'Uncategorized',
    rating: p.reviews.length > 0 
      ? parseFloat((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
      : 0,
    reviews: p.reviews.length,
    stock: p.stock,
  }));
}

export async function getFlashSaleProducts(limit = 4): Promise<ProductForCard[]> {
  const result = await db.query.products.findMany({
    where: isNotNull(products.comparePrice),
    orderBy: [desc(products.createdAt)],
    limit: limit,
    with: {
      images: {
        limit: 1,
        orderBy: [desc(productImages.sortOrder)],
      },
      category: true,
      reviews: {
        where: eq(reviews.status, 'approved'),
      }
    }
  });

  return result.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.comparePrice ?? undefined,
    image: p.images[0]?.url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop',
    category: p.category?.name || 'Uncategorized',
    rating: p.reviews.length > 0 
      ? parseFloat((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
      : 0,
    reviews: p.reviews.length,
    stock: p.stock,
  }));
}



export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      images: {
        orderBy: [desc(productImages.sortOrder)],
      },
      category: true,
      brand: true,
      reviews: {
        where: eq(reviews.status, 'approved'),
        orderBy: [desc(reviews.createdAt)],
      },
    }
  });

  if (!product) return null;

  // Calculate rating stats
  const approvedReviews = product.reviews || [];
  const reviewCount = approvedReviews.length;
  const avgRating = reviewCount > 0 
    ? parseFloat((approvedReviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewCount).toFixed(1))
    : 0;

  return { 
    ...product, 
    avgRating, 
    reviewCount,
    rating: avgRating // Aliased for consistency with other parts of UI
  };
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4): Promise<ProductForCard[]> {
  const result = await db.query.products.findMany({
    where: and(eq(products.categoryId, categoryId), ne(products.id, excludeId)),
    limit: limit,
    with: {
      images: {
        limit: 1,
        orderBy: [desc(productImages.sortOrder)],
      },
      category: true,
      reviews: {
        where: eq(reviews.status, 'approved'),
      }
    }
  });

  return result.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.comparePrice ?? undefined,
    image: p.images[0]?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
    category: p.category?.name || 'Uncategorized',
    rating: p.reviews.length > 0 
      ? parseFloat((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
      : 0,
    reviews: p.reviews.length,
    stock: p.stock,
  }));
}

export async function getProductsByCategory(slug: string, limit = 20): Promise<{ products: ProductForCard[], categoryName: string }> {
  let categoryId: string | undefined;
  let categoryName = 'All Products';

  if (slug && slug !== 'all') {
    const catRows = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
    if (catRows) {
      categoryName = catRows.name;
      categoryId = catRows.id;
    }
  }

  const result = await db.query.products.findMany({
    where: categoryId ? eq(products.categoryId, categoryId) : undefined,
    limit: limit,
    with: {
      images: {
        limit: 1,
        orderBy: [desc(productImages.sortOrder)],
      },
      category: true,
      reviews: {
        where: eq(reviews.status, 'approved'),
      }
    }
  });

  const productsForCard: ProductForCard[] = result.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug || '',
    price: p.price,
    oldPrice: p.comparePrice ?? undefined,
    image: p.images[0]?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
    category: p.category?.name || 'Uncategorized',
    rating: p.reviews.length > 0 
      ? parseFloat((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
      : 0,
    reviews: p.reviews.length,
    stock: p.stock,
  }));

  return { products: productsForCard, categoryName };
}

// ==================== ADMIN QUERIES ====================

export async function getAllProducts() {
  const result = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    with: {
      images: {
        limit: 1,
        orderBy: [desc(productImages.sortOrder)],
      },
      category: true,
      brand: true,
    }
  });

  return result.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    stock: p.stock,
    categoryName: p.category?.name || 'Uncategorized',
    brandName: p.brand?.name || 'Store Brand',
    imageUrl: p.images[0]?.url,
  }));
}

export async function getProductById(id: string) {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (rows.length === 0) return null;

  const product = rows[0];
  const images = await db.select().from(productImages).where(eq(productImages.productId, id));

  return { ...product, images };
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function getProductCount() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(products);
  return result[0].count;
}

export async function getOrderCount() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(orders);
  return result[0].count;
}

export async function getUserCount() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(users);
  return result[0].count;
}

export async function getTotalRevenue() {
  const result = await db.select({ 
    sum: sql<number>`sum(${orders.total})` 
  })
  .from(orders)
  .where(eq(orders.status, 'DELIVERED'));
  
  return result[0].sum || 0;
}

export async function getStoreSettings() {
  const result = await db.select().from(storeSettings);
  return result.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

export async function getStoreSetting(key: string, defaultValue = '') {
  const result = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
  return result.length > 0 ? result[0].value : defaultValue;
}

export async function getAllCategoriesWithCount() {
  const result = await db.select({
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
    image: categories.image,
    productCount: sql<number>`count(${products.id})`,
  })
  .from(categories)
  .leftJoin(products, eq(products.categoryId, categories.id))
  .groupBy(categories.id)
  .orderBy(categories.name);
  
  return result;
}

export async function getCategoryById(id: string) {
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllReviews() {
  const result = await db.select({
    id: reviews.id,
    rating: reviews.rating,
    comment: reviews.comment,
    reviewerName: reviews.reviewerName,
    createdAt: reviews.createdAt,
    status: reviews.status,
    adminReply: reviews.adminReply,
    productName: products.name,
  })
  .from(reviews)
  .leftJoin(products, eq(reviews.productId, products.id))
  .orderBy(desc(reviews.createdAt));

  return result;
}

export async function getAllOrders(filters?: { status?: string; search?: string }) {
  const result = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      items: true,
      user: true,
    }
  });

  if (!filters) return result;

  return result.filter(order => {
    const matchesStatus = !filters.status || filters.status === 'ALL' || order.status === filters.status;
    
    let matchesSearch = true;
    if (filters.search) {
      const searchVal = filters.search.toLowerCase();
      matchesSearch = (
        order.customerName?.toLowerCase().includes(searchVal) ||
        order.customerPhone?.toLowerCase().includes(searchVal) ||
        order.id.toLowerCase().includes(searchVal)
      );
    }

    return matchesStatus && matchesSearch;
  });
}

export async function getOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: {
        with: {
          product: {
            with: {
              images: {
                limit: 1,
                orderBy: [desc(productImages.sortOrder)],
              }
            }
          }
        }
      },
      user: true,
    }
  });
}

export async function getRecentReviews(limit = 10) {
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      status: reviews.status,
      createdAt: reviews.createdAt,
      userName: reviews.reviewerName,
      productName: products.name,
    })
    .from(reviews)
    .innerJoin(products, eq(reviews.productId, products.id))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}
