import { S3Client, PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 is S3-compatible
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY || '',
  },
});

export const BUCKET_NAME = process.env.CF_BUCKET_NAME || 'ziatech-images';
export const PUBLIC_DOMAIN = process.env.CF_PUBLIC_DOMAIN || '';

export async function testR2Connection() {
  try {
    await r2.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    return { success: true, bucket: BUCKET_NAME };
  } catch (error) {
    console.error('R2 Connection Test Failed:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function generateUploadUrl(filename: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

  return {
    signedUrl,
    publicUrl: `${PUBLIC_DOMAIN}/${filename}`,
  };
}
