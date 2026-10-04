import { db, writeTransaction } from '@/db';
import { orders, orderItems, products } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { InputError, textValue } from './validation';
export const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
export const PAYMENT_STATUSES = ['PENDING', 'VERIFYING', 'VERIFIED', 'FAILED'];
export async function updateOrder(id: string, input: {status?: unknown; paymentStatus?: unknown; trackingCode?: unknown}) {
  textValue(id, 'order ID', 100);
  const status = input.status === undefined ? undefined : String(input.status).toUpperCase();
  const paymentStatus = input.paymentStatus === undefined ? undefined : String(input.paymentStatus).toUpperCase();
  if (status && !ORDER_STATUSES.includes(status)) throw new InputError('Invalid order status.');
  if (paymentStatus && !PAYMENT_STATUSES.includes(paymentStatus)) throw new InputError('Invalid payment status.');
  if (!status && !paymentStatus && input.trackingCode === undefined) throw new InputError('No order changes provided.');
  const trackingCode = input.trackingCode === undefined ? undefined : textValue(input.trackingCode, 'tracking code', 150, false);
  await writeTransaction(async tx => {
    const order = await tx.query.orders.findFirst({ where: eq(orders.id, id), with: { items: true } });
    if (!order) throw new InputError('Order not found.', 404);
    if (order.courierTrackingId?.startsWith('DISPATCH_PENDING:')) {
      if (status === 'CANCELLED') throw new InputError('Resolve the pending courier dispatch before cancelling this order.', 409);
      if (trackingCode !== undefined && Date.now() - order.updatedAt.getTime() < 60000) throw new InputError('Courier dispatch is still in progress. Please wait before changing its tracking code.', 409);
    }
    if (status && order.status === 'CANCELLED' && status !== 'CANCELLED') throw new InputError('Cancelled orders cannot be reopened. Create a new order.', 409);
    if (status && order.status === 'DELIVERED' && status !== 'DELIVERED') throw new InputError('Delivered orders must retain their delivery record.', 409);
    if (['SHIPPED','DELIVERED'].includes(status || '') && order.paymentMethod !== 'cod' && (paymentStatus || order.paymentStatus) !== 'VERIFIED') throw new InputError('Verify payment before shipping a prepaid order.', 409);
    if (status === 'CANCELLED' && ['PENDING', 'PROCESSING'].includes(order.status) && !order.courierTrackingId) {
      for (const item of order.items) await tx.update(products).set({ stock: sql`${products.stock} + ${item.quantity}`, updatedAt: new Date() }).where(eq(products.id, item.productId));
    }
    await tx.update(orders).set({ ...(status ? { status } : {}), ...(paymentStatus ? { paymentStatus } : {}), ...(trackingCode !== undefined ? { courierTrackingId: trackingCode || null } : {}), updatedAt: new Date() }).where(eq(orders.id, id));
  });
}
export async function deleteOrder(id: string) {
  textValue(id, 'order ID', 100);
  await writeTransaction(async tx => {
    const order = await tx.query.orders.findFirst({ where: eq(orders.id, id) });
    if (!order) throw new InputError('Order not found.', 404);
    if (order.status !== 'CANCELLED' || order.courierTrackingId) throw new InputError('Only cancelled, undispatched orders can be deleted. Cancel the order first.', 409);
    await tx.delete(orderItems).where(eq(orderItems.orderId, id));
    await tx.delete(orders).where(eq(orders.id, id));
  });
}
