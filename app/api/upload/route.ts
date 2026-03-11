import { NextResponse } from 'next/server';
import { generateUploadUrl } from '@/lib/r2';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and contentType are required' },
        { status: 400 }
      );
    }

    // Generate a unique filename to prevent overwrites
    const ext = filename.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${ext}`;

    const { signedUrl, publicUrl } = await generateUploadUrl(uniqueFilename, contentType);

    return NextResponse.json({
      uploadUrl: signedUrl,
      publicUrl: publicUrl,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
