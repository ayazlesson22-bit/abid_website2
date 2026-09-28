/**
 * Abid Store - Watch Catalog & Multi-Faceted Filter Engine
 */

let allWatches = [];
let activeFilters = {
  brands: [],
  categories: [],
  movements: [],
  maxPrice: 100000,
  sortBy: "featured",
  search: "",
  viewMode: "grid"
};

// Render Single Watch Card
function createWatchCardHTML(watch) {
  return `
    <div class="watch-card" data-id="${watch.id}">
      <span class="watch-badge-tag">${watch.category || 'Luxury'}</span>
      <div class="watch-img-box">
        <img src="${watch.image_url}" alt="${watch.title}" loading="lazy">
        <div class="watch-overlay-actions">
          <button class="card-action-btn" onclick="openQuickView('${watch.id}')">
            <i class="fas fa-eye"></i> Quick View
          </button>
          <a href="product-details.html?id=${watch.id}" class="card-action-btn">
            <i class="fas fa-info-circle"></i> Details
          </a>
        </div>
      </div>
      <div class="watch-card-body">
        <span class="watch-card-brand">${watch.brand}</span>
        <h3 class="watch-card-title">${watch.title}</h3>
        <div class="watch-card-specs">
          <span><i class="fas fa-cog"></i> ${watch.movement ? watch.movement.split(' ')[0] : 'Auto'}</span>
          <span><i class="fas fa-arrows-alt-h"></i> ${watch.case_diameter || '41mm'}</span>
          <span><i class="fas fa-tint"></i> ${watch.water_resistance ? watch.water_resistance.split(' ')[0] : '100m'}</span>
        </div>
        <div class="watch-card-footer">
          <div class="watch-price-box">
            <span class="current-price">${formatPrice(watch.price)}</span>
            ${watch.original_price ? `<span class="original-price">${formatPrice(watch.original_price)}</span>` : ''}
          </div>
          <button class="add-cart-btn-icon" title="Add to Bag" onclick="CartService.addItem(${JSON.stringify(watch).replace(/"/g, '&quot;')})">
            <i class="fas fa-shopping-bag"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Filter and Render
function filterAndRenderCatalog() {
  const container = document.getElementById("catalog-grid");
  const countEl = document.getElementById("catalog-count");
  if (!container) return;

  let filtered = [...allWatches];

  // Brand filter
  if (activeFilters.brands.length > 0) {
    filtered = filtered.filter(w => activeFilters.brands.includes(w.brand));
  }

  // Category filter
  if (activeFilters.categories.length > 0) {
    filtered = filtered.filter(w => activeFilters.categories.includes(w.category));
  }

  // Movement filter
  if (activeFilters.movements.length > 0) {
    filtered = filtered.filter(w => activeFilters.movements.some(m => (w.movement || '').toLowerCase().includes(m.toLowerCase())));
  }

  // Price filter
  filtered = filtered.filter(w => w.price <= activeFilters.maxPrice);

  // Search filter
  if (activeFilters.search) {
    const q = activeFilters.search.toLowerCase();
    filtered = filtered.filter(w => 
      w.title.toLowerCase().includes(q) ||
      w.brand.toLowerCase().includes(q) ||
      (w.model && w.model.toLowerCase().includes(q)) ||
      (w.description && w.description.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (activeFilters.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeFilters.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (activeFilters.sortBy === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // Featured first
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  // Update Count
  if (countEl) {
    countEl.innerHTML = `Showing <strong>${filtered.length}</strong> timepieces`;
  }

  // Render
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px;">
        <i class="fas fa-search" style="font-size:3rem; color:var(--gold-dark); margin-bottom:16px;"></i>
        <h3>No Timepieces Match Your Criteria</h3>
        <p style="color:var(--text-muted); margin: 8px 0 20px;">Try adjusting your filters or search terms.</p>
        <button class="btn btn-outline" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(createWatchCardHTML).join("");
}

// Reset filters
function resetAllFilters() {
  activeFilters.brands = [];
  activeFilters.categories = [];
  activeFilters.movements = [];
  activeFilters.maxPrice = 100000;
  activeFilters.search = "";
  activeFilters.sortBy = "featured";

  // Uncheck inputs
  document.querySelectorAll(".filters-sidebar input[type='checkbox']").forEach(cb => cb.checked = false);
  const slider = document.getElementById("price-slider");
  if (slider) {
    slider.value = 100000;
    const label = document.getElementById("price-slider-val");
    if (label) label.textContent = formatPrice(100000);
  }
  const searchInput = document.getElementById("catalog-search-input");
  if (searchInput) searchInput.value = "";
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.value = "featured";

  filterAndRenderCatalog();
}

// Initialize Catalog Page
async function initCatalogPage() {
  const container = document.getElementById("catalog-grid");
  if (!container) return;

  container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 60px;"><i class="fas fa-spinner fa-spin" style="font-size:2.5rem; color:var(--gold-primary);"></i><p style="margin-top:16px;">Connecting to Supabase watch vault...</p></div>`;

  allWatches = await window.abidSupabase.getProducts();

  // Check URL query parameters (e.g. ?brand=Rolex or ?search=Chronograph)
  const urlParams = new URLSearchParams(window.location.search);
  const brandParam = urlParams.get("brand");
  const searchParam = urlParams.get("search");
  const categoryParam = urlParams.get("category");

  if (brandParam) {
    activeFilters.brands.push(brandParam);
    const cb = document.querySelector(`input[data-brand="${brandParam}"]`);
    if (cb) cb.checked = true;
  }
  if (categoryParam) {
    activeFilters.categories.push(categoryParam);
    const cb = document.querySelector(`input[data-category="${categoryParam}"]`);
    if (cb) cb.checked = true;
  }
  if (searchParam) {
    activeFilters.search = searchParam;
    const input = document.getElementById("catalog-search-input");
    if (input) input.value = searchParam;
  }

  // Setup Event Listeners
  document.querySelectorAll("input[data-filter-type='brand']").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const brand = e.target.dataset.brand;
      if (e.target.checked) {
        activeFilters.brands.push(brand);
      } else {
        activeFilters.brands = activeFilters.brands.filter(b => b !== brand);
      }
      filterAndRenderCatalog();
    });
  });

  document.querySelectorAll("input[data-filter-type='category']").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const cat = e.target.dataset.category;
      if (e.target.checked) {
        activeFilters.categories.push(cat);
      } else {
        activeFilters.categories = activeFilters.categories.filter(c => c !== cat);
      }
      filterAndRenderCatalog();
    });
  });

  document.querySelectorAll("input[data-filter-type='movement']").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const mov = e.target.dataset.movement;
      if (e.target.checked) {
        activeFilters.movements.push(mov);
      } else {
        activeFilters.movements = activeFilters.movements.filter(m => m !== mov);
      }
      filterAndRenderCatalog();
    });
  });

  const priceSlider = document.getElementById("price-slider");
  const priceLabel = document.getElementById("price-slider-val");
  if (priceSlider && priceLabel) {
    priceSlider.addEventListener("input", (e) => {
      activeFilters.maxPrice = Number(e.target.value);
      priceLabel.textContent = formatPrice(activeFilters.maxPrice);
      filterAndRenderCatalog();
    });
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      activeFilters.sortBy = e.target.value;
      filterAndRenderCatalog();
    });
  }

  const searchInput = document.getElementById("catalog-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeFilters.search = e.target.value;
      filterAndRenderCatalog();
    });
  }

  // View Mode Buttons (Grid / List)
  const gridBtn = document.getElementById("view-grid-btn");
  const listBtn = document.getElementById("view-list-btn");
  if (gridBtn && listBtn) {
    gridBtn.addEventListener("click", () => {
      gridBtn.classList.add("active");
      listBtn.classList.remove("active");
      container.classList.remove("list-view");
    });
    listBtn.addEventListener("click", () => {
      listBtn.classList.add("active");
      gridBtn.classList.remove("active");
      container.classList.add("list-view");
    });
  }

  filterAndRenderCatalog();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("catalog-grid")) {
    initCatalogPage();
  }
});
