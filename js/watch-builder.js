/**
 * Abid Store - Interactive Bespoke Watch Builder & SVG Visualizer Engine
 */

const BUILDER_PRICES = {
  base: 4500,
  cases: {
    steel: { name: "Oystersteel 904L", price: 0, stroke: "#CBD2DC", fill: "#3E4552" },
    gold: { name: "18K Yellow Gold", price: 6200, stroke: "#F7DE88", fill: "#A67C1E" },
    everose: { name: "18K Everose Gold", price: 6800, stroke: "#ECC1B4", fill: "#B57B6B" },
    titanium: { name: "Grade 5 Titanium", price: 2100, stroke: "#8A94A0", fill: "#4B535E" },
    carbon: { name: "DLC Midnight Carbon", price: 2800, stroke: "#2B2D35", fill: "#131418" }
  },
  dials: {
    blue: { name: "Royal Blue Sunburst", price: 400, bg: "url(#blueGrad)", text: "Navy Sunburst" },
    emerald: { name: "Emerald Forest Lacquer", price: 600, bg: "url(#emeraldGrad)", text: "Emerald Lacquer" },
    obsidian: { name: "Midnight Obsidian Black", price: 0, bg: "#08090C", text: "Obsidian" },
    champagne: { name: "Champagne Gold Sunray", price: 500, bg: "url(#goldDialGrad)", text: "Champagne" },
    silver: { name: "Silver Rhodium Opaline", price: 300, bg: "url(#silverDialGrad)", text: "Silver Opaline" },
    skeleton: { name: "Exhibition Skeleton Openwork", price: 1800, bg: "url(#skeletonPattern)", text: "Skeleton" }
  },
  bezels: {
    fluted: { name: "Classic Fluted Bezel", price: 800, type: "fluted" },
    diver: { name: "Ceramic Diver 60-Min Scale", price: 950, type: "diver" },
    smooth: { name: "High-Polish Smooth Bezel", price: 0, type: "smooth" },
    diamond: { name: "Baguette Diamond Halo", price: 4500, type: "diamond" }
  },
  straps: {
    oyster: { name: "Solid 3-Link Oyster Bracelet", price: 0, color: "#8E97A4" },
    jubilee: { name: "5-Link Jubilee Bracelet", price: 750, color: "#B8BFC9" },
    alligator: { name: "Hand-stitched Alligator Leather", price: 550, color: "#241812" },
    rubber: { name: "Oysterflex Vulcanized Rubber", price: 400, color: "#17181C" }
  },
  movements: {
    automatic: { name: "Calibre 3235 Self-Winding (70h reserve)", price: 0 },
    chrono: { name: "Calibre 4130 Column-Wheel Chronograph", price: 2400 },
    tourbillon: { name: "Haute Horlogerie Flying Tourbillon", price: 12500 }
  }
};

let currentConfig = {
  caseType: "steel",
  dialColor: "blue",
  bezelType: "fluted",
  strapType: "oyster",
  movement: "automatic",
  engraving: "ABID VIP 2026",
  view: "front" // front or back
};

// Compute Total Price
function calculateBuilderPrice() {
  let total = BUILDER_PRICES.base;
  total += BUILDER_PRICES.cases[currentConfig.caseType].price;
  total += BUILDER_PRICES.dials[currentConfig.dialColor].price;
  total += BUILDER_PRICES.bezels[currentConfig.bezelType].price;
  total += BUILDER_PRICES.straps[currentConfig.strapType].price;
  total += BUILDER_PRICES.movements[currentConfig.movement].price;
  if (currentConfig.engraving.trim().length > 0) total += 150; // Custom engraving fee
  return total;
}

// Generate the SVG Watch Visualizer
function renderLiveWatchSVG() {
  const container = document.getElementById("watch-svg-viewport");
  if (!container) return;

  const caseObj = BUILDER_PRICES.cases[currentConfig.caseType];
  const dialObj = BUILDER_PRICES.dials[currentConfig.dialColor];
  const bezelObj = BUILDER_PRICES.bezels[currentConfig.bezelType];
  const strapObj = BUILDER_PRICES.straps[currentConfig.strapType];

  let svgContent = "";

  if (currentConfig.view === "front") {
    svgContent = `
      <svg class="live-watch-svg" viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Gradients -->
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1B385C" />
            <stop offset="50%" stop-color="#0E213D" />
            <stop offset="100%" stop-color="#050C17" />
          </linearGradient>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18523A" />
            <stop offset="50%" stop-color="#0D3523" />
            <stop offset="100%" stop-color="#04140D" />
          </linearGradient>
          <linearGradient id="goldDialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F2DE9B" />
            <stop offset="60%" stop-color="#C29F4D" />
            <stop offset="100%" stop-color="#73581E" />
          </linearGradient>
          <linearGradient id="silverDialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="50%" stop-color="#D6DAE0" />
            <stop offset="100%" stop-color="#8F96A0" />
          </linearGradient>
          <pattern id="skeletonPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#141720"/>
            <circle cx="20" cy="20" r="14" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.6"/>
            <polygon points="20,10 28,26 12,26" fill="none" stroke="#A0A8B4" stroke-width="1.2"/>
            <circle cx="20" cy="20" r="4" fill="#D4AF37"/>
          </pattern>
          <filter id="glassReflect" x="0" y="0" width="100%" height="100%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
          </filter>
        </defs>

        <!-- Upper Strap -->
        <g id="upper-strap">
          <path d="M140 10 L140 140 L260 140 L260 10 Z" fill="${strapObj.color}" stroke="${caseObj.stroke}" stroke-width="1.5"/>
          ${currentConfig.strapType === 'jubilee' ? `
            <line x1="165" y1="10" x2="165" y2="140" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
            <line x1="188" y1="10" x2="188" y2="140" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
            <line x1="212" y1="10" x2="212" y2="140" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
            <line x1="235" y1="10" x2="235" y2="140" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
          ` : ''}
          ${currentConfig.strapType === 'alligator' ? `
            <path d="M142 40 Q200 45 258 40 M142 80 Q200 85 258 80 M142 120 Q200 125 258 120" stroke="#120B08" stroke-width="2" fill="none" opacity="0.6"/>
          ` : ''}
        </g>

        <!-- Lower Strap -->
        <g id="lower-strap">
          <path d="M140 340 L140 470 L260 470 L260 340 Z" fill="${strapObj.color}" stroke="${caseObj.stroke}" stroke-width="1.5"/>
          ${currentConfig.strapType === 'jubilee' ? `
            <line x1="165" y1="340" x2="165" y2="470" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
            <line x1="188" y1="340" x2="188" y2="470" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
            <line x1="212" y1="340" x2="212" y2="470" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
            <line x1="235" y1="340" x2="235" y2="470" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
          ` : ''}
          ${currentConfig.strapType === 'alligator' ? `
            <path d="M142 360 Q200 365 258 360 M142 400 Q200 405 258 400 M142 440 Q200 445 258 440" stroke="#120B08" stroke-width="2" fill="none" opacity="0.6"/>
          ` : ''}
        </g>

        <!-- Watch Case Lugs -->
        <path d="M136 120 L110 200 L110 280 L136 360 L264 360 L290 280 L290 200 L264 120 Z" fill="${caseObj.fill}" stroke="${caseObj.stroke}" stroke-width="3"/>

        <!-- Crown at 3 O'Clock -->
        <rect x="306" y="226" width="16" height="28" rx="3" fill="${caseObj.stroke}" stroke="#1B1E24" stroke-width="1.5"/>
        <line x1="310" y1="228" x2="310" y2="252" stroke="#1B1E24" stroke-width="1.5"/>
        <line x1="314" y1="228" x2="314" y2="252" stroke="#1B1E24" stroke-width="1.5"/>
        <line x1="318" y1="228" x2="318" y2="252" stroke="#1B1E24" stroke-width="1.5"/>

        <!-- Outer Case Ring -->
        <circle cx="200" cy="240" r="110" fill="${caseObj.fill}" stroke="${caseObj.stroke}" stroke-width="4"/>

        <!-- Bezel Specific Rendering -->
        ${bezelObj.type === 'fluted' ? `
          <circle cx="200" cy="240" r="102" fill="none" stroke="${caseObj.stroke}" stroke-width="8" stroke-dasharray="2 3"/>
        ` : ''}
        ${bezelObj.type === 'diver' ? `
          <circle cx="200" cy="240" r="102" fill="#0C0F17" stroke="${caseObj.stroke}" stroke-width="12"/>
          <circle cx="200" cy="240" r="102" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="1 10" opacity="0.8"/>
          <text x="200" y="146" font-size="9" font-family="sans-serif" font-weight="bold" fill="#F4F5F7" text-anchor="middle">▼</text>
          <text x="286" y="244" font-size="9" font-family="sans-serif" font-weight="bold" fill="#F4F5F7" text-anchor="middle">15</text>
          <text x="200" y="338" font-size="9" font-family="sans-serif" font-weight="bold" fill="#F4F5F7" text-anchor="middle">30</text>
          <text x="114" y="244" font-size="9" font-family="sans-serif" font-weight="bold" fill="#F4F5F7" text-anchor="middle">45</text>
        ` : ''}
        ${bezelObj.type === 'diamond' ? `
          <circle cx="200" cy="240" r="103" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-dasharray="3 5"/>
        ` : ''}
        ${bezelObj.type === 'smooth' ? `
          <circle cx="200" cy="240" r="102" fill="none" stroke="${caseObj.stroke}" stroke-width="6"/>
        ` : ''}

        <!-- Dial Face -->
        <circle cx="200" cy="240" r="92" fill="${dialObj.bg}" stroke="${caseObj.stroke}" stroke-width="1"/>

        <!-- Minute Chapter Ring -->
        <circle cx="200" cy="240" r="86" fill="none" stroke="${caseObj.stroke}" stroke-width="0.8" stroke-dasharray="1 4" opacity="0.6"/>

        <!-- Hour Markers (12, 3, 6, 9) -->
        <rect x="198" y="158" width="4" height="12" fill="${caseObj.stroke}" rx="1"/>
        <rect x="270" y="238" width="12" height="4" fill="${caseObj.stroke}" rx="1"/>
        <rect x="198" y="310" width="4" height="12" fill="${caseObj.stroke}" rx="1"/>
        <rect x="118" y="238" width="12" height="4" fill="${caseObj.stroke}" rx="1"/>

        <!-- Dial Brand Logo -->
        <text x="200" y="196" font-family="'Cinzel', serif" font-size="10" font-weight="700" letter-spacing="2" fill="${caseObj.stroke}" text-anchor="middle">ABID STORE</text>
        <text x="200" y="206" font-family="'Montserrat', sans-serif" font-size="5" letter-spacing="1.5" fill="#A8ADB9" text-anchor="middle">BESPOKE GENÈVE</text>

        <!-- Movement Label on Dial -->
        <text x="200" y="280" font-family="'Montserrat', sans-serif" font-size="5.5" letter-spacing="1" fill="#C5CBD3" text-anchor="middle">
          ${currentConfig.movement === 'tourbillon' ? 'FLYING TOURBILLON' : (currentConfig.movement === 'chrono' ? 'CHRONOGRAPH' : 'SUPERLATIVE CHRONOMETER')}
        </text>

        <!-- Watch Hands (Time 10:10) -->
        <!-- Hour Hand -->
        <line x1="200" y1="240" x2="160" y2="190" stroke="${caseObj.stroke}" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="200" y1="240" x2="160" y2="190" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Minute Hand -->
        <line x1="200" y1="240" x2="255" y2="175" stroke="${caseObj.stroke}" stroke-width="3" stroke-linecap="round"/>
        <line x1="200" y1="240" x2="255" y2="175" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round"/>

        <!-- Seconds Hand -->
        <line x1="185" y1="260" x2="200" y2="240" stroke="#D4AF37" stroke-width="1.2"/>
        <line x1="200" y1="240" x2="240" y2="300" stroke="#D4AF37" stroke-width="1.2" stroke-linecap="round"/>

        <!-- Center Pin -->
        <circle cx="200" cy="240" r="5" fill="#0D0F14" stroke="${caseObj.stroke}" stroke-width="2"/>
        <circle cx="200" cy="240" r="2" fill="#D4AF37"/>

        <!-- Curved Sapphire Glass Reflection Arc -->
        <path d="M125 190 A 90 90 0 0 1 275 190" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.25"/>
      </svg>
    `;
  } else {
    // Exhibition Caseback with Custom Laser Engraving View
    svgContent = `
      <svg class="live-watch-svg" viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg">
        <path d="M136 120 L110 200 L110 280 L136 360 L264 360 L290 280 L290 200 L264 120 Z" fill="${caseObj.fill}" stroke="${caseObj.stroke}" stroke-width="3"/>
        <circle cx="200" cy="240" r="110" fill="${caseObj.fill}" stroke="${caseObj.stroke}" stroke-width="4"/>
        
        <!-- Caseback Ring with Screws -->
        <circle cx="200" cy="240" r="100" fill="#161820" stroke="${caseObj.stroke}" stroke-width="4"/>
        <circle cx="200" cy="146" r="3" fill="${caseObj.stroke}"/>
        <circle cx="294" cy="240" r="3" fill="${caseObj.stroke}"/>
        <circle cx="200" cy="334" r="3" fill="${caseObj.stroke}"/>
        <circle cx="106" cy="240" r="3" fill="${caseObj.stroke}"/>

        <!-- Exhibition Sapphire Glass -->
        <circle cx="200" cy="240" r="82" fill="#0A0B10" stroke="${caseObj.stroke}" stroke-width="1.5"/>

        <!-- Mechanical Movement Rotor -->
        <path d="M140 240 A 60 60 0 0 1 260 240 Z" fill="url(#goldGrad)" opacity="0.85"/>
        <circle cx="200" cy="240" r="18" fill="#1C1F28" stroke="#D4AF37" stroke-width="2"/>
        <circle cx="200" cy="240" r="6" fill="#D4AF37"/>

        <!-- Laser Engraved Inscription on Caseback -->
        <text x="200" y="175" font-family="'Cinzel', serif" font-size="9" font-weight="700" letter-spacing="2" fill="${caseObj.stroke}" text-anchor="middle">
          ABID STORE HAUTE HORLOGERIE
        </text>
        <text x="200" y="305" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700" letter-spacing="3" fill="#F8E5A7" text-anchor="middle">
          "${currentConfig.engraving || 'BESPOKE EDITION'}"
        </text>
        <text x="200" y="322" font-family="'Montserrat', sans-serif" font-size="7" letter-spacing="1.5" fill="#8E97A4" text-anchor="middle">
          SWISS CALIBRE • 100M WATER RESISTANT
        </text>
      </svg>
    `;
  }

  container.innerHTML = svgContent;

  // Update Price Display
  const priceDisplay = document.getElementById("stage-price-amount");
  if (priceDisplay) {
    priceDisplay.textContent = formatPrice(calculateBuilderPrice());
  }

  // Update Summary Spec List
  updateSummaryList();
}

function updateSummaryList() {
  const summaryBox = document.getElementById("builder-summary-details");
  if (!summaryBox) return;

  summaryBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
      <span style="color:var(--text-muted);">Case Material:</span>
      <strong>${BUILDER_PRICES.cases[currentConfig.caseType].name}</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
      <span style="color:var(--text-muted);">Dial Face:</span>
      <strong>${BUILDER_PRICES.dials[currentConfig.dialColor].name}</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
      <span style="color:var(--text-muted);">Bezel:</span>
      <strong>${BUILDER_PRICES.bezels[currentConfig.bezelType].name}</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
      <span style="color:var(--text-muted);">Strap / Bracelet:</span>
      <strong>${BUILDER_PRICES.straps[currentConfig.strapType].name}</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
      <span style="color:var(--text-muted);">Movement:</span>
      <strong>${BUILDER_PRICES.movements[currentConfig.movement].name}</strong>
    </div>
    ${currentConfig.engraving ? `
    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
      <span style="color:var(--text-muted);">Laser Engraving:</span>
      <strong style="color:var(--gold-light);">${currentConfig.engraving}</strong>
    </div>` : ''}
  `;
}

// Add Custom Watch to Cart
function addCustomWatchToCart() {
  const totalPrice = calculateBuilderPrice();
  const customProduct = {
    id: "bespoke-" + Date.now(),
    title: `Abid Bespoke ${BUILDER_PRICES.cases[currentConfig.caseType].name}`,
    brand: "Abid Bespoke",
    price: totalPrice,
    image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
    isCustom: true
  };

  const customOptions = {
    isCustom: true,
    case: BUILDER_PRICES.cases[currentConfig.caseType].name,
    dial: BUILDER_PRICES.dials[currentConfig.dialColor].name,
    bezel: BUILDER_PRICES.bezels[currentConfig.bezelType].name,
    strap: BUILDER_PRICES.straps[currentConfig.strapType].name,
    movement: BUILDER_PRICES.movements[currentConfig.movement].name,
    engraving: currentConfig.engraving
  };

  CartService.addItem(customProduct, 1, customOptions);
}

// Save Custom Configuration to Supabase
async function saveBespokeConfig() {
  const customerName = prompt("Enter your name to save your bespoke build:", "Abid VIP Client") || "Bespoke Guest";
  const customerEmail = prompt("Enter your email for your certificate of configuration:", "client@example.com") || "client@example.com";

  const payload = {
    customerName,
    customerEmail,
    caseType: BUILDER_PRICES.cases[currentConfig.caseType].name,
    dialColor: BUILDER_PRICES.dials[currentConfig.dialColor].name,
    bezelType: BUILDER_PRICES.bezels[currentConfig.bezelType].name,
    strapType: BUILDER_PRICES.straps[currentConfig.strapType].name,
    movement: BUILDER_PRICES.movements[currentConfig.movement].name,
    engraving: currentConfig.engraving,
    price: calculateBuilderPrice(),
    specs: currentConfig
  };

  const result = await window.abidSupabase.saveCustomWatch(payload);
  if (result.success) {
    showToast(`Configuration saved! Ref ID: <strong>${result.configId}</strong>`, "fa-save");
  } else {
    showToast("Configuration saved to local vault.", "fa-check");
  }
}

// Initialize Watch Builder Page
function initWatchBuilder() {
  // Case cards
  document.querySelectorAll("[data-case]").forEach(el => {
    el.addEventListener("click", () => {
      document.querySelectorAll("[data-case]").forEach(c => c.classList.remove("active"));
      el.classList.add("active");
      currentConfig.caseType = el.dataset.case;
      renderLiveWatchSVG();
    });
  });

  // Dial cards
  document.querySelectorAll("[data-dial]").forEach(el => {
    el.addEventListener("click", () => {
      document.querySelectorAll("[data-dial]").forEach(d => d.classList.remove("active"));
      el.classList.add("active");
      currentConfig.dialColor = el.dataset.dial;
      renderLiveWatchSVG();
    });
  });

  // Bezel cards
  document.querySelectorAll("[data-bezel]").forEach(el => {
    el.addEventListener("click", () => {
      document.querySelectorAll("[data-bezel]").forEach(b => b.classList.remove("active"));
      el.classList.add("active");
      currentConfig.bezelType = el.dataset.bezel;
      renderLiveWatchSVG();
    });
  });

  // Strap cards
  document.querySelectorAll("[data-strap]").forEach(el => {
    el.addEventListener("click", () => {
      document.querySelectorAll("[data-strap]").forEach(s => s.classList.remove("active"));
      el.classList.add("active");
      currentConfig.strapType = el.dataset.strap;
      renderLiveWatchSVG();
    });
  });

  // Movement cards
  document.querySelectorAll("[data-movement]").forEach(el => {
    el.addEventListener("click", () => {
      document.querySelectorAll("[data-movement]").forEach(m => m.classList.remove("active"));
      el.classList.add("active");
      currentConfig.movement = el.dataset.movement;
      renderLiveWatchSVG();
    });
  });

  // Engraving Input
  const engInput = document.getElementById("engraving-text-input");
  if (engInput) {
    engInput.addEventListener("input", (e) => {
      currentConfig.engraving = e.target.value.toUpperCase();
      renderLiveWatchSVG();
    });
  }

  // View Toggle (Front / Back)
  const frontBtn = document.getElementById("view-front-btn");
  const backBtn = document.getElementById("view-back-btn");
  if (frontBtn && backBtn) {
    frontBtn.addEventListener("click", () => {
      frontBtn.classList.add("active");
      backBtn.classList.remove("active");
      currentConfig.view = "front";
      renderLiveWatchSVG();
    });
    backBtn.addEventListener("click", () => {
      backBtn.classList.add("active");
      frontBtn.classList.remove("active");
      currentConfig.view = "back";
      renderLiveWatchSVG();
    });
  }

  renderLiveWatchSVG();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("watch-svg-viewport")) {
    initWatchBuilder();
  }
});
