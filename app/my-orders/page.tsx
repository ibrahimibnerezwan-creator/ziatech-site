import { db } from '@/db';
import { orders, orderItems, products, productImages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import OrdersClient from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function MyOrdersPage() {
  const user = await getCurrentUser();

  let initialOrders: any[] = [];

  if (user) {
    try {
      const userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, user.id),
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

      initialOrders = userOrders.map(order => ({
        id: order.id,
        shortId: order.id.slice(0, 8).toUpperCase(),
        customerName: order.customerName,
        customerPhone: order.customerPhone,
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
          name: item.product?.name || 'Product',
          quantity: item.quantity,
          price: item.price,
          image: item.product?.images[0]?.url || null,
        })),
      }));
    } catch (err) {
      console.error('Error fetching user orders:', err);
    }
  }

  return (
    <OrdersClient initialOrders={initialOrders} isLoggedIn={!!user} />
  );
}
