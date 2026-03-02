-- ============================================
-- Advanced Admin Features Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add new columns to promotions table
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'percentage';
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS applies_to TEXT DEFAULT 'all';

-- Make 'code' nullable (promotions without codes)
ALTER TABLE promotions ALTER COLUMN code DROP NOT NULL;
-- Drop unique constraint on code to allow null
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_code_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code) WHERE code IS NOT NULL;

-- Update type check to allow free_shipping
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_type_check;
ALTER TABLE promotions ADD CONSTRAINT promotions_type_check
  CHECK (type IN ('percentage', 'fixed', 'free_shipping'));

-- 2. Promotion-Product junction table
CREATE TABLE IF NOT EXISTS promotion_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(promotion_id, product_id)
);

ALTER TABLE promotion_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_promo_products" ON promotion_products FOR SELECT USING (true);

-- 3. Product Bundles
CREATE TABLE IF NOT EXISTS product_bundles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  bundle_price INTEGER NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID REFERENCES product_bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  UNIQUE(bundle_id, product_id)
);

ALTER TABLE product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_bundles" ON product_bundles FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_bundle_items" ON bundle_items FOR SELECT USING (true);

-- 4. Store settings table (if not exists)
CREATE TABLE IF NOT EXISTS store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  store_name TEXT DEFAULT 'MA BOUTIQUE',
  store_email TEXT DEFAULT '',
  store_phone TEXT DEFAULT '',
  store_address TEXT DEFAULT '',
  yalidine_api_id TEXT DEFAULT '',
  yalidine_api_token TEXT DEFAULT '',
  admin_password TEXT DEFAULT 'admin123',
  cod_enabled BOOLEAN DEFAULT true,
  cod_fee INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed a default row if empty
INSERT INTO store_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Add admin_password column if table already exists
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS admin_password TEXT DEFAULT 'admin123';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS cod_enabled BOOLEAN DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS cod_fee INTEGER DEFAULT 0;

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "public_read_settings" ON store_settings FOR SELECT USING (true);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_promo_products_promo ON promotion_products(promotion_id);
CREATE INDEX IF NOT EXISTS idx_promo_products_product ON promotion_products(product_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_product ON bundle_items(product_id);
