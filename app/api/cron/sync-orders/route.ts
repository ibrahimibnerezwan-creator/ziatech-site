import { courierCredentials } from '@/lib/settings';
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
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret || auth !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { apiKey, secretKey } = await courierCredentials();

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
        if (!tracking || tracking.startsWith('DISPATCH_PENDING:')) continue;

        const res = await fetch(`${STEADFAST_BASE}/status_by_trackingcode/${encodeURIComponent(tracking)}`, {
          signal: AbortSignal.timeout(10000),
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
  } catch (error) {
    console.error('Steadfast cron sync error:', error);
    return NextResponse.json({ error: 'Unable to synchronize courier statuses. Please try again.' }, { status: 500 });
  }
}
