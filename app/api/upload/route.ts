import { NextResponse } from 'next/server';
import { generateUploadUrl, r2, BUCKET_NAME, PUBLIC_DOMAIN } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const isAdmin = await isAuthenticatedAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentTypeHeader = request.headers.get('content-type') || '';

    // Mode 1: JSON payload requesting pre-signed URL for direct browser-to-R2 upload
    if (contentTypeHeader.includes('application/json')) {
      const { filename, contentType } = await request.json();

      if (!filename || !contentType) {
        return NextResponse.json(
          { error: 'Filename and contentType are required' },
          { status: 400 }
        );
      }

      const ext = filename.split('.').pop() || 'jpg';
      const uniqueFilename = `${uuidv4()}.${ext}`;

      const { signedUrl, publicUrl } = await generateUploadUrl(uniqueFilename, contentType);

      return NextResponse.json({
        uploadUrl: signedUrl,
        publicUrl: publicUrl,
      });
    }

    // Mode 2: Multipart FormData direct fallback
    if (contentTypeHeader.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split('.').pop() || 'jpg';
      const uniqueFilename = `${uuidv4()}.${ext}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: uniqueFilename,
          Body: buffer,
          ContentType: file.type || 'image/jpeg',
        })
      );

      return NextResponse.json({
        url: `${PUBLIC_DOMAIN}/${uniqueFilename}`,
        publicUrl: `${PUBLIC_DOMAIN}/${uniqueFilename}`,
      });
    }

    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process upload' },
      { status: 500 }
    );
  }
}
