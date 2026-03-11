'use server'

import { db } from '@/db'
import { storeSettings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
    const keys = [
        'storeName', 'phone', 'email', 'address', 'whatsapp', 'facebook',
        'instagram', 'youtube', 'tiktok',
        'bkash_number', 'nagad_number',
        'steadfast_api_key', 'steadfast_secret_key'
    ]
    
    for (const key of keys) {
        const value = formData.get(key) as string
        if (value !== null) {
            // Check if exists
            const existing = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1)
            
            if (existing.length > 0) {
                await db.update(storeSettings).set({ value, updatedAt: new Date() }).where(eq(storeSettings.key, key))
            } else {
                await db.insert(storeSettings).values({ key, value, updatedAt: new Date() })
            }
        }
    }
    
    revalidatePath('/')
    revalidatePath('/admin/settings')
}
