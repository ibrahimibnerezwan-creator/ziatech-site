import { NextResponse } from 'next/server';
import { db } from '@/db';
import { productImages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { imageUrl, errorResponse } from '@/lib/validation';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, url } = await request.json();

    if (!productId || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingImages = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId));

    const nextSortOrder = Math.max(-1, ...existingImages.map(i=>i.sortOrder ?? 0)) + 1;

    await db.insert(productImages).values({
      id: uuidv4(),
      productId,
      url: imageUrl(url),
      sortOrder: nextSortOrder,
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: 'Image added' });
  } catch (error) {
    console.error('Failed to add media:', error);
    return errorResponse(error, 'Failed to add media');
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { imageId } = await request.json();
    if (!imageId) {
      return NextResponse.json({ error: 'Missing imageId' }, { status: 400 });
    }

    const [image] = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imageId));

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const siblings = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, image.productId));

    if (siblings.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last image of a product' },
        { status: 400 }
      );
    }

    await db.delete(productImages).where(eq(productImages.id, imageId));
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
