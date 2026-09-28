/**
 * Abid Store - Builder & Admin Dashboard Controller
 * Product Inventory, Order Management & Supabase Diagnostic Tools
 */

let adminProducts = [];
let adminOrders = [];

// Initialize Admin Dashboard
async function initAdminDashboard() {
  await checkSupabaseHealthBanner();
  await loadAdminProducts();
  await loadAdminOrders();
  setupAdminEventListeners();
}

// Diagnostic Health Banner
async function checkSupabaseHealthBanner() {
  const banner = document.getElementById("admin-supabase-banner");
  if (!banner) return;

  banner.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Checking Supabase connection...`;

  const status = await window.abidSupabase.checkConnection();
  if (status.connected && status.tablesReady) {
    banner.className = "supabase-banner";
    banner.innerHTML = `
      <div class="supabase-banner-text">
        <h4><i class="fas fa-check-circle" style="color:#34D399; margin-right:8px;"></i> Supabase Live & Connected</h4>
        <p>Your database tables (<code>products</code>, <code>orders</code>, <code>custom_watches</code>) are fully active and synchronized in real-time.</p>
      </div>
      <div>
        <button class="btn btn-outline btn-sm" onclick="checkSupabaseHealthBanner()"><i class="fas fa-sync-alt"></i> Recheck</button>
      </div>
    `;
  } else if (status.connected) {
    banner.className = "supabase-banner warning";
    banner.innerHTML = `
      <div class="supabase-banner-text">
        <h4><i class="fas fa-exclamation-triangle" style="color:#F59E0B; margin-right:8px;"></i> Supabase Project Connected (Database Schema Pending)</h4>
        <p>Project URL is reachable, but tables need to be created. Click <strong>"1-Click Copy SQL"</strong> and paste into Supabase SQL Editor.</p>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-primary btn-sm" onclick="openSqlModal()"><i class="fas fa-code"></i> View & Copy SQL</button>
        <button class="btn btn-outline btn-sm" onclick="checkSupabaseHealthBanner()"><i class="fas fa-sync-alt"></i> Test Ping</button>
      </div>
    `;
  } else {
    banner.className = "supabase-banner warning";
    banner.innerHTML = `
      <div class="supabase-banner-text">
        <h4><i class="fas fa-database" style="color:#F59E0B; margin-right:8px;"></i> Local High-Resilience Mode Active</h4>
        <p>Operating with local database fallback. All product additions and customer orders are securely stored in your browser.</p>
      </div>
      <div>
        <button class="btn btn-primary btn-sm" onclick="openSqlModal()"><i class="fas fa-database"></i> Setup Supabase Tables</button>
      </div>
    `;
  }
}

// Load Products in Admin
async function loadAdminProducts() {
  const tbody = document.getElementById("admin-products-tbody");
  const countEl = document.getElementById("admin-product-count");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;"><i class="fas fa-spinner fa-spin"></i> Loading inventory...</td></tr>`;

  adminProducts = await window.abidSupabase.getProducts();

  if (countEl) countEl.textContent = adminProducts.length;

  if (adminProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;">No watches found. Add your first timepiece above!</td></tr>`;
    return;
  }

  tbody.innerHTML = adminProducts.map(p => `
    <tr>
      <td>
        <div class="table-watch-cell">
          <img src="${p.image_url}" alt="${p.title}" class="table-watch-thumb">
          <div>
            <strong style="display:block;">${p.title}</strong>
            <span style="font-size:0.75rem; color:var(--text-muted);">${p.brand} ${p.model ? '• ' + p.model : ''}</span>
          </div>
        </div>
      </td>
      <td><span style="font-size:0.8rem; background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:4px;">${p.category || 'Luxury'}</span></td>
      <td style="color:var(--gold-light); font-weight:700;">${formatPrice(p.price)}</td>
      <td>${p.movement || 'Automatic'}</td>
      <td>
        <span style="color:${p.in_stock !== false ? '#34D399' : '#EF4444'}; font-size:0.8rem;">
          <i class="fas fa-circle" style="font-size:0.6rem;"></i> ${p.in_stock !== false ? 'In Stock (' + (p.stock_quantity || 5) + ')' : 'Sold Out'}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:8px;">
          <a href="product-details.html?id=${p.id}" class="btn btn-outline btn-sm" title="View in Store">
            <i class="fas fa-external-link-alt"></i>
          </a>
          <button class="btn btn-outline btn-sm" style="color:#EF4444; border-color:rgba(239,68,68,0.3);" onclick="handleDeleteProduct('${p.id}')" title="Delete Watch">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

// Load Orders in Admin
async function loadAdminOrders() {
  const tbody = document.getElementById("admin-orders-tbody");
  const countEl = document.getElementById("admin-order-count");
  if (!tbody) return;

  adminOrders = await window.abidSupabase.getOrders();
  if (countEl) countEl.textContent = adminOrders.length;

  if (adminOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;">No customer orders placed yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminOrders.map(o => `
    <tr>
      <td><strong style="color:var(--gold-light);">${o.order_number || o.id}</strong></td>
      <td>
        <div><strong>${o.customer_name}</strong></div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${o.customer_email}</div>
      </td>
      <td>
        <span style="font-size:0.8rem;">${Array.isArray(o.items) ? o.items.length + ' item(s)' : '1 item'}</span>
      </td>
      <td style="color:var(--gold-light); font-weight:700;">${formatPrice(o.total_amount)}</td>
      <td>
        <span class="table-badge-status confirmed">${o.order_status || 'Confirmed'}</span>
      </td>
      <td style="font-size:0.8rem; color:var(--text-muted);">
        ${o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recent'}
      </td>
    </tr>
  `).join("");
}

// Delete Product
async function handleDeleteProduct(id) {
  if (!confirm("Are you sure you want to remove this timepiece from the inventory?")) return;
  await window.abidSupabase.deleteProduct(id);
  showToast("Timepiece removed from inventory.", "fa-trash");
  loadAdminProducts();
}

// Event Listeners for Modals and Tabs
function setupAdminEventListeners() {
  // Tabs
  const tabBtns = document.querySelectorAll(".admin-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.tab;
      document.querySelectorAll(".admin-tab-content").forEach(c => c.style.display = "none");
      const targetEl = document.getElementById("tab-" + target);
      if (targetEl) targetEl.style.display = "block";
    });
  });

  // Add Product Form
  const addForm = document.getElementById("add-product-form");
  const addModal = document.getElementById("add-product-modal");
  const openAddBtn = document.getElementById("open-add-product-btn");
  const closeAddBtn = document.getElementById("close-add-product-btn");

  if (openAddBtn && addModal) {
    openAddBtn.addEventListener("click", () => addModal.classList.add("active"));
  }
  if (closeAddBtn && addModal) {
    closeAddBtn.addEventListener("click", () => addModal.classList.remove("active"));
  }

  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const product = {
        title: document.getElementById("p-title").value,
        brand: document.getElementById("p-brand").value,
        model: document.getElementById("p-model").value,
        price: parseFloat(document.getElementById("p-price").value),
        category: document.getElementById("p-category").value,
        movement: document.getElementById("p-movement").value,
        case_material: document.getElementById("p-material").value,
        case_diameter: document.getElementById("p-diameter").value,
        water_resistance: document.getElementById("p-water").value,
        image_url: document.getElementById("p-image").value,
        description: document.getElementById("p-desc").value,
        in_stock: true,
        stock_quantity: parseInt(document.getElementById("p-stock").value) || 5,
        rating: 5.0,
        featured: document.getElementById("p-featured").checked
      };

      const res = await window.abidSupabase.addProduct(product);
      if (res.success) {
        showToast(`<strong>${product.title}</strong> has been added to the store!`, "fa-check");
        addModal.classList.remove("active");
        addForm.reset();
        loadAdminProducts();
      }
    });
  }
}

// 1-Click SQL Modal
function openSqlModal() {
  let modal = document.getElementById("sql-code-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "sql-code-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content-box" style="max-width:750px;">
        <button class="modal-close-btn" onclick="document.getElementById('sql-code-modal').classList.remove('active')">&times;</button>
        <span style="font-size:0.8rem; letter-spacing:2px; text-transform:uppercase; color:var(--gold-primary);">Supabase Database Setup</span>
        <h2 style="margin:8px 0 16px;">Initialize Your Supabase Tables</h2>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:16px;">
          Go to <a href="https://supabase.com/dashboard/project/btuhffpkirhviftczgeu/sql" target="_blank" style="color:var(--gold-light); text-decoration:underline;">Supabase SQL Editor</a>, paste the SQL below and click <strong>Run</strong>:
        </p>
        <textarea id="sql-schema-textarea" readonly style="width:100%; height:250px; background:#0B0D13; color:#A0AEC0; font-family:monospace; font-size:0.8rem; padding:12px; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); margin-bottom:16px;"></textarea>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button class="btn btn-primary" onclick="copySqlSchema()"><i class="fas fa-copy"></i> Copy SQL to Clipboard</button>
          <a href="https://supabase.com/dashboard/project/btuhffpkirhviftczgeu/sql" target="_blank" class="btn btn-outline">
            Open Supabase SQL Editor <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Fetch or populate schema text
  const sqlText = `-- Create products, orders, custom_watches and inquiries tables:
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
    payment_method TEXT DEFAULT 'Credit Card',
    order_status TEXT DEFAULT 'Confirmed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_watches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert custom_watches" ON public.custom_watches FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read custom_watches" ON public.custom_watches FOR SELECT USING (true);
`;

  document.getElementById("sql-schema-textarea").value = sqlText;
  modal.classList.add("active");
}

function copySqlSchema() {
  const textarea = document.getElementById("sql-schema-textarea");
  textarea.select();
  navigator.clipboard.writeText(textarea.value);
  showToast("SQL Schema copied to clipboard!", "fa-copy");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("admin-products-tbody")) {
    initAdminDashboard();
  }
});
