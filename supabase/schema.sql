-- ============================================================
-- ABID STORE - SUPABASE DATABASE SCHEMA & INITIAL DATA
-- Luxury All-Brand Watch E-Commerce & Custom Watch Builder
-- ============================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    category TEXT DEFAULT 'Luxury',
    movement TEXT DEFAULT 'Automatic',
    case_material TEXT DEFAULT 'Stainless Steel',
    case_diameter TEXT DEFAULT '41mm',
    strap_material TEXT DEFAULT 'Steel Bracelet',
    water_resistance TEXT DEFAULT '100m / 330ft',
    dial_color TEXT DEFAULT 'Black',
    description TEXT,
    image_url TEXT NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 18,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT,
    country TEXT DEFAULT 'United States',
    postal_code TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    tax NUMERIC(12, 2) DEFAULT 0,
    shipping_fee NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_method TEXT DEFAULT 'Credit Card / Wire Transfer',
    order_status TEXT DEFAULT 'Processing',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Custom Watches Table (Interactive Watch Builder)
CREATE TABLE IF NOT EXISTS public.custom_watches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    configuration_id TEXT UNIQUE,
    customer_name TEXT,
    customer_email TEXT,
    case_type TEXT,
    dial_color TEXT,
    bezel_type TEXT,
    strap_type TEXT,
    movement TEXT,
    engraving_text TEXT,
    total_price NUMERIC(12, 2),
    specs JSONB,
    status TEXT DEFAULT 'Configured',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Inquiries / Contact Messages Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read, anyone can insert/update (for store demo/admin)
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert products" ON public.products;
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update products" ON public.products;
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete products" ON public.products;
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

-- Orders: Anyone can create orders, read orders
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);

-- Custom Watches: Anyone can save custom configurations
DROP POLICY IF EXISTS "Public insert custom_watches" ON public.custom_watches;
CREATE POLICY "Public insert custom_watches" ON public.custom_watches FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read custom_watches" ON public.custom_watches;
CREATE POLICY "Public read custom_watches" ON public.custom_watches FOR SELECT USING (true);

-- Inquiries: Anyone can submit inquiries
DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read inquiries" ON public.inquiries;
CREATE POLICY "Public read inquiries" ON public.inquiries FOR SELECT USING (true);

-- Subscribers: Anyone can subscribe
DROP POLICY IF EXISTS "Public insert subscribers" ON public.subscribers;
CREATE POLICY "Public insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);

-- ============================================================
-- SEED DATA: LUXURY & DESIGNER ALL-BRAND WATCHES
-- ============================================================
INSERT INTO public.products (
    title, brand, model, price, original_price, category, movement, case_material, case_diameter, strap_material, water_resistance, dial_color, description, image_url, rating, reviews_count, in_stock, stock_quantity, featured
) VALUES
(
    'Rolex Submariner Date "Kermit"',
    'Rolex',
    'Submariner Date 126610LV',
    15800.00,
    17200.00,
    'Diver',
    'Automatic Calibre 3235',
    'Oystersteel 904L',
    '41mm',
    'Oyster Bracelet with Glidelock',
    '300m / 1000ft',
    'Intense Black with Green Cerachrom',
    'The archetype of the diver watch. Unidirectional rotatable Cerachrom green bezel, luminescent Chromalight display, and 70-hour power reserve.',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
    4.9,
    42,
    true,
    4,
    true
),
(
    'Rolex Cosmograph Daytona Everose Gold',
    'Rolex',
    'Cosmograph Daytona 116505',
    39500.00,
    42000.00,
    'Chronograph',
    'Automatic Calibre 4130',
    '18 ct Everose Gold',
    '40mm',
    'Oyster 18 ct Everose Gold',
    '100m / 330ft',
    'Sundust with Black Snailed Counters',
    'The ultimate racing chronograph crafted in Rolex proprietary 18 ct Everose gold alloy with tachymetric scale engraved bezel.',
    'https://images.unsplash.com/photo-1547996160-71dfabb1ab2d?auto=format&fit=crop&w=1000&q=80',
    5.0,
    28,
    true,
    2,
    true
),
(
    'Patek Philippe Nautilus Stainless Steel',
    'Patek Philippe',
    'Nautilus 5711/1A-010',
    78500.00,
    84000.00,
    'Luxury Sport',
    'Self-winding Calibre 26-330 S C',
    'Stainless Steel',
    '40mm',
    'Steel with Nautilus Fold-over Clasp',
    '120m / 390ft',
    'Horizontally Embossed Blue Sunburst',
    'With the rounded octagonal shape of its bezel, the ingenious porthole construction of its case, and its horizontally embossed dial, the Nautilus has epitomized luxury sport since 1976.',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    5.0,
    64,
    true,
    1,
    true
),
(
    'Audemars Piguet Royal Oak Chronograph',
    'Audemars Piguet',
    'Royal Oak 26240ST',
    42000.00,
    46000.00,
    'Chronograph',
    'Self-winding Calibre 4401 Flyback',
    'Stainless Steel',
    '41mm',
    'Integrated Stainless Steel Bracelet',
    '50m / 165ft',
    'Grande Tapisserie Bleu Nuit Nuage 50',
    'Iconic octagonal bezel with 8 hexagonal white gold screws, hand-finished satin-brushed and polished surfaces with integrated bracelet.',
    'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1000&q=80',
    4.9,
    33,
    true,
    3,
    true
),
(
    'Omega Speedmaster Moonwatch Professional',
    'Omega',
    'Speedmaster Co-Axial Master Chronometer',
    7600.00,
    8200.00,
    'Chronograph',
    'Manual-winding Calibre 3861',
    'Stainless Steel',
    '42mm',
    'Stainless Steel Brushed-Polished',
    '50m / 165ft',
    'Step Dial Matte Black',
    'The legendary timepiece that has been part of all six moon landings. Master Chronometer certified by METAS, resistant to magnetic fields up to 15,000 gauss.',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1000&q=80',
    4.8,
    58,
    true,
    7,
    true
),
(
    'Cartier Santos de Cartier Large Model',
    'Cartier',
    'Santos WSSA0030',
    7750.00,
    8100.00,
    'Classic',
    'Automatic Calibre 1847 MC',
    'Stainless Steel',
    '39.8mm',
    'Steel with SmartLink & Interchangeable Navy Calfskin',
    '100m / 330ft',
    'Deep Sunray Gradient Blue',
    'Created in 1904 by Louis Cartier for aviator Alberto Santos-Dumont. Curved case ergonomics, exposed screws, and QuickSwitch interchangeable strap system.',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
    4.9,
    39,
    true,
    5,
    true
),
(
    'TAG Heuer Monaco Gulf Special Edition',
    'TAG Heuer',
    'Monaco Calibre Heuer 02',
    7800.00,
    8400.00,
    'Chronograph',
    'In-house Calibre Heuer 02 Automatic',
    'Fine-brushed Steel',
    '39mm',
    'Perforated Blue Calfskin Leather',
    '100m / 330ft',
    'Sunray Blue with Iconic Gulf Stripes',
    'The timeless square-cased racing icon immortalized by Steve McQueen in Le Mans, powered by the Manufacture Calibre Heuer 02 with 80 hours power reserve.',
    'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1000&q=80',
    4.8,
    21,
    true,
    4,
    false
),
(
    'Breitling Navitimer B01 Chronograph 43',
    'Breitling',
    'Navitimer AB0138241C1A1',
    9300.00,
    9800.00,
    'Aviation',
    'Breitling Manufacture Calibre 01',
    'Stainless Steel',
    '43mm',
    'Navitimer 7-Row Stainless Steel',
    '30m / 100ft',
    'Ice Blue with Black Subdials',
    'For 70 years, Breitling original pilot watch has been beloved by aviators and tastemakers. Features the circular slide rule, baton indexes, and notched bezel.',
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=1000&q=80',
    4.8,
    19,
    true,
    6,
    false
),
(
    'IWC Portugieser Automatic 40',
    'IWC Schaffhausen',
    'Portugieser IW358304',
    7450.00,
    7900.00,
    'Dress / Classic',
    'IWC-manufactured 82200 Calibre',
    'Stainless Steel',
    '40.4mm',
    'Black Alligator Leather by Santoni',
    '30m / 100ft',
    'Silver-plated with Blue Arabic Numerals & Feuille Hands',
    'Quintessential dress watch purity. Compact 40mm diameter with railway-track chapter ring, slim leaf hands, and Pellaton winding system.',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
    4.9,
    15,
    true,
    5,
    false
),
(
    'Jaeger-LeCoultre Reverso Tribute Monoface',
    'Jaeger-LeCoultre',
    'Reverso Q3978430',
    10200.00,
    11000.00,
    'Art Deco Luxury',
    'Manual-winding Calibre 822',
    'Stainless Steel',
    '45.6 x 27.4mm',
    'Casa Fagliano Green Leather Strap',
    '30m / 100ft',
    'Sunray Emerald Green Lacquered',
    'Born in 1931 for polo players to protect the watch glass during match play. Swivel case mechanism, pure Art Deco geometry, and Casa Fagliano craftsmanship.',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80',
    5.0,
    17,
    true,
    2,
    true
),
(
    'Tissot PRX Powermatic 80',
    'Tissot',
    'PRX Powermatic T137.407.11.041.00',
    725.00,
    795.00,
    'Sport Chic',
    'Powermatic 80.111 Automatic',
    '316L Stainless Steel',
    '40mm',
    'Single-link Integrated Steel Bracelet',
    '100m / 330ft',
    'Waffle Pattern Navy Blue',
    'Retro 1978 design revival with modern Powermatic 80 movement offering 80 hours power reserve and Nivachron anti-magnetic balance spring.',
    'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1000&q=80',
    4.7,
    88,
    true,
    14,
    false
),
(
    'Seiko Prospex 1965 Diver "62MAS Modern"',
    'Seiko',
    'Prospex SPB143J1',
    1200.00,
    1350.00,
    'Diver',
    'Automatic Calibre 6R35',
    'Stainless Steel with Super-hard Coating',
    '40.5mm',
    'Solid Stainless Steel Diver Bracelet',
    '200m / 660ft Diver',
    'Charcoal Sunburst Grey',
    'Modern tribute to Japan first diver watch from 1965. Curved sapphire crystal with anti-reflective coating on inner surface and Lumibrite on hands and indexes.',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1000&q=80',
    4.8,
    73,
    true,
    10,
    false
);
