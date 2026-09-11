import { NextResponse } from 'next/server';
import { db } from '@/db';
import { productImages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { deleteFromR2, extractR2Key } from '@/lib/r2';

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

    const nextSortOrder = existingImages.length;

    await db.insert(productImages).values({
      id: uuidv4(),
      productId,
      url,
      sortOrder: nextSortOrder,
    });

    return NextResponse.json({ success: true, message: 'Image added' });
  } catch (error) {
    console.error('Failed to add media:', error);
    return NextResponse.json({ error: 'Failed to add media' }, { status: 500 });
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

    try {
      const key = extractR2Key(image.url);
      if (key) await deleteFromR2(key);
    } catch (r2Err) {
      console.error('R2 delete failed (continuing DB delete):', r2Err);
    }

    await db.delete(productImages).where(eq(productImages.id, imageId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
