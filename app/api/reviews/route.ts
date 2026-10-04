import { rateLimit } from '@/lib/rate-limit';
import { InputError, textValue, numberValue, errorResponse } from '@/lib/validation';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, products } from '@/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const approvedReviews = await db
      .select({
        id: reviews.id,
        reviewerName: reviews.reviewerName,
        rating: reviews.rating,
        comment: reviews.comment,
        adminReply: reviews.adminReply,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.status, 'approved')
        )
      )
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(approvedReviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await rateLimit('review', 6, 15);
    const body = await request.json();
    const productId = textValue(body.productId, 'product ID', 100);
    const reviewerName = textValue(body.reviewerName, 'reviewer name', 100);
    const comment = textValue(body.comment || '', 'review', 3000, false);
    const numRating = numberValue(body.rating, 'rating', true, 1);
    if (numRating > 5) throw new InputError('Rating must be between 1 and 5.');
    if (!(await db.query.products.findFirst({where:eq(products.id,productId)}))) throw new InputError('Product not found.',404);

    await db.insert(reviews).values({
      id: uuidv4(),
      productId,
      rating: numRating,
      comment: comment || '',
      reviewerName: reviewerName.trim(),
      status: 'pending',
      adminReply: null,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted for moderation.',
    });
  } catch (error) {
    console.error('Failed to submit review:', error);
    return errorResponse(error, 'Failed to submit review');
  }
}
