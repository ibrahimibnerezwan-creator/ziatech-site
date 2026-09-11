import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, products, productImages } from '@/db/schema';
import { desc, eq, asc } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allOrders = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
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

    const formatted = allOrders.map(order => {
      const firstItem = order.items[0];
      const productTitle = order.items.length === 1
        ? `${firstItem?.product?.name || 'Product'} ×${firstItem?.quantity || 1}`
        : order.items.length > 1
          ? `${firstItem?.product?.name || 'Item'} + ${order.items.length - 1} more items`
          : 'Store Order';

      const productImageUrl = firstItem?.product?.images[0]?.url || null;

      return {
        id: order.id,
        customerName: order.customerName,
        phone: order.customerPhone,
        address: order.address,
        shippingCity: order.shippingCity,
        amount: order.total,
        deliveryCharge: order.deliveryCharge,
        paymentMethod: order.paymentMethod,
        trxId: order.transactionId,
        paymentStatus: order.paymentStatus,
        trackingCode: order.courierTrackingId,
        status: order.status.toLowerCase(),
        rawStatus: order.status,
        productTitle,
        productImageUrl,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product?.name || 'Unknown',
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.product?.images[0]?.url || null,
        })),
        createdAt: order.createdAt,
      };
    });

    return NextResponse.json(formatted, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, paymentStatus, trackingCode } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }

    const patch: Record<string, any> = { updatedAt: new Date() };
    if (status) patch.status = status.toUpperCase();
    if (paymentStatus) patch.paymentStatus = paymentStatus.toUpperCase();
    if (trackingCode !== undefined) patch.courierTrackingId = trackingCode;

    await db.update(orders).set(patch).where(eq(orders.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }

    // Delete order items first, then the order
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
