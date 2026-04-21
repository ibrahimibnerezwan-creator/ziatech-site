'use server'

import { db } from '@/db'
import { reviews } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected') {
    await requireAdmin()
    try {
        await db.update(reviews)
            .set({ status })
            .where(eq(reviews.id, id))
            
        revalidatePath('/admin/reviews')
    } catch (error) {
        console.error('Failed to update review status:', error)
    }
}

export async function replyToReview(id: string, reply: string) {
    await requireAdmin()
    try {
        await db.update(reviews)
            .set({ adminReply: reply })
            .where(eq(reviews.id, id))
            
        revalidatePath('/admin/reviews')
    } catch (error) {
        console.error('Failed to reply to review:', error)
    }
}
