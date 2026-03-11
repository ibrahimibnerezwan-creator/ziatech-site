import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productImages, categories } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// GET all products (for Admin Dashboard)
export async function GET() {
  try {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        stock: products.stock,
        categoryName: categories.name,
        imageUrl: productImages.url,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .orderBy(desc(products.createdAt));

    // Deduplicate (join may produce multiple rows per product for multiple images)
    const seen = new Set<string>();
    const result = [];
    for (const row of rows) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      result.push(row);
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, description, stock, category, images } = body;

    if (!title || !price) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const productId = uuidv4();
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const now = new Date();

    await db.insert(products).values({
      id: productId,
      name: title,
      slug,
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      categoryId: category || null,
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
    });

    // Insert images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await db.insert(productImages).values({
          id: uuidv4(),
          productId,
          url: images[i],
          sortOrder: i,
        });
      }
    }

    return NextResponse.json({ success: true, id: productId });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Cascade delete handles product_images automatically
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
