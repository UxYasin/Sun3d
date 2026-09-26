import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const FIELD_MAP: Record<string, string> = {
      name: 'name',
      category: 'category',
      supportedSizes: 'supported_sizes',
      thumbnail: 'thumbnail',
      description: 'description',
      material: 'material',
      priceStartingAt: 'price_starting_at',
      badge: 'badge',
      enabled: 'enabled',
      style: 'style',
      textConfig: 'text_config',
      editableFields: 'editable_fields',
      defaultValues: 'default_values',
      sizes: 'sizes',
      variants: 'variants',
      layout: 'layout',
    };

    // Columns holding structured data rather than scalars.
    const JSON_FIELDS = new Set([
      'style',
      'textConfig',
      'defaultValues',
      'sizes',
      'variants',
      'layout',
    ]);

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, column] of Object.entries(FIELD_MAP)) {
      if (!(key in body)) continue;

      updates.push(`${column} = $${idx++}`);
      values.push(
        JSON_FIELDS.has(key) ? JSON.stringify(body[key]) : body[key]
      );
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE public.templates
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `;

    const rows = await query<any>(sql, values);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, template: rows[0] });
  } catch (err: any) {
    console.error('Error updating template in Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
