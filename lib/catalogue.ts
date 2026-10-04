import { db, writeTransaction } from '@/db';
import { products, productImages, categories, orderItems, reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { InputError, textValue, numberValue, imageUrl } from './validation';

function specsValue(value: unknown) {
  if (value === null || value === '' || value === undefined) return null;
  let parsed;
  try { parsed = typeof value === 'string' ? JSON.parse(value) : value; } catch { throw new InputError('Specifications must be a JSON object, for example {"Voltage":"5V"}.'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || Object.values(parsed).some(v => !['string','number','boolean'].includes(typeof v))) throw new InputError('Specifications must contain simple name/value pairs.');
  const result=JSON.stringify(parsed);
  if (result.length>10000) throw new InputError('Specifications are too long.');
  return result;
}
export async function saveProduct(input: Record<string, unknown>, id?: string) {
  if (!input || typeof input !== 'object') throw new InputError('Invalid product.');
  const productId=id||crypto.randomUUID();
  await writeTransaction(async tx=>{
  const existing=id?await tx.query.products.findFirst({where:eq(products.id,id)}):null;
  if(id&&!existing) throw new InputError('Product not found.',404);
  const name=textValue(input.title ?? input.name ?? existing?.name,'product name',200);
  const price=numberValue(input.price ?? existing?.price,'price');
  const stock=numberValue(input.stock ?? existing?.stock ?? 0,'stock',true);
  const comparePrice=input.comparePrice === null || input.comparePrice === '' ? null : input.comparePrice === undefined ? existing?.comparePrice ?? null : numberValue(input.comparePrice,'previous price');
  if(comparePrice!==null && comparePrice<=price) throw new InputError('Previous price must be greater than the selling price.');
  const description=textValue(input.description ?? existing?.description ?? '', 'description',20000,false);
  const specs=input.specs===undefined?existing?.specs ?? null:specsValue(input.specs);
  if(input.isFeatured!==undefined&&typeof input.isFeatured!=='boolean') throw new InputError('Featured must be true or false.');
  const images=input.images===undefined?undefined:input.images;
  if(images!==undefined&&(!Array.isArray(images)||images.length>20)) throw new InputError('Maximum 20 product images.');
  const urls=(images as unknown[]|undefined)?.map(i=>imageUrl(typeof i==='object'&&i!==null?(i as {url:unknown}).url:i));
    let categoryId=input.categoryId===undefined?existing?.categoryId??null:input.categoryId||null;
    if (categoryId && (typeof categoryId !== 'string' || !(await tx.query.categories.findFirst({where:eq(categories.id,categoryId)})))) throw new InputError('Category not found.');
    if (input.category!==undefined && input.categoryId===undefined) {
      const category=textValue(input.category,'category',120,false);
      if(!category||category==='Uncategorized') categoryId=null;
      else {
        const found=await tx.query.categories.findFirst({where:eq(categories.name,category)});
        if(found) categoryId=found.id;
        else {
          categoryId=crypto.randomUUID();
          await tx.insert(categories).values({id:categoryId as string,name:category,slug:slugFor(category),createdAt:new Date(),updatedAt:new Date()});
        }
      }
    }
    const fields={name,price,stock,comparePrice,description,specs,categoryId:categoryId as string|null,isFeatured:input.isFeatured===undefined?existing?.isFeatured??false:input.isFeatured as boolean,updatedAt:new Date()};
    if(id) await tx.update(products).set(fields).where(eq(products.id,id));
    else await tx.insert(products).values({...fields,id:productId,slug:slugFor(name),createdAt:new Date()});
    if(urls!==undefined) {
      await tx.delete(productImages).where(eq(productImages.productId,productId));
      if(urls.length) await tx.insert(productImages).values(urls.map((url,i)=>({id:crypto.randomUUID(),productId,url,sortOrder:i})));
    }
  });
  return productId;
}
function slugFor(name:string) {
  return (name.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')||'item')+'-'+crypto.randomUUID().slice(0,8);
}
export async function removeProduct(id:string) {
  textValue(id,'product ID',100);
  await writeTransaction(async tx=>{
    if(!(await tx.query.products.findFirst({where:eq(products.id,id)}))) throw new InputError('Product not found.',404);
    if(await tx.query.orderItems.findFirst({where:eq(orderItems.productId,id)})) throw new InputError('This product has order history. Set stock to zero instead of deleting it.',409);
    await tx.delete(reviews).where(eq(reviews.productId,id));
    await tx.delete(productImages).where(eq(productImages.productId,id));
    await tx.delete(products).where(eq(products.id,id));
  });
}
export async function saveCategory(data:Record<string,unknown>,id?:string) {
  const name=textValue(data.name,'category name',120);
  const image=data.image?imageUrl(data.image):null;
  const categoryId=id||crypto.randomUUID();
  await writeTransaction(async tx=>{
    const existing=id?await tx.query.categories.findFirst({where:eq(categories.id,id)}):null;
    if(id&&!existing) throw new InputError('Category not found.',404);
    const duplicate=await tx.query.categories.findFirst({where:eq(categories.name,name)});
    if(duplicate&&duplicate.id!==id) throw new InputError('A category with this name already exists.',409);
    if(id) await tx.update(categories).set({name,image,updatedAt:new Date()}).where(eq(categories.id,id));
    else await tx.insert(categories).values({id:categoryId,name,image,slug:slugFor(name),createdAt:new Date(),updatedAt:new Date()});
  });
  return categoryId;
}
export async function removeCategory(id:string) {
  textValue(id,'category ID',100);
  await writeTransaction(async tx=>{
    if(!(await tx.query.categories.findFirst({where:eq(categories.id,id)}))) throw new InputError('Category not found.',404);
    await tx.update(products).set({categoryId:null,updatedAt:new Date()}).where(eq(products.categoryId,id));
    await tx.update(categories).set({parentId:null}).where(eq(categories.parentId,id));
    await tx.delete(categories).where(eq(categories.id,id));
  });
}
