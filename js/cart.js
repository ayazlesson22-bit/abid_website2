/**
 * Abid Store - Cart Page & Supabase Checkout Engine
 */

function renderFullCartPage() {
  const tableBody = document.getElementById("cart-page-table-body");
  const subtotalEl = document.getElementById("cart-page-subtotal");
  const totalEl = document.getElementById("cart-page-total");
  const emptyState = document.getElementById("cart-empty-state");
  const cartContent = document.getElementById("cart-content-wrapper");

  if (!tableBody) return;

  const cart = CartService.getCart();

  if (cart.length === 0) {
    if (cartContent) cartContent.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (cartContent) cartContent.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";

  tableBody.innerHTML = cart.map((item, idx) => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:16px;">
          <img src="${item.image_url}" alt="${item.title}" style="width:72px; height:72px; object-fit:cover; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div>
            <div style="font-size:0.75rem; color:var(--gold-primary); text-transform:uppercase;">${item.brand}</div>
            <strong style="font-size:1rem; font-family:var(--font-serif);">${item.title}</strong>
            ${item.options && item.options.isCustom ? `
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
                Bespoke: ${item.options.case} • ${item.options.dial} • Engraving: "${item.options.engraving || 'N/A'}"
              </div>
            ` : ''}
          </div>
        </div>
      </td>
      <td style="color:var(--gold-light); font-weight:600;">
        ${formatPrice(item.price)}
      </td>
      <td>
        <div class="qty-pill" style="display:inline-flex;">
          <button class="qty-btn" onclick="updateCartPageQty(${idx}, ${item.quantity - 1})">-</button>
          <span class="qty-val" style="padding:0 8px;">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartPageQty(${idx}, ${item.quantity + 1})">+</button>
        </div>
      </td>
      <td style="color:var(--gold-light); font-weight:700;">
        ${formatPrice(item.price * item.quantity)}
      </td>
      <td>
        <button style="color:#EF4444; background:none; font-size:1rem;" onclick="removeCartPageItem(${idx})" title="Remove item">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join("");

  const subtotal = CartService.getSubtotal();
  const tax = subtotal * 0.05; // 5% luxury tax
  const total = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function updateCartPageQty(idx, qty) {
  CartService.updateQuantity(idx, qty);
  renderFullCartPage();
}

function removeCartPageItem(idx) {
  CartService.removeItem(idx);
  renderFullCartPage();
}

// Checkout Modal Handler
function initCheckoutModal() {
  const checkoutBtn = document.getElementById("proceed-checkout-btn");
  const modal = document.getElementById("checkout-modal");
  const closeBtn = document.getElementById("checkout-modal-close");
  const form = document.getElementById("checkout-form");

  if (!checkoutBtn || !modal) return;

  checkoutBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  const closeModal = () => modal.classList.remove("active");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing Secure Payment...`;
      submitBtn.disabled = true;

      const cart = CartService.getCart();
      const subtotal = CartService.getSubtotal();
      const tax = subtotal * 0.05;
      const total = subtotal + tax;

      const orderData = {
        name: document.getElementById("co-name").value,
        email: document.getElementById("co-email").value,
        phone: document.getElementById("co-phone").value,
        address: document.getElementById("co-address").value,
        city: document.getElementById("co-city").value,
        zip: document.getElementById("co-zip").value,
        country: document.getElementById("co-country").value,
        paymentMethod: document.getElementById("co-payment").value,
        notes: document.getElementById("co-notes").value,
        items: cart,
        subtotal: subtotal,
        tax: tax,
        shipping: 0,
        total: total
      };

      try {
        const result = await window.abidSupabase.createOrder(orderData);
        closeModal();
        CartService.clearCart();
        showOrderConfirmation(result.order);
      } catch (err) {
        showToast("Error processing order. Please try again.", "fa-exclamation-triangle");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// Show Luxury Order Confirmation Receipt
function showOrderConfirmation(order) {
  let modal = document.getElementById("order-success-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "order-success-modal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content-box" style="max-width:600px; text-align:center;">
      <div style="width:70px; height:70px; border-radius:50%; background:rgba(212,175,55,0.15); border:2px solid var(--gold-primary); color:var(--gold-primary); display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 20px;">
        <i class="fas fa-check"></i>
      </div>
      <span style="font-size:0.8rem; letter-spacing:3px; text-transform:uppercase; color:var(--gold-primary);">Haute Horlogerie Order Placed</span>
      <h2 style="font-size:2rem; margin:8px 0 12px;">Thank You, ${order.customer_name}</h2>
      <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:24px;">
        Your luxury timepiece acquisition has been registered and sent directly to our Supabase database.
      </p>

      <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:20px; text-align:left; margin-bottom:28px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.85rem;">
          <span style="color:var(--text-muted);">Order Reference:</span>
          <strong style="color:var(--gold-light);">${order.order_number || order.id}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.85rem;">
          <span style="color:var(--text-muted);">Destination:</span>
          <span>${order.shipping_address}, ${order.city || ''}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.85rem;">
          <span style="color:var(--text-muted);">Delivery Method:</span>
          <span>Armored Courier & Armored Vault Transit</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-subtle); padding-top:10px; font-size:1.1rem; font-weight:700;">
          <span>Total Paid:</span>
          <span style="color:var(--gold-light);">${formatPrice(order.total_amount)}</span>
        </div>
      </div>

      <div style="display:flex; justify-content:center; gap:14px;">
        <button class="btn btn-primary" onclick="location.href='index.html'">Return to Store</button>
        <button class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> Print Receipt</button>
      </div>
    </div>
  `;

  modal.classList.add("active");
  renderFullCartPage();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-page-table-body")) {
    renderFullCartPage();
    initCheckoutModal();
  }
});
