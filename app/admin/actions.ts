'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const categoryId = formData.get('category') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    try {
        await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price,
                stock,
                category: { connect: { id: categoryId } },
                images: {
                    create: [{ url: imageUrl }]
                }
            }
        })
    } catch (error) {
        console.error('Failed to create product:', error)
        // return { message: 'Failed to create product' }
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}
