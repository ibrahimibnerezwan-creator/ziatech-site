import { db, writeTransaction } from '@/db';
import { orders, orderItems, products } from '@/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';
import { InputError, textValue, validPhone, numberValue, deliveryFee } from './validation';
import { publicSettings } from './settings';

export async function createOrder(input: unknown, user: { id: string; role: string } | null = null) {
  if (!input || typeof input !== 'object') throw new InputError('Invalid order.');
  const data = input as Record<string, unknown>;
  const customerName = textValue(data.customerName, 'name', 120);
  const customerPhone = validPhone(data.customerPhone);
  const address = textValue(data.address, 'delivery address', 500);
  const shippingCity = textValue(data.shippingCity, 'city', 120);
  const paymentMethod = data.paymentMethod || 'cod';
  if (!['cod', 'bkash', 'nagad'].includes(String(paymentMethod))) throw new InputError('Invalid payment method.');
  const transactionId = paymentMethod === 'cod' ? null : textValue(data.transactionId, 'payment transaction ID', 100);
  if (paymentMethod !== 'cod') {
    const settings = await publicSettings();
    if (!settings[`${paymentMethod}_number`]) throw new InputError('This payment method is currently unavailable. Please choose cash on delivery.');
  }
  if (!Array.isArray(data.items) || !data.items.length || data.items.length > 100) throw new InputError('Please add between 1 and 100 products.');
  const quantities = new Map<string, number>();
  for (const item of data.items) {
    if (!item || typeof item !== 'object') throw new InputError('Invalid cart item.');
    const id = textValue(item.id, 'product ID', 100);
    const qty = numberValue(item.quantity, 'quantity', true, 1);
    const combined = (quantities.get(id) || 0) + qty;
    if (combined > 10000) throw new InputError('Quantity exceeds the order limit.');
    quantities.set(id, combined);
  }
  const orderId = data.requestId === undefined ? crypto.randomUUID() : textValue(data.requestId, 'request ID', 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)) throw new InputError('Invalid request ID.');
  const shipCharge = user?.role === 'admin' && data.deliveryCharge !== undefined
    ? numberValue(data.deliveryCharge, 'delivery charge') : deliveryFee(shippingCity);

  const saved = await writeTransaction(async tx => {
    const existing = await tx.query.orders.findFirst({ where: eq(orders.id, orderId), with: { items: true } });
    if (existing) {
      if (existing.customerPhone !== customerPhone || existing.customerName !== customerName || existing.address !== address || existing.shippingCity !== shippingCity || existing.paymentMethod !== paymentMethod || existing.transactionId !== transactionId || existing.items.length !== quantities.size || existing.items.some(i => quantities.get(i.productId) !== i.quantity)) throw new InputError('This checkout has already been submitted. Start a new order.', 409);
      return { total: existing.total };
    }
    let total = shipCharge;
    const lines: Array<{ id: string; orderId: string; productId: string; quantity: number; price: number }> = [];
    for (const [id, quantity] of quantities) {
      const product = await tx.query.products.findFirst({ where: eq(products.id, id) });
      if (!product) throw new InputError('A product in your cart is no longer available.', 404);
      if (!Number.isFinite(product.price) || product.price < 0) throw new InputError('A product price is unavailable. Please contact support.');
      const reserved = await tx.update(products)
        .set({ stock: sql`${products.stock} - ${quantity}`, updatedAt: new Date() })
        .where(and(eq(products.id, id), gte(products.stock, quantity))).returning({ id: products.id });
      if (!reserved.length) throw new InputError(`Only ${product.stock} available for ${product.name}. Please update your cart.`, 409);
      total += product.price * quantity;
      lines.push({ id: crypto.randomUUID(), orderId, productId: id, quantity, price: product.price });
    }
    total = Math.round(total * 100) / 100;
    await tx.insert(orders).values({ id: orderId, userId: user?.id && user.id !== 'admin-platform' ? user.id : null, status: 'PENDING', total, customerName, customerPhone, address, shippingCity, deliveryCharge: shipCharge, paymentMethod: String(paymentMethod), transactionId, paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'VERIFYING', createdAt: new Date(), updatedAt: new Date() });
    await tx.insert(orderItems).values(lines);
    return { total };
  });
  return { success: true as const, orderId, invoice: `ZT-${orderId.toUpperCase()}`, total: saved.total };
}
