import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, products, productImages } from '@/db/schema';
import { eq, or, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ error: 'Please enter a valid Phone Number or Order ID (at least 3 characters).' }, { status: 400 });
  }

  try {
    // Search by full phone or order ID
    // If phone starts with 01, normalize
    const cleanPhone = query.replace(/[^0-9]/g, '');

    const foundOrders = await db.query.orders.findMany({
      where: or(
        eq(orders.id, query),
        cleanPhone.length >= 10 ? eq(orders.customerPhone, cleanPhone) : undefined,
        eq(orders.courierTrackingId, query)
      ),
      orderBy: [desc(orders.createdAt)],
      limit: 10,
      with: {
        items: {
          with: {
            product: {
              with: {
                images: {
                  limit: 1,
                  orderBy: [desc(productImages.sortOrder)],
                },
              },
            },
          },
        },
      },
    });

    if (!foundOrders || foundOrders.length === 0) {
      return NextResponse.json({ orders: [], message: 'কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক ফোন নম্বর বা অর্ডার আইডি দিন।' });
    }

    const safeOrders = foundOrders.map(order => ({
      id: order.id,
      shortId: order.id.slice(0, 8).toUpperCase(),
      customerName: order.customerName,
      customerPhone: order.customerPhone.slice(0, 3) + '*****' + order.customerPhone.slice(-3),
      shippingCity: order.shippingCity,
      address: order.address,
      total: order.total,
      deliveryCharge: order.deliveryCharge,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      courierTrackingId: order.courierTrackingId,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product?.name || 'Item',
        quantity: item.quantity,
        price: item.price,
        image: item.product?.images[0]?.url || null,
      })),
    }));

    return NextResponse.json({ orders: safeOrders });
  } catch (err: any) {
    console.error('Error tracking order:', err);
    return NextResponse.json({ error: 'অর্ডার ট্র্যাক করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
