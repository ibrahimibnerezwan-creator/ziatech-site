import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ==================== PRODUCTS ====================
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  price: real('price').notNull(),
  comparePrice: real('compare_price'),
  stock: integer('stock').notNull().default(0),
  specs: text('specs'), // JSON string
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  categoryId: text('category_id').references(() => categories.id),
  brandId: text('brand_id').references(() => brands.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ==================== PRODUCT IMAGES ====================
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').default(0),
});

// ==================== CATEGORIES ====================
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  parentId: text('parent_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ==================== BRANDS ====================
export const brands = sqliteTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
});

// ==================== ORDERS ====================
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  status: text('status').notNull().default('PENDING'),
  total: real('total').notNull(),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  address: text('address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ==================== ORDER ITEMS ====================
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

// ==================== REVIEWS ====================
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  reviewerName: text('reviewer_name').notNull().default('Anonymous'),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  status: text('status').default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ==================== RELATIONS ====================
import { relations } from 'drizzle-orm';

export const productsRelations = relations(products, ({ many, one }) => ({
  images: many(productImages),
  reviews: many(reviews),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

