import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PaymentSettings, BusinessSettings } from '@/types/nameplate';
import { DEFAULT_PAYMENT_SETTINGS, DEFAULT_BUSINESS_SETTINGS } from '@/lib/order-store';

export async function GET() {
  try {
    // Ensure columns exist
    await query(`
      ALTER TABLE public.payment_settings 
      ADD COLUMN IF NOT EXISTS bkash_enabled BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS nagad_enabled BOOLEAN DEFAULT TRUE;
    `).catch(() => {});

    const payRows = await query<any>('SELECT * FROM public.payment_settings WHERE id = 1 LIMIT 1;');
    const bizRows = await query<any>('SELECT * FROM public.business_settings WHERE id = 1 LIMIT 1;');

    const paymentSettings: PaymentSettings = payRows.length > 0 ? {
      bkashNumber: payRows[0].bkash_number,
      bkashAccountType: payRows[0].bkash_account_type,
      bkashInstructions: payRows[0].bkash_instructions,
      bkashEnabled: payRows[0].bkash_enabled ?? true,
      nagadNumber: payRows[0].nagad_number,
      nagadAccountType: payRows[0].nagad_account_type,
      nagadInstructions: payRows[0].nagad_instructions,
      nagadEnabled: payRows[0].nagad_enabled ?? true,
    } : DEFAULT_PAYMENT_SETTINGS;

    const businessSettings: BusinessSettings = bizRows.length > 0 ? {
      businessName: bizRows[0].business_name,
      contactPhone: bizRows[0].contact_phone,
      contactEmail: bizRows[0].contact_email,
      workshopAddress: bizRows[0].workshop_address,
      defaultCurrency: bizRows[0].default_currency,
      defaultOrderStatus: bizRows[0].default_order_status
    } : DEFAULT_BUSINESS_SETTINGS;

    return NextResponse.json({
      success: true,
      paymentSettings,
      businessSettings
    });
  } catch (err: any) {
    console.error('Error fetching settings from Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, paymentSettings, businessSettings } = body;

    if (type === 'payment' && paymentSettings) {
      await query(`
        ALTER TABLE public.payment_settings 
        ADD COLUMN IF NOT EXISTS bkash_enabled BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS nagad_enabled BOOLEAN DEFAULT TRUE;
      `).catch(() => {});

      await query(
        `INSERT INTO public.payment_settings (
          id, bkash_number, bkash_account_type, bkash_instructions, bkash_enabled,
          nagad_number, nagad_account_type, nagad_instructions, nagad_enabled, updated_at
        ) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (id) DO UPDATE SET
          bkash_number = EXCLUDED.bkash_number,
          bkash_account_type = EXCLUDED.bkash_account_type,
          bkash_instructions = EXCLUDED.bkash_instructions,
          bkash_enabled = EXCLUDED.bkash_enabled,
          nagad_number = EXCLUDED.nagad_number,
          nagad_account_type = EXCLUDED.nagad_account_type,
          nagad_instructions = EXCLUDED.nagad_instructions,
          nagad_enabled = EXCLUDED.nagad_enabled,
          updated_at = NOW();`,
        [
          paymentSettings.bkashNumber,
          paymentSettings.bkashAccountType,
          paymentSettings.bkashInstructions,
          paymentSettings.bkashEnabled ?? true,
          paymentSettings.nagadNumber,
          paymentSettings.nagadAccountType,
          paymentSettings.nagadInstructions,
          paymentSettings.nagadEnabled ?? true
        ]
      );
      return NextResponse.json({ success: true, message: 'Payment settings saved to Supabase' });
    }

    if (type === 'business' && businessSettings) {
      await query(
        `INSERT INTO public.business_settings (
          id, business_name, contact_phone, contact_email, workshop_address, default_currency, default_order_status, updated_at
        ) VALUES (1, $1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (id) DO UPDATE SET
          business_name = EXCLUDED.business_name,
          contact_phone = EXCLUDED.contact_phone,
          contact_email = EXCLUDED.contact_email,
          workshop_address = EXCLUDED.workshop_address,
          default_currency = EXCLUDED.default_currency,
          default_order_status = EXCLUDED.default_order_status,
          updated_at = NOW();`,
        [
          businessSettings.businessName,
          businessSettings.contactPhone,
          businessSettings.contactEmail,
          businessSettings.workshopAddress,
          businessSettings.defaultCurrency || 'BDT (৳)',
          businessSettings.defaultOrderStatus || 'New'
        ]
      );
      return NextResponse.json({ success: true, message: 'Business settings saved to Supabase' });
    }

    return NextResponse.json({ success: false, error: 'Invalid settings type' }, { status: 400 });
  } catch (err: any) {
    console.error('Error saving settings to Supabase:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
