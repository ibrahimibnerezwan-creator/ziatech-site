'use server'

import { db } from '@/db'
import { products, productImages, categories, orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await db.update(orders)
            .set({ 
                status,
                updatedAt: new Date()
            })
            .where(eq(orders.id, orderId))
            
        revalidatePath('/admin/orders')
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update order status:', error)
        return { success: false, error: 'Failed to update order status' }
    }
}

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const categoryId = formData.get('category') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string
    const comparePrice = formData.get('comparePrice') ? parseFloat(formData.get('comparePrice') as string) : null
    const isFeatured = formData.get('isFeatured') === 'on'

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const now = new Date()
    const productId = uuidv4()

    try {
        await db.insert(products).values({
            id: productId,
            name,
            slug,
            description: description || '',
            price,
            comparePrice,
            stock,
            categoryId: categoryId || null,
            isFeatured,
            createdAt: now,
            updatedAt: now,
        })

        if (imageUrl) {
            await db.insert(productImages).values({
                id: uuidv4(),
                productId,
                url: imageUrl,
                sortOrder: 0,
            })
        }
    } catch (error) {
        console.error('Failed to create product:', error)
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const categoryId = formData.get('category') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string
    const comparePrice = formData.get('comparePrice') ? parseFloat(formData.get('comparePrice') as string) : null
    const isFeatured = formData.get('isFeatured') === 'on'

    try {
        await db.update(products).set({
            name,
            description: description || '',
            price,
            comparePrice,
            stock,
            categoryId: categoryId || null,
            isFeatured,
            updatedAt: new Date(),
        }).where(eq(products.id, id))

        // Replace images
        await db.delete(productImages).where(eq(productImages.productId, id))
        if (imageUrl) {
            await db.insert(productImages).values({
                id: uuidv4(),
                productId: id,
                url: imageUrl,
                sortOrder: 0,
            })
        }
    } catch (error) {
        console.error('Failed to update product:', error)
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}

export async function deleteProduct(id: string) {
    try {
        await db.delete(products).where(eq(products.id, id))
    } catch (error) {
        console.error('Failed to delete product:', error)
    }

    revalidatePath('/admin/products')
}

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string
    const image = formData.get('imageUrl') as string
    
    // Generate clean slug
    const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    // Fallback if empty
    const slug = baseSlug || `cat-${Date.now()}`

    try {
        await db.insert(categories).values({
            id: uuidv4(),
            name,
            slug,
            image: image || null,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    } catch (error) {
        console.error('Failed to create category:', error)
    }

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const image = formData.get('imageUrl') as string
    
    // Generate clean slug
    const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const slug = baseSlug || `cat-${Date.now()}`

    try {
        await db.update(categories).set({
            name,
            slug,
            image: image || null,
            updatedAt: new Date()
        }).where(eq(categories.id, id))
    } catch (error) {
        console.error('Failed to update category:', error)
    }

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
    try {
        await db.delete(categories).where(eq(categories.id, id))
    } catch (error) {
        console.error('Failed to delete category:', error)
    }

    revalidatePath('/admin/categories')
}
