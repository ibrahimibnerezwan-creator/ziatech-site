import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ==================== USERS ====================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull().default('customer'), // customer, admin
  address: text('address'),
  city: text('city'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

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
  userId: text('user_id').references(() => users.id),
  status: text('status').notNull().default('PENDING'),
  total: real('total').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  address: text('address').notNull(),
  shippingCity: text('shipping_city').notNull(),
  deliveryCharge: real('delivery_charge').notNull().default(0),
  paymentMethod: text('payment_method').notNull(), // bkash, nagad, cod
  transactionId: text('transaction_id'), // For bKash/Nagad
  paymentStatus: text('payment_status').notNull().default('PENDING'), // PENDING, VERIFIED, FAILED
  courierTrackingId: text('courier_tracking_id'), // For Steadfast
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
  status: text('status').default('pending'), // pending, approved, rejected
  adminReply: text('admin_reply'), // New field for admin to respond
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ==================== STORE SETTINGS ====================
export const storeSettings = sqliteTable('store_settings', {
  key: text('key').primaryKey(), // e.g., 'phone', 'email', 'address', 'whatsapp', 'facebook'
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ==================== RELATIONS ====================
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

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

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
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

