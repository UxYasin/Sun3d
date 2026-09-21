import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CustomerOrder } from '@/types/nameplate';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query<any>(
      'SELECT * FROM public.orders WHERE id::text = $1 OR order_number = $1 LIMIT 1;',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const r = rows[0];
    const finalDesign = typeof r.final_design_data === 'string' ? JSON.parse(r.final_design_data) : (r.final_design_data || {});
    const order: CustomerOrder = {
      id: r.id,
      orderNumber: r.order_number,
      customerId: r.customer_id,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      designId: r.design_id || finalDesign.id || `des-${r.order_number || r.id}`,
      templateId: r.template_id,
      size: r.size,
      houseName: r.house_name,
      proprietor: r.proprietor || finalDesign.proprietor || '',
      address: r.address || finalDesign.address || '',
      holdingNumber: r.holding_number || finalDesign.holdingNumber || '',
      finalDesignData: finalDesign,
      price: Number(r.price),
      paymentMethod: r.payment_method,
      paymentStatus: r.payment_status,
      productionStatus: r.production_status,
      transactionId: r.transaction_id || undefined,
      senderPhone: r.sender_phone || undefined,
      paymentNote: r.payment_note || undefined,
      statusHistory: typeof r.status_history === 'string' ? JSON.parse(r.status_history) : r.status_history,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    };

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('Error fetching order from Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingRows = await query<any>(
      'SELECT * FROM public.orders WHERE id::text = $1 OR order_number = $1 LIMIT 1;',
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const current = existingRows[0];
    const currentHistory = typeof current.status_history === 'string' ? JSON.parse(current.status_history) : (current.status_history || []);

    const newPaymentStatus = body.paymentStatus ?? current.payment_status;
    const newProductionStatus = body.productionStatus ?? current.production_status;
    const transactionId = body.transactionId ?? current.transaction_id;
    const senderPhone = body.senderPhone ?? current.sender_phone;
    const paymentNote = body.paymentNote ?? current.payment_note;

    if (body.historyNote || body.paymentStatus || body.productionStatus) {
      currentHistory.push({
        status: newProductionStatus,
        timestamp: new Date().toISOString(),
        note: body.historyNote || `Updated payment to ${newPaymentStatus}, production to ${newProductionStatus}`
      });
    }

    const updatedRows = await query<any>(
      `UPDATE public.orders SET
        payment_status = $1,
        production_status = $2,
        transaction_id = $3,
        sender_phone = $4,
        payment_note = $5,
        status_history = $6,
        updated_at = NOW()
       WHERE id = $7
       RETURNING *;`,
      [
        newPaymentStatus,
        newProductionStatus,
        transactionId,
        senderPhone,
        paymentNote,
        JSON.stringify(currentHistory),
        current.id
      ]
    );

    const r = updatedRows[0];
    const finalDesign = typeof r.final_design_data === 'string' ? JSON.parse(r.final_design_data) : (r.final_design_data || {});
    const updatedOrder: CustomerOrder = {
      id: r.id,
      orderNumber: r.order_number,
      customerId: r.customer_id,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      designId: r.design_id || finalDesign.id || `des-${r.order_number || r.id}`,
      templateId: r.template_id,
      size: r.size,
      houseName: r.house_name,
      proprietor: r.proprietor || finalDesign.proprietor || '',
      address: r.address || finalDesign.address || '',
      holdingNumber: r.holding_number || finalDesign.holdingNumber || '',
      finalDesignData: finalDesign,
      price: Number(r.price),
      paymentMethod: r.payment_method,
      paymentStatus: r.payment_status,
      productionStatus: r.production_status,
      transactionId: r.transaction_id || undefined,
      senderPhone: r.sender_phone || undefined,
      paymentNote: r.payment_note || undefined,
      statusHistory: typeof r.status_history === 'string' ? JSON.parse(r.status_history) : r.status_history,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    };

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error('Error updating order in Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
