# 👑 Abid Store — Haute Horlogerie & All-Brand Luxury Watches

A luxury e-commerce platform and bespoke watch builder for all prestigious brand watches (**Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer, Breitling, IWC, Jaeger-LeCoultre, Tissot, Seiko**), featuring a vector logo, an interactive **Bespoke Watch Builder**, and **Supabase Database** integration.

---

## 📁 File and Folder Structure

```
abid_website/
├── index.html                   # Luxury Storefront: Hero, Brand Ribbon, Curated Collections, Watch Builder Teaser, Testimonials
├── catalog.html                 # All-Brand Watch Vault: Multi-faceted filters (Brand, Style, Movement, Price Range, Search, Grid/List)
├── watch-builder.html           # Interactive Watch Builder & Customizer with live SVG watch face & caseback engraving visualizer
├── product-details.html         # Rich Watch Details page: Specifications table, zoom gallery, provenance, and related watches
├── cart.html                    # Shopping Bag & Checkout Modal: Inserts orders into Supabase 'orders' table
├── admin.html                   # Store Builder & Admin Dashboard: Add/delete watches, view orders, test Supabase connection
│
├── css/
│   ├── styles.css               # Luxury design system: Gold/Obsidian theme, typography, glassmorphism, responsive navigation
│   ├── catalog.css              # Multi-faceted filter sidebar, watch cards, quick-view modal, product details specs
│   ├── builder.css              # Interactive watch configurator stage, option swatches, dial/caseback toggles
│   └── admin.css                # Admin metrics cards, data tables, status badges, and product insertion modals
│
├── js/
│   ├── supabase-config.js       # Supabase client setup with user's keys, error resilience, and automatic fallback
│   ├── products-data.js         # Curated catalog seed data (12+ iconic luxury brand watches with high-res photography)
│   ├── app.js                   # Core app logic: Cart drawer, multi-currency switcher (USD, EUR, GBP, AED), toast notifications
│   ├── catalog.js               # Multi-parameter filter engine (brands, categories, movements, price slider, instant search)
│   ├── watch-builder.js         # Interactive SVG watch customizer: case metals, sunburst dials, bezels, straps, laser engraving
│   ├── cart.js                  # Shopping bag operations, subtotal calculations, armored courier fee, and Supabase order placement
│   └── admin.js                 # Admin inventory management, order receiver, Supabase diagnostic banner, and 1-click SQL modal
│
├── assets/
│   ├── logo.svg                 # Bespoke Haute Horlogerie gold vector crest logo for "ABID STORE"
│   ├── favicon.svg              # Compact gold monogram favicon for browser tabs
│   └── images/                  # Media assets directory
│
├── supabase/
│   ├── schema.sql               # Complete SQL script for tables: products, orders, custom_watches, inquiries, subscribers + RLS
│   └── README.md                # 1-minute step-by-step guide to run the schema in your Supabase SQL Editor
│
└── README.md                    # Project documentation, features, and setup instructions
```

---

## ⚡ Supabase Database Configuration

The web application is pre-configured with your Supabase credentials:
- **Supabase Project URL**: `https://btuhffpkirhviftczgeu.supabase.co`
- **Supabase Publishable Key ID**: `sb_publishable_XXkwsGlSsssTMT4mT_nFqw_A2_I6vGE`
- **Supabase Anon / JWT Token**: Pre-configured in [`js/supabase-config.js`](file:///c:/Users/Admin/Downloads/abid_website/js/supabase-config.js)

### 🚀 1-Minute Supabase Database Setup
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard/project/btuhffpkirhviftczgeu/sql).
2. Open the **SQL Editor** (`>_`).
3. Copy the contents of [`supabase/schema.sql`](file:///c:/Users/Admin/Downloads/abid_website/supabase/schema.sql) and paste them into the SQL editor.
4. Click **Run**.
5. All tables (`products`, `orders`, `custom_watches`, `inquiries`, `subscribers`) are created with pre-populated luxury watches and security policies!

> **Note on Resilient Architecture**: If you haven't run the SQL script yet, the website automatically falls back to the embedded catalog of luxury watches, and stores custom builds and orders locally. Your website works **100% smoothly immediately** upon opening!

---

## 🌟 Key Features

1. **Bespoke Logo & Luxury Horology Theme**:
   - Vector SVG crest featuring an interlocking monogram "A" within an intricate tourbillon cage and Roman numeral hour markers.
   - Deep obsidian and polished gold palette with typography inspired by Swiss watchmaking (`Cinzel` & `Montserrat`).

2. **All-Brand Catalog**:
   - Browse **Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer, Breitling, IWC, Jaeger-LeCoultre, Tissot, Seiko**.
   - Filter by brand, style (Diver, Chronograph, Classic, Luxury Sport, Aviation), movement (Automatic, Manual), and price range slider.
   - Quick View modal and dedicated product details view.

3. **Interactive Bespoke Watch Builder (`watch-builder.html`)**:
   - Live visual SVG watch configurator.
   - Customize **Case Metal** (Oystersteel 904L, 18K Yellow Gold, 18K Everose Gold, Titanium, DLC Carbon).
   - Customize **Dial Style** (Royal Blue Sunburst, Emerald Forest, Midnight Obsidian, Champagne Gold, Silver Rhodium, Skeleton Openwork).
   - Customize **Bezel** (Fluted, Ceramic Diver 60-min, Smooth, Diamond Baguette).
   - Customize **Strap** (Oyster 3-link, Jubilee 5-link, Alligator Leather, Oysterflex Rubber).
   - Customize **Movement** (Calibre 3235, Calibre 4130 Chrono, Flying Tourbillon).
   - Add **Custom Laser Engraving** with a live flip to the sapphire exhibition caseback!
   - Saves bespoke designs directly to Supabase (`custom_watches` table).

4. **Multi-Currency Converter**:
   - Instant live conversion between **USD ($)**, **EUR (€)**, **GBP (£)**, and **AED (د.إ)**.

5. **Shopping Bag & Encrypted Checkout (`cart.html`)**:
   - Slide-out cart drawer on all pages + full cart page.
   - Customer checkout modal submitting orders directly to Supabase (`orders` table).
   - Generates order confirmation receipt with printable tracking ID.

6. **Store Builder & Admin Panel (`admin.html`)**:
   - Real-time inventory manager (Add, view, and delete watches).
   - Order viewer showing customer details, items, amounts, and dates.
   - Live Supabase connection diagnostic health banner.
   - 1-Click "Copy SQL Schema" tool.

---

## 🖥️ How to Run Locally

You can launch this website immediately in any modern web browser:

### Option 1: Direct File Opening
Double-click [`index.html`](file:///c:/Users/Admin/Downloads/abid_website/index.html) or right-click -> **Open with Google Chrome / Microsoft Edge / Firefox**.

### Option 2: Local HTTP Server (Recommended)
Using Node.js:
```sh
npx serve .
# or
npx http-server -p 8080
```
Or using Python:
```sh
python -m http.server 8080
```
Then visit: `http://localhost:8080`
