export async function uploadImage(file: Blob, filename: string): Promise<string> {
  if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) throw new Error('Choose a JPG, PNG, WebP or GIF image.');
  if(file.size>4*1024*1024) throw new Error('Please choose an image smaller than 4 MB.');
  const data=new FormData(); data.append('file',file,filename);
  const res=await fetch('/api/upload',{method:'POST',body:data});
  const body=await res.json().catch(()=>({}));
  if(!res.ok||!body.publicUrl) throw new Error(body.error||'Image upload failed. Please try again.');
  return body.publicUrl;
}
