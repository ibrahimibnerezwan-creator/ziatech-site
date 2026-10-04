import { NextRequest } from 'next/server';
import { db } from '@/db';
import { orders, productImages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { validPhone, textValue, errorResponse } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    await rateLimit('tracking', 30, 15);
    const q = textValue(request.nextUrl.searchParams.get('q'), 'full order ID', 100).replace(/^ZT-/i, '').toLowerCase();
    const phone = validPhone(request.nextUrl.searchParams.get('phone'));
    const found = await db.query.orders.findMany({
      where: and(eq(orders.id, q), eq(orders.customerPhone, phone)), limit: 1,
      with: { items: { with: { product: { with: { images: { limit: 1, orderBy: [asc(productImages.sortOrder)] } } } } } }
    });
    return Response.json({ orders: found.map(order => ({
      id: order.id, shortId: order.id, customerName: order.customerName,
      customerPhone: order.customerPhone.slice(0,3) + '*****' + order.customerPhone.slice(-3),
      shippingCity: order.shippingCity, total: order.total, deliveryCharge: order.deliveryCharge,
      paymentMethod: order.paymentMethod, paymentStatus: order.paymentStatus, status: order.status,
      courierTrackingId: order.courierTrackingId?.startsWith('DISPATCH_PENDING:') ? null : order.courierTrackingId, createdAt: order.createdAt,
      items: order.items.map(item => ({ id: item.id, name: item.product?.name || 'Product', quantity: item.quantity, price: item.price, image: item.product?.images[0]?.url || null }))
    })) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return errorResponse(error, 'Unable to track this order. Please try again.'); }
}
