-- ==========================================================
-- Sun3D Production Database Schema
-- Architecture: PostgreSQL 17 / Supabase
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Templates Catalog Table
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  supported_sizes TEXT[] NOT NULL DEFAULT ARRAY['2:1', '1:1', '4:1'],
  thumbnail TEXT NOT NULL,
  description TEXT NOT NULL,
  material TEXT NOT NULL,
  price_starting_at NUMERIC NOT NULL,
  badge TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  style JSONB NOT NULL,
  text_config JSONB NOT NULL,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  layout JSONB NOT NULL DEFAULT '[]'::jsonb,
  canvas_json JSONB,
  palette JSONB,
  editable_fields TEXT[] NOT NULL DEFAULT ARRAY['houseName', 'proprietor', 'address', 'holdingNumber'],
  default_values JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Customer Saved Designs Table
CREATE TABLE IF NOT EXISTS public.customer_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  template_id TEXT NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  size TEXT NOT NULL CHECK (size IN ('2:1', '1:1', '4:1', 'custom')),
  custom_size JSONB,
  variant_id TEXT,
  house_name TEXT NOT NULL,
  proprietor TEXT NOT NULL,
  address TEXT NOT NULL,
  holding_number TEXT NOT NULL,
  typography JSONB NOT NULL,
  colors JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Customer Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  template_id TEXT NOT NULL REFERENCES public.templates(id),
  size TEXT NOT NULL CHECK (size IN ('2:1', '1:1', '4:1', 'custom')),
  custom_size JSONB,
  variant_id TEXT,
  house_name TEXT NOT NULL,
  final_design_data JSONB NOT NULL,
  price NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bKash', 'Nagad')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'submitted', 'paid', 'rejected')),
  production_status TEXT NOT NULL DEFAULT 'New' CHECK (production_status IN ('New', 'Payment Pending', 'Working', 'Ready', 'Completed')),
  transaction_id TEXT,
  sender_phone TEXT,
  payment_note TEXT,
  rejection_reason TEXT,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Payment Settings Table (bKash & Nagad)
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id INT PRIMARY KEY DEFAULT 1,
  bkash_number TEXT NOT NULL,
  bkash_account_type TEXT NOT NULL,
  bkash_instructions TEXT NOT NULL,
  nagad_number TEXT NOT NULL,
  nagad_account_type TEXT NOT NULL,
  nagad_instructions TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_payment_settings_row CHECK (id = 1)
);

-- 6. Business Settings Table
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

-- ==========================================================
-- Migration: designs with sizes + colour variants
-- Idempotent, so it is safe to re-run on an existing database.
-- ==========================================================

ALTER TABLE public.templates
  ADD COLUMN IF NOT EXISTS sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS layout JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS canvas_json JSONB,
  ADD COLUMN IF NOT EXISTS palette JSONB,
  ADD COLUMN IF NOT EXISTS artworks JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.templates
  ALTER COLUMN supported_sizes SET DEFAULT ARRAY['2:1', '1:1', '4:1'];

ALTER TABLE public.customer_designs
  ADD COLUMN IF NOT EXISTS custom_size JSONB,
  ADD COLUMN IF NOT EXISTS variant_id TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS custom_size JSONB,
  ADD COLUMN IF NOT EXISTS variant_id TEXT;

-- Old rows were keyed 5:3 / 4:2 / 4:3.
UPDATE public.customer_designs
   SET size = CASE size WHEN '4:2' THEN '2:1' WHEN '5:3' THEN '2:1' WHEN '4:3' THEN '1:1' ELSE size END;
UPDATE public.orders
   SET size = CASE size WHEN '4:2' THEN '2:1' WHEN '5:3' THEN '2:1' WHEN '4:3' THEN '1:1' ELSE size END;

ALTER TABLE public.customer_designs DROP CONSTRAINT IF EXISTS customer_designs_size_check;
ALTER TABLE public.customer_designs
  ADD CONSTRAINT customer_designs_size_check CHECK (size IN ('2:1', '1:1', '4:1', 'custom'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_size_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_size_check CHECK (size IN ('2:1', '1:1', '4:1', 'custom'));

-- Indices for high performance queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_production_status ON public.orders(production_status);
CREATE INDEX IF NOT EXISTS idx_customer_designs_user_id ON public.customer_designs(user_id);
