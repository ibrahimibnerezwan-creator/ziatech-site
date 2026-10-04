import { db } from '@/db';
import { orders } from '@/db/schema';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { courierCredentials } from '@/lib/settings';
import { InputError, textValue, errorResponse } from '@/lib/validation';
export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) return Response.json({error:'Unauthorized'},{status:401});
  try {
    const id = textValue((await request.json()).id, 'order ID', 100);
    const {apiKey, secretKey} = await courierCredentials();
    if (!apiKey || !secretKey) throw new InputError('Save your Steadfast API credentials in Store Settings first.', 503);
    const order = await db.query.orders.findFirst({where:eq(orders.id,id),with:{items:{with:{product:true}}}});
    if (!order) throw new InputError('Order not found.',404);
    if (order.courierTrackingId || !['PENDING','PROCESSING'].includes(order.status)) throw new InputError('This order is already dispatched or cannot be dispatched.',409);
    if (order.paymentMethod !== 'cod' && order.paymentStatus !== 'VERIFIED') throw new InputError('Verify the payment before dispatching this order.',409);
    const pending = 'DISPATCH_PENDING:' + id;
    const reserved = await db.update(orders).set({courierTrackingId:pending,updatedAt:new Date()}).where(and(eq(orders.id,id),isNull(orders.courierTrackingId),sql`${orders.status} IN ('PENDING', 'PROCESSING')`,eq(orders.paymentStatus,order.paymentStatus))).returning({id:orders.id});
    if (!reserved.length) throw new InputError('Dispatch is already in progress.',409);
    let response;
    try {
      response = await fetch('https://portal.packzy.com/api/v1/create_order',{method:'POST',headers:{'Api-Key':apiKey,'Secret-Key':secretKey,'Content-Type':'application/json'},body:JSON.stringify({
        invoice:'ZT-'+id.toUpperCase(),recipient_name:order.customerName,recipient_phone:order.customerPhone,recipient_address:order.address+', '+order.shippingCity,cod_amount:order.paymentMethod==='cod'?Math.round(order.total):0,
        note:order.items.map(i=>`${i.product?.name || 'Product'} x${i.quantity}`).join(', ')
      }),signal:AbortSignal.timeout(15000)});
      const data = await response.json();
      if (!response.ok || !data.consignment?.tracking_code) {
        if (response.status >= 400 && response.status < 500) await db.update(orders).set({courierTrackingId:null}).where(and(eq(orders.id,id),eq(orders.courierTrackingId,pending)));
        throw new Error('Courier did not confirm a tracking code.');
      }
      await db.update(orders).set({courierTrackingId:String(data.consignment.tracking_code),status:'PROCESSING',updatedAt:new Date()}).where(and(eq(orders.id,id),eq(orders.courierTrackingId,pending)));
      return Response.json({success:true,trackingCode:data.consignment.tracking_code});
    } catch {
      throw new InputError('Courier did not confirm dispatch. Check the Steadfast portal before retrying. Record its tracking code here if a consignment exists; do not create a duplicate.',502);
    }
  } catch(error) {return errorResponse(error,'Unable to dispatch this order.');}
}
