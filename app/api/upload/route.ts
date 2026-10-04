import {r2,BUCKET_NAME,PUBLIC_DOMAIN} from '@/lib/r2';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import {isAuthenticatedAdmin} from '@/lib/auth';
import {InputError,errorResponse} from '@/lib/validation';
export async function POST(request:Request) {
 if(!(await isAuthenticatedAdmin())) return Response.json({error:'Unauthorized'},{status:401});
 try {
  if(!PUBLIC_DOMAIN||!process.env.CF_ACCESS_KEY_ID||!process.env.CF_SECRET_ACCESS_KEY) throw new InputError('Image storage is not configured.',503);
  if(!request.headers.get('content-type')?.includes('multipart/form-data')) throw new InputError('Upload an image using multipart form data.');
  if(Number(request.headers.get('content-length')||0)>4.5*1024*1024) throw new InputError('Image must be smaller than 4 MB.',413);
  const file=(await request.formData()).get('file');
  if(!(file instanceof File)||!file.size) throw new InputError('Please choose an image.');
  if(file.size>4*1024*1024) throw new InputError('Image must be smaller than 4 MB.',413);
  const ext:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};
  if(!ext[file.type]) throw new InputError('Only JPG, PNG, WebP and GIF images are supported.');
  const buffer=Buffer.from(await file.arrayBuffer());
  const actual=buffer[0]===0xff&&buffer[1]===0xd8?'image/jpeg':buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP'?'image/webp':/^GIF8[79]a/.test(buffer.toString('ascii',0,6))?'image/gif':'';
  if(actual!==file.type) throw new InputError('The file does not contain a valid supported image.');
  const key='products/'+crypto.randomUUID()+'.'+ext[file.type];
  await r2.send(new PutObjectCommand({Bucket:BUCKET_NAME,Key:key,Body:buffer,ContentType:file.type}));
  const publicUrl=PUBLIC_DOMAIN.replace(/\/$/,'')+'/'+key;
  return Response.json({url:publicUrl,publicUrl});
 }catch(error){return errorResponse(error,'Image upload failed. Please try again.');}
}
