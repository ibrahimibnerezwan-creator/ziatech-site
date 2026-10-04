import { getCurrentUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { createOrder } from '@/lib/checkout';
import { errorResponse, InputError } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
export async function POST(request: Request) {
  try {
    await rateLimit('checkout', 20, 15);
    const data = await request.json();
    if (data?.website) throw new InputError('Unable to submit this order.');
    const result = await createOrder(data, await getCurrentUser());
    revalidatePath('/', 'layout');
    return Response.json(result);
  } catch (error) { return errorResponse(error, 'Checkout failed. Please try again.'); }
}
