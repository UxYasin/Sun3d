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
      createdAt: r.created_at || new Date().toISOString()
    }));

    return NextResponse.json({ success: true, templates });
  } catch (err: any) {
    console.error('Error querying templates from Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
