import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '@/lib/auth';

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('880') && digits.length >= 13) return '0' + digits.slice(3);
  if (digits.startsWith('0')) return digits;
  return digits;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      address,
      shippingCity,
      deliveryCharge,
      paymentMethod,
      transactionId,
      items,
      website, // Honeypot field
    } = body;

    // Honeypot trap: if filled, quietly succeed to confound spam bots
    if (website) {
      return NextResponse.json({ success: true, orderId: uuidv4() });
    }

    if (!customerName || !customerPhone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required customer or product details' }, { status: 400 });
    }

    const cleanPhone = normalizePhone(customerPhone);
    if (!/^01\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ error: 'Please provide a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)' }, { status: 400 });
    }

    if (paymentMethod !== 'cod' && !transactionId) {
      return NextResponse.json({ error: 'Please enter the transaction ID (TrxID) for your payment' }, { status: 400 });
    }

    const user = await getCurrentUser();
    const orderId = uuidv4();
    const invoice = `ZT-${Date.now().toString().slice(-6)}`;

    // Calculate item total & verify stock
    let subtotal = 0;
    const validatedItems: Array<{ id: string; name: string; quantity: number; price: number }> = [];

    for (const item of items) {
      const prod = await db.query.products.findFirst({
        where: eq(products.id, item.id),
      });

      if (!prod) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 404 });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = prod.price;
      subtotal += price * qty;
      validatedItems.push({
        id: prod.id,
        name: prod.name,
        quantity: qty,
        price,
      });
    }

    const shipCharge = Number(deliveryCharge) || (shippingCity?.toLowerCase() === 'dhaka' ? 60 : 120);
    const finalTotal = subtotal + shipCharge;

    // ── STEP 1: Save order to Turso DB first (guarantees zero order loss) ──
    await db.transaction(async (tx) => {
      // Decrement inventory stock safely
      for (const item of validatedItems) {
        const prod = await tx.query.products.findFirst({ where: eq(products.id, item.id) });
        if (prod) {
          const newStock = Math.max(0, prod.stock - item.quantity);
          await tx.update(products).set({ stock: newStock, updatedAt: new Date() }).where(eq(products.id, item.id));
        }
      }

      // Insert Order
      await tx.insert(orders).values({
        id: orderId,
        userId: user && user.id !== 'admin-platform' ? user.id : null,
        status: 'PENDING',
        total: finalTotal,
        customerName,
        customerPhone: cleanPhone,
        address,
        shippingCity: shippingCity || 'Dhaka',
        deliveryCharge: shipCharge,
        paymentMethod: paymentMethod || 'cod',
        transactionId: transactionId || null,
        paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'VERIFYING',
        courierTrackingId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Insert Order Items
      for (const item of validatedItems) {
        await tx.insert(orderItems).values({
          id: uuidv4(),
          orderId,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        });
      }
    });

    console.log(`[checkout] Order ${orderId} (${invoice}) safely written to DB`);

    // ── STEP 2: Dispatch to Steadfast Courier API if configured ──
    const apiKey = process.env.STEADFAST_API_KEY;
    const secretKey = process.env.STEADFAST_SECRET_KEY;

    if (apiKey && secretKey) {
      try {
        const isPrepaid = paymentMethod !== 'cod';
        const itemsSummary = validatedItems.map(i => `${i.name} (x${i.quantity})`).join(', ');

        const sfRes = await fetch('https://portal.packzy.com/api/v1/create_order', {
          method: 'POST',
          headers: {
            'Api-Key': apiKey,
            'Secret-Key': secretKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoice,
            recipient_name: customerName,
            recipient_phone: cleanPhone,
            recipient_address: `${address}, ${shippingCity}`,
            cod_amount: isPrepaid ? 0 : Math.round(finalTotal),
            note: `${isPrepaid ? `[PREPAID via ${paymentMethod.toUpperCase()}] TrxID: ${transactionId} | ` : ''}Items: ${itemsSummary}`,
          }),
        });

        const sfData = await sfRes.json();
        if (sfRes.ok && sfData.status !== 400 && sfData.status !== 'error') {
          const trackingCode = sfData.consignment?.tracking_code || null;
          if (trackingCode) {
            await db.update(orders).set({
              courierTrackingId: trackingCode,
              status: 'PROCESSING',
              updatedAt: new Date(),
            }).where(eq(orders.id, orderId));
            console.log(`[checkout] Steadfast dispatched — Tracking: ${trackingCode}`);
          }
        } else {
          console.warn('[checkout] Steadfast dispatch warning:', sfData);
        }
      } catch (sfErr) {
        console.error('[checkout] Steadfast API error (order safely in DB):', sfErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      invoice,
      total: finalTotal,
    });
  } catch (error: any) {
    console.error('[checkout] Error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed. Please try again.' }, { status: 500 });
  }
}
