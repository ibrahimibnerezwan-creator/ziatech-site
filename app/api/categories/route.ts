import { saveCategory, removeCategory } from '@/lib/catalogue';
import { errorResponse, textValue } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await db
      .select({
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

    return NextResponse.json(list, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try { const id=await saveCategory(await request.json()); revalidatePath('/', 'layout'); return NextResponse.json({success:true,id}); }
  catch(error) { return errorResponse(error,'Failed to save category.'); }
}
export async function PATCH(request: Request) {
  if (!(await isAuthenticatedAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try { const data=await request.json(); const id=textValue(data.id,'ID',100); await saveCategory(data,id); revalidatePath('/', 'layout'); return NextResponse.json({success:true}); }
  catch(error) { return errorResponse(error,'Failed to update category.'); }
}
export async function DELETE(request: Request) {
  if (!(await isAuthenticatedAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try { await removeCategory(new URL(request.url).searchParams.get('id') || ''); revalidatePath('/', 'layout'); return NextResponse.json({success:true}); }
  catch(error) { return errorResponse(error,'Failed to delete category.'); }
}
