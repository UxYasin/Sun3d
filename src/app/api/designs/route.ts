import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CustomerDesign } from '@/types/nameplate';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let sql = 'SELECT * FROM public.customer_designs';
    const params: any[] = [];

    if (userId) {
      sql += ' WHERE user_id = $1';
      params.push(userId);
    }

    sql += ' ORDER BY updated_at DESC;';

    const rows = await query<any>(sql, params);

    const designs: CustomerDesign[] = rows.map((r) => ({
      id: r.id.toString(),
      userId: r.user_id,
      templateId: r.template_id,
      size: r.size,
      houseName: r.house_name,
      proprietor: r.proprietor,
      address: r.address,
      holdingNumber: r.holding_number,
      typography: typeof r.typography === 'string' ? JSON.parse(r.typography) : r.typography,
      colors: typeof r.colors === 'string' ? JSON.parse(r.colors) : r.colors,
      updatedAt: r.updated_at
    }));

    return NextResponse.json({ success: true, designs });
  } catch (err: any) {
    console.error('Error querying customer designs from Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Ensure preview_image column exists and alter ID if needed
    await query(`
      ALTER TABLE public.customer_designs ADD COLUMN IF NOT EXISTS preview_image TEXT;
      ALTER TABLE public.customer_designs ALTER COLUMN id TYPE TEXT;
    `).catch(() => {});

    const body = await request.json();
    const {
      id,
      userId,
      templateId,
      size,
      houseName,
      proprietor,
      address,
      holdingNumber,
      typography,
      colors,
      previewImage
    } = body;

    const designId = id || `des-${Date.now().toString().slice(-6)}`;

    const res = await query<any>(
      `INSERT INTO public.customer_designs (
        id, user_id, template_id, size, house_name, proprietor, address, holding_number,
        typography, colors, preview_image, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (id) DO UPDATE SET
        template_id = EXCLUDED.template_id,
        size = EXCLUDED.size,
        house_name = EXCLUDED.house_name,
        proprietor = EXCLUDED.proprietor,
        address = EXCLUDED.address,
        holding_number = EXCLUDED.holding_number,
        typography = EXCLUDED.typography,
        colors = EXCLUDED.colors,
        preview_image = EXCLUDED.preview_image,
        updated_at = NOW()
      RETURNING *;`,
      [
        designId,
        userId,
        templateId,
        size,
        houseName,
        proprietor || '',
        address || '',
        holdingNumber || '',
        JSON.stringify(typography || {}),
        JSON.stringify(colors || {}),
        previewImage || null
      ]
    );

    const r = res[0];
    const design: CustomerDesign = {
      id: r.id.toString(),
      userId: r.user_id,
      templateId: r.template_id,
      size: r.size,
      houseName: r.house_name,
      proprietor: r.proprietor,
      address: r.address,
      holdingNumber: r.holding_number,
      typography: typeof r.typography === 'string' ? JSON.parse(r.typography) : r.typography,
      colors: typeof r.colors === 'string' ? JSON.parse(r.colors) : r.colors,
      updatedAt: r.updated_at
    };

    return NextResponse.json({ success: true, design });
  } catch (err: any) {
    console.error('Error saving customer design to Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
