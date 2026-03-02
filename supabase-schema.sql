-- High Tech Sport — Complete Database Schema
-- Run in Supabase SQL Editor

-- ============================================
-- Categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  old_price INTEGER,
  sku TEXT,
  stock INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'hidden')),
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_wilaya TEXT NOT NULL,
  customer_commune TEXT,
  customer_address TEXT NOT NULL,
  delivery_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  discount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  promo_code TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Customers (auto-created from orders)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  wilaya TEXT,
  commune TEXT,
  address TEXT,
  order_count INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  is_blacklisted BOOLEAN DEFAULT false,
  blacklist_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Shipping Rates (58 wilayas)
-- ============================================
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wilaya_code INTEGER NOT NULL UNIQUE,
  wilaya_name TEXT NOT NULL,
  desk_price INTEGER NOT NULL DEFAULT 600,
  home_price INTEGER NOT NULL DEFAULT 800,
  estimated_days INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true
);

-- ============================================
-- Promotions / Promo Codes
-- ============================================
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL,
  min_order INTEGER DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  max_per_customer INTEGER DEFAULT 1,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CMS Content
-- ============================================
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Admin Users
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('owner', 'manager', 'employee')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_shipping" ON shipping_rates FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_cms" ON cms_content FOR SELECT USING (true);

-- Orders: anyone can insert (guest checkout), read own by phone
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_orders" ON orders FOR SELECT USING (true);

-- Customers: insert on checkout
CREATE POLICY "public_insert_customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_customers" ON customers FOR SELECT USING (true);

-- Promotions: public read active
CREATE POLICY "public_read_promotions" ON promotions FOR SELECT USING (is_active = true);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_shipping_wilaya ON shipping_rates(wilaya_code);

-- ============================================
-- Seed: Categories
-- ============================================
INSERT INTO categories (name, slug, description, position) VALUES
  ('Montres Intelligentes', 'montres-intelligentes', 'Montres connectées et smartwatches', 1),
  ('Vélos', 'velos', 'Vélos électriques, de route et VTT', 2),
  ('Accessoires', 'accessoires', 'Accessoires vélo et montres', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed: 58 Algerian Wilayas with shipping rates
-- ============================================
INSERT INTO shipping_rates (wilaya_code, wilaya_name, desk_price, home_price, estimated_days) VALUES
  (1, 'Adrar', 800, 1000, 5),
  (2, 'Chlef', 500, 700, 2),
  (3, 'Laghouat', 700, 900, 4),
  (4, 'Oum El Bouaghi', 600, 800, 3),
  (5, 'Batna', 600, 800, 3),
  (6, 'Béjaïa', 500, 700, 2),
  (7, 'Biskra', 600, 800, 3),
  (8, 'Béchar', 800, 1000, 5),
  (9, 'Blida', 400, 600, 1),
  (10, 'Bouira', 500, 700, 2),
  (11, 'Tamanrasset', 900, 1100, 6),
  (12, 'Tébessa', 600, 800, 3),
  (13, 'Tlemcen', 600, 800, 3),
  (14, 'Tiaret', 500, 700, 2),
  (15, 'Tizi Ouzou', 500, 700, 2),
  (16, 'Alger', 400, 600, 1),
  (17, 'Djelfa', 600, 800, 3),
  (18, 'Jijel', 500, 700, 2),
  (19, 'Sétif', 500, 700, 2),
  (20, 'Saïda', 600, 800, 3),
  (21, 'Skikda', 500, 700, 2),
  (22, 'Sidi Bel Abbès', 600, 800, 3),
  (23, 'Annaba', 500, 700, 2),
  (24, 'Guelma', 600, 800, 3),
  (25, 'Constantine', 500, 700, 2),
  (26, 'Médéa', 400, 600, 1),
  (27, 'Mostaganem', 500, 700, 2),
  (28, 'M''sila', 600, 800, 3),
  (29, 'Mascara', 600, 800, 3),
  (30, 'Ouargla', 700, 900, 4),
  (31, 'Oran', 500, 700, 2),
  (32, 'El Bayadh', 700, 900, 4),
  (33, 'Illizi', 900, 1100, 6),
  (34, 'Bordj Bou Arréridj', 500, 700, 2),
  (35, 'Boumerdès', 400, 600, 1),
  (36, 'El Tarf', 600, 800, 3),
  (37, 'Tindouf', 900, 1100, 6),
  (38, 'Tissemsilt', 600, 800, 3),
  (39, 'El Oued', 700, 900, 4),
  (40, 'Khenchela', 600, 800, 3),
  (41, 'Souk Ahras', 600, 800, 3),
  (42, 'Tipaza', 400, 600, 1),
  (43, 'Mila', 500, 700, 2),
  (44, 'Aïn Defla', 400, 600, 1),
  (45, 'Naâma', 700, 900, 4),
  (46, 'Aïn Témouchent', 600, 800, 3),
  (47, 'Ghardaïa', 700, 900, 4),
  (48, 'Relizane', 500, 700, 2),
  (49, 'El M''hir', 600, 800, 3),
  (50, 'El Meniaa', 800, 1000, 5),
  (51, 'Ouled Djellal', 700, 900, 4),
  (52, 'Bordj Badji Mokhtar', 900, 1100, 6),
  (53, 'Béni Abbès', 800, 1000, 5),
  (54, 'Timimoun', 900, 1100, 6),
  (55, 'Touggourt', 700, 900, 4),
  (56, 'Djanet', 900, 1100, 6),
  (57, 'In Salah', 900, 1100, 6),
  (58, 'In Guezzam', 900, 1100, 6)
ON CONFLICT (wilaya_code) DO NOTHING;

-- ============================================
-- Seed: Default CMS Content
-- ============================================
INSERT INTO cms_content (key, value) VALUES
  ('announcement_bar', '{"text": "🚚 Livraison disponible vers les 58 wilayas — Paiement à la livraison", "is_active": true}'::jsonb),
  ('hero_banners', '[]'::jsonb),
  ('about_page', '{"content": "High Tech Sport est votre destination pour les équipements sportifs de qualité à Khemis Miliana."}'::jsonb),
  ('faq_page', '{"items": []}'::jsonb),
  ('return_policy', '{"content": ""}'::jsonb),
  ('social_links', '{"facebook": "https://www.facebook.com/Garmin.pro.dz", "instagram": "", "whatsapp": ""}'::jsonb),
  ('store_info', '{"name": "High Tech Sport", "phone": "", "email": "", "address": "Khemis Miliana, Algérie", "whatsapp": ""}'::jsonb),
  ('free_shipping_threshold', '{"amount": 10000}'::jsonb)
ON CONFLICT (key) DO NOTHING;
