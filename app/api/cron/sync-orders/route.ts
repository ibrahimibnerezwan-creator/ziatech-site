import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { notInArray, isNotNull, and, eq } from 'drizzle-orm';

const STEADFAST_BASE = 'https://portal.packzy.com/api/v1';

function mapSteadfastStatus(sfStatus: string): string | null {
  switch (sfStatus?.toLowerCase()) {
    case 'delivered':
    case 'delivered_approval_pending':
    case 'partial_delivered':
      return 'DELIVERED';
    case 'cancelled':
    case 'cancelled_approval_pending':
      return 'CANCELLED';
    case 'in_review':
    case 'pending':
      return 'PROCESSING';
    default:
      return null;
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET || 'ziatech_cron_secret_2026_token';

  if (auth && auth !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.STEADFAST_API_KEY;
  const secretKey = process.env.STEADFAST_SECRET_KEY;

  if (!apiKey || !secretKey) {
    return NextResponse.json({ error: 'Missing Steadfast credentials' }, { status: 503 });
  }

  try {
    const activeOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          isNotNull(orders.courierTrackingId),
          notInArray(orders.status, ['DELIVERED', 'CANCELLED'])
        )
      );

    if (activeOrders.length === 0) {
      return NextResponse.json({ message: 'No active orders awaiting courier delivery update', synced: 0, updated: 0 });
    }

    let updatedCount = 0;

    for (const order of activeOrders) {
      try {
        const tracking = order.courierTrackingId;
        if (!tracking) continue;

        const res = await fetch(`${STEADFAST_BASE}/status_by_trackingcode/${tracking}`, {
          headers: {
            'Api-Key': apiKey,
            'Secret-Key': secretKey,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) continue;

        const data = await res.json();
        const sfStatus = data.delivery_status;
        if (!sfStatus) continue;

        const mapped = mapSteadfastStatus(sfStatus);
        if (mapped && mapped !== order.status) {
          await db.update(orders).set({
            status: mapped,
            updatedAt: new Date(),
          }).where(eq(orders.id, order.id));
          updatedCount++;
        }
      } catch (itemErr) {
        console.error(`Error syncing order ${order.id}:`, itemErr);
      }
    }

    return NextResponse.json({
      success: true,
      synced: activeOrders.length,
      updated: updatedCount,
    });
  } catch (error: any) {
    console.error('Steadfast cron sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
