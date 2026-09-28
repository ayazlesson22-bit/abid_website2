/**
 * Abid Store - Haute Horlogerie
 * Global Application Core, Cart Management, Currency Conversion & Notifications
 */

const CURRENCY_RATES = {
  USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
  AED: { symbol: "AED ", rate: 3.67, label: "AED (د.إ)" }
};

let currentCurrency = localStorage.getItem("abid_currency") || "USD";

// Format Price according to selected currency
function formatPrice(amountInUSD) {
  const curr = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.USD;
  const converted = amountInUSD * curr.rate;
  return curr.symbol + converted.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Toast Notification
function showToast(message, icon = "fa-check-circle") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <div>${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.4s ease";
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Cart System
const CartService = {
  getCart() {
    return JSON.parse(localStorage.getItem("abid_cart") || "[]");
  },

  saveCart(cart) {
    localStorage.setItem("abid_cart", JSON.stringify(cart));
    this.updateCounters();
    this.renderDrawer();
  },

  addItem(product, quantity = 1, options = {}) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id && JSON.stringify(item.options || {}) === JSON.stringify(options));

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity,
        options: options
      });
    }

    this.saveCart(cart);
    showToast(`Added <strong>${product.title}</strong> to your shopping bag.`);
  },

  updateQuantity(index, newQty) {
    const cart = this.getCart();
    if (newQty <= 0) {
      cart.splice(index, 1);
      showToast("Item removed from your bag.", "fa-trash-alt");
    } else {
      cart[index].quantity = newQty;
    }
    this.saveCart(cart);
  },

  removeItem(index) {
    this.updateQuantity(index, 0);
  },

  clearCart() {
    this.saveCart([]);
  },

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  updateCounters() {
    const cart = this.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counterEls = document.querySelectorAll(".cart-counter");
    counterEls.forEach(el => {
      el.textContent = totalCount;
    });
  },

  renderDrawer() {
    const drawerBody = document.getElementById("cart-drawer-items");
    const subtotalEl = document.getElementById("cart-drawer-subtotal");
    if (!drawerBody || !subtotalEl) return;

    const cart = this.getCart();
    if (cart.length === 0) {
      drawerBody.innerHTML = `
        <div class="empty-cart-msg">
          <i class="fas fa-shopping-bag"></i>
          <h4>Your Bag is Empty</h4>
          <p>Discover our prestigious watch collections.</p>
        </div>
      `;
      subtotalEl.textContent = formatPrice(0);
      return;
    }

    drawerBody.innerHTML = cart.map((item, idx) => `
      <div class="cart-item-row">
        <img src="${item.image_url}" alt="${item.title}" class="cart-item-thumb">
        <div class="cart-item-details">
          <div class="cart-item-brand">${item.brand}</div>
          <div class="cart-item-title">${item.title}</div>
          ${item.options && item.options.isCustom ? `<span style="font-size:0.7rem; color:var(--gold-primary);">★ Bespoke Custom Build</span>` : ''}
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-ctrls">
          <div class="qty-pill">
            <button class="qty-btn" onclick="CartService.updateQuantity(${idx}, ${item.quantity - 1})">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="CartService.updateQuantity(${idx}, ${item.quantity + 1})">+</button>
          </div>
          <button style="font-size:0.75rem; color:#EF4444;" onclick="CartService.removeItem(${idx})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join("");

    subtotalEl.textContent = formatPrice(this.getSubtotal());
  }
};

// UI Drawer Controls
function initCartDrawer() {
  const openBtns = document.querySelectorAll(".cart-open-trigger");
  const closeBtn = document.getElementById("cart-drawer-close");
  const backdrop = document.getElementById("cart-drawer-backdrop");
  const drawer = document.getElementById("cart-drawer");

  if (!drawer) return;

  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      drawer.classList.add("active");
      if (backdrop) backdrop.classList.add("active");
      CartService.renderDrawer();
    });
  });

  const closeDrawer = () => {
    drawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
  };

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);
}

// Quick View Modal
async function openQuickView(productId) {
  let modal = document.getElementById("quick-view-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quick-view-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content-box" id="quick-view-box">
        <button class="modal-close-btn" onclick="closeQuickView()">&times;</button>
        <div id="quick-view-content">Loading watch details...</div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeQuickView();
    });
  }

  const contentBox = document.getElementById("quick-view-content");
  modal.classList.add("active");
  contentBox.innerHTML = `<div style="text-align:center; padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--gold-primary);"></i><p style="margin-top:12px;">Fetching timepiece details...</p></div>`;

  const product = await window.abidSupabase.getProductById(productId);
  if (!product) {
    contentBox.innerHTML = `<p>Timepiece details could not be found.</p>`;
    return;
  }

  contentBox.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:center;">
      <div style="border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--border-gold); max-height:380px;">
        <img src="${product.image_url}" alt="${product.title}" style="width:100%; height:380px; object-fit:cover;">
      </div>
      <div>
        <div class="detail-brand-badge">${product.brand}</div>
        <h2 style="font-size:1.8rem; margin-bottom:10px;">${product.title}</h2>
        <div style="color:var(--text-gold); font-size:1.6rem; font-weight:700; margin-bottom:16px;">
          ${formatPrice(product.price)}
          ${product.original_price ? `<span style="font-size:0.95rem; color:var(--text-muted); text-decoration:line-through; margin-left:8px;">${formatPrice(product.original_price)}</span>` : ''}
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin-bottom:20px;">
          ${product.description || 'Precision crafted luxury timepiece with certified authenticity.'}
        </p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.8rem; margin-bottom:24px; color:#C0C4CC;">
          <div><strong style="color:var(--text-muted);">Movement:</strong> ${product.movement || 'Automatic'}</div>
          <div><strong style="color:var(--text-muted);">Diameter:</strong> ${product.case_diameter || '41mm'}</div>
          <div><strong style="color:var(--text-muted);">Material:</strong> ${product.case_material || 'Steel'}</div>
          <div><strong style="color:var(--text-muted);">Water Resist:</strong> ${product.water_resistance || '100m'}</div>
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn btn-primary" onclick="CartService.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')}); closeQuickView();">
            <i class="fas fa-shopping-bag"></i> Add to Bag
          </button>
          <a href="product-details.html?id=${product.id}" class="btn btn-outline">
            Full Specs <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

function closeQuickView() {
  const modal = document.getElementById("quick-view-modal");
  if (modal) modal.classList.remove("active");
}

// Supabase Status Pill Check
async function updateSupabasePill() {
  const pill = document.getElementById("supabase-pill");
  if (!pill) return;

  const res = await window.abidSupabase.checkConnection();
  if (res.connected && res.tablesReady) {
    pill.className = "supabase-pill";
    pill.innerHTML = `<span class="dot"></span> Supabase Connected`;
    pill.title = "Connected to Supabase live database!";
  } else if (res.connected) {
    pill.className = "supabase-pill pending";
    pill.innerHTML = `<span class="dot"></span> Supabase Live (Tables Pending)`;
    pill.title = "Connected to Supabase project. Ready to run schema.sql!";
  } else {
    pill.className = "supabase-pill pending";
    pill.innerHTML = `<span class="dot"></span> Local Sync Active`;
    pill.title = "Using resilient local luxury watch storage";
  }
}

// Global Currency Selector Initialization
function initCurrencySelector() {
  const selects = document.querySelectorAll(".currency-select");
  selects.forEach(select => {
    select.value = currentCurrency;
    select.addEventListener("change", (e) => {
      currentCurrency = e.target.value;
      localStorage.setItem("abid_currency", currentCurrency);
      location.reload();
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("mobile-open");
      if (nav.classList.contains("mobile-open")) {
        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.position = "absolute";
        nav.style.top = "84px";
        nav.style.left = "0";
        nav.style.right = "0";
        nav.style.background = "#0F121A";
        nav.style.padding = "24px";
        nav.style.borderBottom = "1px solid var(--border-subtle)";
      } else {
        nav.style.display = "";
      }
    });
  }
}

// Newsletter Subscription Handler
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector("input[type='email']");
      if (emailInput && emailInput.value) {
        await window.abidSupabase.subscribeNewsletter(emailInput.value);
        showToast("Thank you for joining the Abid Store VIP Club!", "fa-crown");
        emailInput.value = "";
      }
    });
  }
}

// Document Ready
document.addEventListener("DOMContentLoaded", () => {
  CartService.updateCounters();
  initCartDrawer();
  initCurrencySelector();
  initMobileMenu();
  initNewsletter();
  updateSupabasePill();
});
