import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productImages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const rows = await db
      .select({
        product: products,
        image: productImages,
      })
      .from(products)
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .where(eq(products.id, id));

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const result = {
      ...rows[0].product,
      images: rows.map((r) => r.image).filter(Boolean),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
