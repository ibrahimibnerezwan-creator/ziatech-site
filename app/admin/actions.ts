'use server'
import { saveProduct, removeProduct, saveCategory, removeCategory } from '@/lib/catalogue'


import { updateOrder } from '@/lib/order-management'
import { db } from '@/db'
import { products, productImages, categories, orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { requireAdmin } from '@/lib/auth'

export async function updateOrderStatus(orderId: string, status: string) {
    await requireAdmin()
    try {
        await updateOrder(orderId, {status})
        revalidatePath('/admin/orders')
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update order status:', error)
        return { success: false, error: 'Failed to update order status' }
    }
}

function productData(form:FormData) {
 const value:Record<string,unknown>={name:form.get('name'),price:form.get('price'),stock:form.get('stock'),categoryId:form.get('category'),description:form.get('description')||'',comparePrice:form.get('comparePrice')||null,isFeatured:form.get('isFeatured')==='on'};
 return value;
}
export async function createProduct(form:FormData) {
 await requireAdmin(); const value=productData(form); if(form.get('imageUrl')) value.images=[form.get('imageUrl')];
 await saveProduct(value); revalidatePath('/', 'layout'); redirect('/admin');
}
export async function updateProduct(id:string,form:FormData) {
 await requireAdmin(); await saveProduct(productData(form),id); revalidatePath('/', 'layout'); redirect('/admin');
}
export async function deleteProduct(id:string) {await requireAdmin(); await removeProduct(id);revalidatePath('/', 'layout');}
export async function createCategory(form:FormData) {await requireAdmin();await saveCategory({name:form.get('name'),image:form.get('imageUrl')});revalidatePath('/', 'layout');redirect('/admin?tab=categories');}
export async function updateCategory(id:string,form:FormData) {await requireAdmin();await saveCategory({name:form.get('name'),image:form.get('imageUrl')},id);revalidatePath('/', 'layout');redirect('/admin?tab=categories');}
export async function deleteCategory(id:string) {await requireAdmin();await removeCategory(id);revalidatePath('/', 'layout');}
