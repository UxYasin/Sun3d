import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (typeof body.enabled === 'boolean') {
      updates.push(`enabled = $${idx++}`);
      values.push(body.enabled);
    }
    if (body.name) {
      updates.push(`name = $${idx++}`);
      values.push(body.name);
    }
    if (body.priceStartingAt !== undefined) {
      updates.push(`price_starting_at = $${idx++}`);
      values.push(body.priceStartingAt);
    }
    if (body.description) {
      updates.push(`description = $${idx++}`);
      values.push(body.description);
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
