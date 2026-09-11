import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, products } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allReviews = await db
      .select({
        id: reviews.id,
        reviewerName: reviews.reviewerName,
        rating: reviews.rating,
        comment: reviews.comment,
        status: reviews.status,
        adminReply: reviews.adminReply,
        productId: reviews.productId,
        productName: products.name,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(allReviews, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, adminReply } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing review id' }, { status: 400 });
    }

    const patch: Record<string, any> = {};
    if (status) patch.status = status;
    if (adminReply !== undefined) patch.adminReply = adminReply;

    await db.update(reviews).set(patch).where(eq(reviews.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing review id' }, { status: 400 });
    }

    await db.delete(reviews).where(eq(reviews.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
