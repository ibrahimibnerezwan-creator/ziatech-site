'use server'

import { db } from '@/db'
import { orders, orderItems, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/auth'

interface CheckoutData {
    customerName: string
    customerPhone: string
    address: string
    shippingCity: string
    paymentMethod: string
    transactionId?: string
    items: Array<{ id: string, quantity: number, price: number }>
    deliveryCharge: number
    total: number
}

import { revalidatePath } from 'next/cache'

export async function placeOrder(data: CheckoutData) {
    try {
        const user = await getCurrentUser()
        const orderId = crypto.randomUUID()

        // 1. Validate input
        if (!data.customerName || !data.customerPhone || !data.address || !data.shippingCity || !data.paymentMethod) {
            return { error: 'All fields are required.' }
        }

        if (data.items.length === 0) {
            return { error: 'Cart is empty.' }
        }

        // 2. Start transaction
        await db.transaction(async (tx) => {
            // Check stock and decrement
            for (const item of data.items) {
                const productRecord = await tx.query.products.findFirst({
                    where: eq(products.id, item.id)
                })

                if (!productRecord) {
                    throw new Error(`Product not found: ${item.id}`)
                }

                if (productRecord.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${productRecord.name}`)
                }

                // Decrement stock
                await tx.update(products)
                    .set({ stock: productRecord.stock - item.quantity, updatedAt: new Date() })
                    .where(eq(products.id, item.id))
            }

            // Create Order
            await tx.insert(orders).values({
                id: orderId,
                userId: user?.id || null, 
                status: 'PENDING',
                paymentStatus: data.paymentMethod === 'cod' ? 'PENDING' : 'VERIFYING',
                total: data.total,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                address: data.address,
                shippingCity: data.shippingCity,
                deliveryCharge: data.deliveryCharge,
                paymentMethod: data.paymentMethod,
                transactionId: data.transactionId || null,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            // Create Order Items
            for (const item of data.items) {
                await tx.insert(orderItems).values({
                    id: crypto.randomUUID(),
                    orderId,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })
            }
        })

        // 3. Revalidate affected paths
        revalidatePath('/admin/orders')
        revalidatePath('/admin')
        revalidatePath('/')
        // Ideally we'd revalidate specific product pages too
        
        return { success: true, orderId }
    } catch (error: any) {
        console.error('Checkout error:', error)
        return { error: error.message || 'An unexpected error occurred during checkout.' }
    }
}
