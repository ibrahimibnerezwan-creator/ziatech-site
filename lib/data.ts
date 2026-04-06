import { db } from '@/db';
import { products, categories, productImages, brands, orders, orderItems, storeSettings, reviews } from '@/db/schema';
import { eq, desc, ne, isNotNull, sql } from 'drizzle-orm';

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
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      comparePrice: products.comparePrice,
      stock: products.stock,
      imageUrl: productImages.url,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .orderBy(desc(products.createdAt))
    .limit(limit * 3); // Fetch extra to handle duplicate product rows from join

  // Deduplicate: take first image per product
  const seen = new Set<string>();
  const result: ProductForCard[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    result.push({
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: row.price,
      oldPrice: row.comparePrice ?? undefined,
      image: row.imageUrl || 'https://via.placeholder.com/400',
      category: row.categoryName || 'Uncategorized',
      rating: 0,
      reviews: 0,
      isNew: true,
      stock: row.stock,
    });
    if (result.length >= limit) break;
  }
  return result;
}

export async function getFlashSaleProducts(limit = 4): Promise<ProductForCard[]> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      comparePrice: products.comparePrice,
      stock: products.stock,
      imageUrl: productImages.url,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .where(isNotNull(products.comparePrice))
    .limit(limit * 3);

  const seen = new Set<string>();
  const result: ProductForCard[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    result.push({
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: row.price,
      oldPrice: row.comparePrice ?? undefined,
      image: row.imageUrl || 'https://via.placeholder.com/400',
      category: row.categoryName || 'Uncategorized',
      rating: 0,
      reviews: 0,
      stock: row.stock,
    });
    if (result.length >= limit) break;
  }
  return result;
}

export async function getProductBySlug(slug: string) {
  const productRows = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (productRows.length === 0) return null;

  const product = productRows[0];
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);

  const category = product.categoryId
    ? (await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1))[0]
    : null;

  const brand = product.brandId
    ? (await db.select().from(brands).where(eq(brands.id, product.brandId)).limit(1))[0]
    : null;

  return { ...product, images, category, brand };
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4): Promise<ProductForCard[]> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      stock: products.stock,
      imageUrl: productImages.url,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .where(eq(products.categoryId, categoryId))
    .limit(limit * 3);

  const seen = new Set<string>();
  const result: ProductForCard[] = [];
  for (const row of rows) {
    if (seen.has(row.id) || row.id === excludeId) continue;
    seen.add(row.id);
    result.push({
      id: row.id,
      name: row.name,
      slug: row.slug || '',
      price: row.price,
      image: row.imageUrl || 'https://via.placeholder.com/400',
      category: row.categoryName || 'Uncategorized',
      rating: 0,
      reviews: 0,
      stock: row.stock,
    });
    if (result.length >= limit) break;
  }
  return result;
}

export async function getProductsByCategory(slug: string, limit = 20): Promise<{ products: ProductForCard[], categoryName: string }> {
  let categoryName = 'All Products';
  let query = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      stock: products.stock,
      imageUrl: productImages.url,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(categories, eq(categories.id, products.categoryId));

  if (slug && slug !== 'all') {
    // Find category by slug first
    const catRows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (catRows.length > 0) {
      categoryName = catRows[0].name;
      // Filter products by categoryId
      // Casting to any because Drizzle's where builder can be tricky with conditionals
      query = query.where(eq(products.categoryId, catRows[0].id)) as any;
    }
  }

  const rows = await query.limit(limit * 3);

  const seen = new Set<string>();
  const result: ProductForCard[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    result.push({
      id: row.id,
      name: row.name,
      slug: row.slug || '',
      price: row.price,
      image: row.imageUrl || 'https://via.placeholder.com/400',
      category: row.categoryName || 'Uncategorized',
      rating: 0,
      reviews: 0,
      stock: row.stock,
    });
    if (result.length >= limit) break;
  }
  return { products: result, categoryName };
}

// ==================== ADMIN QUERIES ====================

export async function getAllProducts() {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      stock: products.stock,
      categoryName: categories.name,
      brandName: brands.name,
    })
    .from(products)
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .orderBy(desc(products.createdAt));

  return rows;
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

export async function getAllOrders() {
  const result = await db.select({
    id: orders.id,
    status: orders.status,
    total: orders.total,
    customerName: orders.customerName,
    customerPhone: orders.customerPhone,
    address: orders.address,
    shippingCity: orders.shippingCity,
    paymentMethod: orders.paymentMethod,
    paymentStatus: orders.paymentStatus,
    transactionId: orders.transactionId,
    createdAt: orders.createdAt,
  })
  .from(orders)
  .orderBy(desc(orders.createdAt));

  return result;
}
