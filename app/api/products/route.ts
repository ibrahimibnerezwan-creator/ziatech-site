import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productImages, categories } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET all products with full images array for admin management
export async function GET() {
  try {
    const allProducts = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
      with: {
        images: {
          orderBy: [asc(productImages.sortOrder)],
        },
        category: true,
      },
    });

    const result = allProducts.map(p => ({
      id: p.id,
      name: p.name,
      title: p.name,
      slug: p.slug,
      price: p.price,
      comparePrice: p.comparePrice,
      stock: p.stock,
      description: p.description,
      categoryId: p.categoryId,
      categoryName: p.category?.name || 'Uncategorized',
      category: p.category?.name || 'Uncategorized',
      isFeatured: p.isFeatured,
      specs: p.specs,
      imageUrl: p.images[0]?.url || '',
      images: p.images.map(img => ({ id: img.id, url: img.url })),
      createdAt: p.createdAt,
    }));

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
    const isAdmin = await isAuthenticatedAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, name, price, comparePrice, description, stock, category, categoryId, images, isFeatured, specs } = body;

    const prodName = (title || name || '').trim();
    if (!prodName || price === undefined) {
      return NextResponse.json({ error: 'Product name and price are required' }, { status: 400 });
    }

    // Resolve category ID if category name string provided
    let resolvedCategoryId = categoryId || null;
    if (!resolvedCategoryId && category) {
      const catRecord = await db.query.categories.findFirst({
        where: eq(categories.name, category),
      });
      if (catRecord) {
        resolvedCategoryId = catRecord.id;
      } else {
        // Create category if it doesn't exist
        const newCatId = uuidv4();
        const catSlug = category.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        await db.insert(categories).values({
          id: newCatId,
          name: category,
          slug: catSlug || `cat-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        resolvedCategoryId = newCatId;
      }
    }

    const productId = uuidv4();
    const baseSlug = prodName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const now = new Date();

    await db.insert(products).values({
      id: productId,
      name: prodName,
      slug,
      description: description || '',
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      stock: parseInt(stock) || 0,
      categoryId: resolvedCategoryId,
      isFeatured: !!isFeatured,
      specs: specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : null,
      createdAt: now,
      updatedAt: now,
    });

    // Insert images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i]?.url;
        if (imgUrl) {
          await db.insert(productImages).values({
            id: uuidv4(),
            productId,
            url: imgUrl,
            sortOrder: i,
          });
        }
      }
    }

    return NextResponse.json({ success: true, id: productId });
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

// PATCH update product fields
export async function PATCH(request: Request) {
  try {
    const isAdmin = await isAuthenticatedAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, name, price, comparePrice, description, stock, category, categoryId, isFeatured, specs } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const patch: Record<string, any> = { updatedAt: new Date() };
    if (title || name) patch.name = (title || name).trim();
    if (price !== undefined) patch.price = parseFloat(price);
    if (comparePrice !== undefined) patch.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
    if (description !== undefined) patch.description = description;
    if (stock !== undefined) patch.stock = parseInt(stock);
    if (isFeatured !== undefined) patch.isFeatured = !!isFeatured;
    if (specs !== undefined) patch.specs = typeof specs === 'string' ? specs : JSON.stringify(specs);

    if (categoryId !== undefined) {
      patch.categoryId = categoryId;
    } else if (category !== undefined) {
      const catRecord = await db.query.categories.findFirst({
        where: eq(categories.name, category),
      });
      if (catRecord) patch.categoryId = catRecord.id;
    }

    await db.update(products).set(patch).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request: Request) {
  try {
    const isAdmin = await isAuthenticatedAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Delete related images first, then product
    await db.delete(productImages).where(eq(productImages.productId, id));
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
