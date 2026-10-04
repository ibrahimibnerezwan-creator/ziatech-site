import { updateOrder, deleteOrder } from '@/lib/order-management';
import { errorResponse } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
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
                  orderBy: [asc(productImages.sortOrder)],
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
  if (!(await isAuthenticatedAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try { const {id,...patch}=await request.json(); await updateOrder(id,patch); revalidatePath('/', 'layout'); return NextResponse.json({success:true}); }
  catch(error) {return errorResponse(error,'Failed to update order.');}
}
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticatedAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try { await deleteOrder(request.nextUrl.searchParams.get('id') || ''); revalidatePath('/', 'layout'); return NextResponse.json({success:true}); }
  catch(error) {return errorResponse(error,'Failed to delete order.');}
}
