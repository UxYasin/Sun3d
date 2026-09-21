import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CustomerOrder } from '@/types/nameplate';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    let sql = 'SELECT * FROM public.orders';
    const params: any[] = [];

    if (customerId) {
      sql += ' WHERE customer_id = $1';
      params.push(customerId);
    }

    sql += ' ORDER BY created_at DESC;';

    const rows = await query<any>(sql, params);

    const orders: CustomerOrder[] = rows.map((r) => {
      const finalDesign = typeof r.final_design_data === 'string' ? JSON.parse(r.final_design_data) : (r.final_design_data || {});
      return {
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
    });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error('Error querying orders from Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      finalDesignData,
      price,
      paymentMethod
    } = body;

    const orderNumber = `SN-${Math.floor(10000 + Math.random() * 90000)}`;
    const initialHistory = [
      {
        status: 'New',
        timestamp: new Date().toISOString(),
        note: 'Order submitted online via Sun3D Studio'
      }
    ];

    const res = await query<any>(
      `INSERT INTO public.orders (
        order_number, customer_id, customer_name, customer_email, customer_phone,
        template_id, size, house_name, final_design_data, price, payment_method,
        payment_status, production_status, status_history
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'unpaid', 'New', $12)
      RETURNING *;`,
      [
        orderNumber,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        finalDesignData.templateId,
        finalDesignData.size,
        finalDesignData.houseName,
        JSON.stringify(finalDesignData),
        price,
        paymentMethod,
        JSON.stringify(initialHistory)
      ]
    );

    const r = res[0];
    const createdOrder: CustomerOrder = {
      id: r.id,
      orderNumber: r.order_number,
      customerId: r.customer_id,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      designId: r.design_id || finalDesignData.id || `des-${r.order_number || r.id}`,
      templateId: r.template_id,
      size: r.size,
      houseName: r.house_name,
      proprietor: r.proprietor || finalDesignData.proprietor || '',
      address: r.address || finalDesignData.address || '',
      holdingNumber: r.holding_number || finalDesignData.holdingNumber || '',
      finalDesignData: typeof r.final_design_data === 'string' ? JSON.parse(r.final_design_data) : r.final_design_data,
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

    return NextResponse.json({ success: true, order: createdOrder });
  } catch (err: any) {
    console.error('Error inserting order in Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
