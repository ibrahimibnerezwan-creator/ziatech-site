'use server'

import { db } from '@/db'
import { products, productImages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const categoryId = formData.get('category') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string

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
            stock,
            categoryId: categoryId || null,
            isFeatured: false,
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

    try {
        await db.update(products).set({
            name,
            description: description || '',
            price,
            stock,
            categoryId: categoryId || null,
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
