import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import { MOCK_TEMPLATES } from '../../data/mock-templates';
import { normalizeTemplate } from '../template-utils';
import { DEMO_USERS } from '../../lib/auth-context';
import { DEFAULT_PAYMENT_SETTINGS, DEFAULT_BUSINESS_SETTINGS } from '../../lib/order-store';

const rawConn =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  'postgresql://postgres:postgres@localhost:5432/postgres';
const connectionString = rawConn.replace(/[?&]sslmode=[^&]+/, '');

async function migrateAndSeed() {
  console.log('--- Connecting to Supabase PostgreSQL Database ---');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✓ Successfully connected to Supabase.');

  try {
    // 1. Run Schema DDL
    console.log('--- Running Schema DDL ---');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✓ Schema tables and indices created.');

    // 2. Seed Designs (each carrying sizes, colour variants and a layout)
    console.log(`--- Seeding ${MOCK_TEMPLATES.length} Design(s) ---`);
    for (const tpl of MOCK_TEMPLATES) {
      const design = normalizeTemplate(tpl);
      await client.query(
        `INSERT INTO public.templates (
          id, name, category, supported_sizes, thumbnail, description, material,
          price_starting_at, badge, enabled, style, text_config, editable_fields, default_values,
          sizes, variants, layout
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          supported_sizes = EXCLUDED.supported_sizes,
          description = EXCLUDED.description,
          material = EXCLUDED.material,
          price_starting_at = EXCLUDED.price_starting_at,
          badge = EXCLUDED.badge,
          style = EXCLUDED.style,
          text_config = EXCLUDED.text_config,
          default_values = EXCLUDED.default_values,
          sizes = EXCLUDED.sizes,
          variants = EXCLUDED.variants,
          layout = EXCLUDED.layout,
          updated_at = NOW();`,
        [
          design.id,
          design.name,
          design.category,
          design.supportedSizes,
          design.thumbnail,
          design.description,
          design.material,
          design.priceStartingAt,
          design.badge || null,
          design.enabled ?? true,
          JSON.stringify(design.style),
          JSON.stringify(design.textConfig),
          design.editableFields,
          JSON.stringify(design.defaultValues),
          JSON.stringify(design.sizes || []),
          JSON.stringify(design.variants || []),
          JSON.stringify(design.layout || [])
        ]
      );
    }
    console.log(`✓ Seeded ${MOCK_TEMPLATES.length} design(s) successfully.`);

    // 3. Seed Profiles (Demo Users)
    console.log('--- Seeding User Profiles ---');
    await client.query(
      `INSERT INTO public.profiles (id, name, email, phone, role)
       VALUES 
        ('usr-cust-01', 'Md. Anisur Rahman', 'customer@example.com', '+880 1711-223344', 'customer'),
        ('usr-admin-01', 'Admin Operations Manager', 'admin@sun3d.com', '+880 1800-SUN3D', 'admin')
       ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role;`
    );
    console.log('✓ Seeded customer and admin profiles.');

    // 4. Seed Payment Settings
    console.log('--- Seeding Payment Settings ---');
    await client.query(
      `INSERT INTO public.payment_settings (
        id, bkash_number, bkash_account_type, bkash_instructions,
        nagad_number, nagad_account_type, nagad_instructions
      ) VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        bkash_number = EXCLUDED.bkash_number,
        bkash_account_type = EXCLUDED.bkash_account_type,
        bkash_instructions = EXCLUDED.bkash_instructions,
        nagad_number = EXCLUDED.nagad_number,
        nagad_account_type = EXCLUDED.nagad_account_type,
        nagad_instructions = EXCLUDED.nagad_instructions,
        updated_at = NOW();`,
      [
        DEFAULT_PAYMENT_SETTINGS.bkashNumber,
        DEFAULT_PAYMENT_SETTINGS.bkashAccountType,
        DEFAULT_PAYMENT_SETTINGS.bkashInstructions,
        DEFAULT_PAYMENT_SETTINGS.nagadNumber,
        DEFAULT_PAYMENT_SETTINGS.nagadAccountType,
        DEFAULT_PAYMENT_SETTINGS.nagadInstructions
      ]
    );
    console.log('✓ Seeded bKash & Nagad payment settings.');

    // 5. Seed Business Settings
    console.log('--- Seeding Business Settings ---');
    await client.query('DROP TABLE IF EXISTS public.business_settings;');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.business_settings (
        id INT PRIMARY KEY DEFAULT 1,
        business_name TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        workshop_address TEXT NOT NULL,
        default_currency TEXT NOT NULL DEFAULT 'BDT (৳)',
        default_order_status TEXT NOT NULL DEFAULT 'New',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT single_business_settings_row CHECK (id = 1)
      );
    `);
    await client.query(
      `INSERT INTO public.business_settings (
        id, business_name, contact_phone, contact_email, workshop_address, default_currency, default_order_status
      ) VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        business_name = EXCLUDED.business_name,
        contact_phone = EXCLUDED.contact_phone,
        contact_email = EXCLUDED.contact_email,
        workshop_address = EXCLUDED.workshop_address,
        default_currency = EXCLUDED.default_currency,
        default_order_status = EXCLUDED.default_order_status,
        updated_at = NOW();`,
      [
        DEFAULT_BUSINESS_SETTINGS.businessName,
        DEFAULT_BUSINESS_SETTINGS.contactPhone,
        DEFAULT_BUSINESS_SETTINGS.contactEmail,
        DEFAULT_BUSINESS_SETTINGS.workshopAddress,
        DEFAULT_BUSINESS_SETTINGS.defaultCurrency,
        DEFAULT_BUSINESS_SETTINGS.defaultOrderStatus
      ]
    );
    console.log('✓ Seeded business settings.');

    // 6. Verify Tables Count
    const tplCount = await client.query('SELECT count(*) FROM public.templates;');
    const profCount = await client.query('SELECT count(*) FROM public.profiles;');
    const ordCount = await client.query('SELECT count(*) FROM public.orders;');

    console.log('\n======================================================');
    console.log('🎉 LIVE SUPABASE MIGRATION & SEED COMPLETE!');
    console.log(`• Templates in DB: ${tplCount.rows[0].count}`);
    console.log(`• Profiles in DB:  ${profCount.rows[0].count}`);
    console.log(`• Orders in DB:    ${ordCount.rows[0].count}`);
    console.log('======================================================\n');
  } finally {
    await client.end();
  }
}

migrateAndSeed().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
