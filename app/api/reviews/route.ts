import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
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
    const { productId, rating, comment, reviewerName } = await request.json();

    if (!productId || !rating || !reviewerName) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));

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
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
