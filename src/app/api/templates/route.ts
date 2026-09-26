import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Template } from '@/types/nameplate';

export async function GET() {
  try {
    const rows = await query<any>(
      'SELECT * FROM public.templates WHERE enabled = true ORDER BY name ASC;'
    );

    const templates: Template[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      supportedSizes: r.supported_sizes,
      thumbnail: r.thumbnail,
      description: r.description,
      material: r.material,
      priceStartingAt: Number(r.price_starting_at),
      badge: r.badge,
      enabled: r.enabled,
      style: typeof r.style === 'string' ? JSON.parse(r.style) : r.style,
      textConfig: typeof r.text_config === 'string' ? JSON.parse(r.text_config) : r.text_config,
      editableFields: r.editable_fields,
      defaultValues: typeof r.default_values === 'string' ? JSON.parse(r.default_values) : r.default_values,
      sizes: typeof r.sizes === 'string' ? JSON.parse(r.sizes) : r.sizes || [],
      variants: typeof r.variants === 'string' ? JSON.parse(r.variants) : r.variants || [],
      layout: typeof r.layout === 'string' ? JSON.parse(r.layout) : r.layout || [],
      createdAt: r.created_at || new Date().toISOString()
    }));

    return NextResponse.json({ success: true, templates });
  } catch (err: any) {
    console.error('Error querying templates from Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tpl: Template = await request.json();
    const id = tpl.id || `tpl-${Date.now()}`;

    const sql = `
      INSERT INTO public.templates (
        id, name, category, supported_sizes, thumbnail, description, material,
        price_starting_at, badge, enabled, style, text_config, editable_fields, default_values,
        sizes, variants, layout, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        supported_sizes = EXCLUDED.supported_sizes,
        thumbnail = EXCLUDED.thumbnail,
        description = EXCLUDED.description,
        material = EXCLUDED.material,
        price_starting_at = EXCLUDED.price_starting_at,
        badge = EXCLUDED.badge,
        enabled = EXCLUDED.enabled,
        style = EXCLUDED.style,
        text_config = EXCLUDED.text_config,
        editable_fields = EXCLUDED.editable_fields,
        default_values = EXCLUDED.default_values,
        sizes = EXCLUDED.sizes,
        variants = EXCLUDED.variants,
        layout = EXCLUDED.layout,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      id,
      tpl.name,
      tpl.category || 'General',
      tpl.supportedSizes || ['2:1', '1:1', '4:1'],
      tpl.thumbnail || '',
      tpl.description || '',
      tpl.material || '',
      tpl.priceStartingAt || 3250,
      tpl.badge || null,
      tpl.enabled !== false,
      JSON.stringify(tpl.style || {}),
      JSON.stringify(tpl.textConfig || {}),
      tpl.editableFields || ['houseName', 'proprietor', 'address', 'holdingNumber'],
      JSON.stringify(tpl.defaultValues || {}),
      JSON.stringify(tpl.sizes || []),
      JSON.stringify(tpl.variants || []),
      JSON.stringify(tpl.layout || []),
    ];

    const rows = await query<any>(sql, values);
    return NextResponse.json({ success: true, template: rows[0] });
  } catch (err: any) {
    console.error('Error inserting template into Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
