import { saveProduct, removeProduct } from '@/lib/catalogue';
import { errorResponse, textValue } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
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
  if (!(await isAuthenticatedAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try { const id=await saveProduct(await request.json()); revalidatePath('/', 'layout'); return NextResponse.json({success:true,id}); }
  catch(error) { return errorResponse(error,'Failed to save product.'); }
}
export async function PATCH(request: Request) {
  if (!(await isAuthenticatedAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try { const data=await request.json(); const id=textValue(data.id,'ID',100); await saveProduct(data,id); revalidatePath('/', 'layout'); return NextResponse.json({success:true}); }
  catch(error) { return errorResponse(error,'Failed to update product.'); }
}
export async function DELETE(request: Request) {
  if (!(await isAuthenticatedAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try { await removeProduct(new URL(request.url).searchParams.get('id') || ''); revalidatePath('/', 'layout'); return NextResponse.json({success:true}); }
  catch(error) { return errorResponse(error,'Failed to delete product.'); }
}
