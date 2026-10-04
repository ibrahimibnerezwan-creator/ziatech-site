'use server'
import { rateLimit } from '@/lib/rate-limit';
import { createOrder } from '@/lib/checkout';
import { getCurrentUser } from '@/lib/auth';
import { InputError } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
export async function placeOrder(data: unknown) {
  try {
    await rateLimit('checkout', 20, 15);
    const result = await createOrder(data, await getCurrentUser());
    revalidatePath('/', 'layout');
    return result;
  } catch (error) {
    console.error('Checkout failed', error);
    return { error: error instanceof InputError ? error.message : 'Checkout failed. Please try again.' };
  }
}
