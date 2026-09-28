# Abid Store - Supabase Database Setup Guide

Welcome to the **Abid Store** Haute Horlogerie e-commerce database setup.

Your Supabase credentials have already been configured directly into the application:
- **Project URL**: `https://btuhffpkirhviftczgeu.supabase.co`
- **Publishable / Anon Key**: Configured in `js/supabase-config.js`

---

## 🚀 1-Click Database Setup (Under 1 Minute)

Follow these simple steps to initialize all tables (`products`, `orders`, `custom_watches`, `inquiries`, `subscribers`) with seed watches:

1. Open your browser and log into [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: **`btuhffpkirhviftczgeu`**.
3. In the left navigation bar, click on **SQL Editor** (icon: `>_`).
4. Click **New query** (or `+`).
5. Open the file `supabase/schema.sql` located in this project directory, copy all contents, and paste them into the SQL Editor.
6. Click the green **Run** button (or press `Ctrl+Enter`).
7. **Done!** Your tables are created with pre-populated luxury watches, row-level security (RLS) policies, and order storage.

---

## ⚡ What if you haven't run the SQL script yet?

**No worries!** The **Abid Store** web application is built with an **intelligent dual-mode architecture**:
- If Supabase tables are ready, it pulls live watches and saves orders directly to Supabase.
- If the tables are not yet created, it automatically falls back to the embedded catalog of luxury watches and stores orders locally, so your website **always works 100% smoothly** for testing and demonstration right out of the box!
- The store also includes a live **Supabase Status Pill** in the header/admin bar showing connection status.

---

## 🛠️ Included Tables:
1. `products`: Catalog of all brand luxury watches (Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, etc.).
2. `orders`: Customer checkout orders with line items, address, status, and totals.
3. `custom_watches`: Bespoke watch configurations saved from the interactive **Watch Builder**.
4. `inquiries`: Customer support and concierge VIP inquiries.
5. `subscribers`: VIP newsletter subscriptions.
