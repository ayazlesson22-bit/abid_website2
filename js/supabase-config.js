/**
 * Abid Store - Supabase Client Configuration & Data Service Layer
 * Luxury All-Brand Watch E-Commerce
 */

const SUPABASE_CONFIG = {
  url: "https://btuhffpkirhviftczgeu.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dWhmZnBraXJodmlmdGN6Z2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjU1MzEsImV4cCI6MjEwNjE0MTUzMX0.52dnOQNE4yqTMOFuS3E36bRZHSBDZBMfuuLGXqO2rLk",
  publishableKey: "sb_publishable_XXkwsGlSsssTMT4mT_nFqw_A2_I6vGE"
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.isOnline = false;
    this.hasRemoteTables = false;
    this.initClient();
  }

  initClient() {
    try {
      if (window.supabase && typeof window.supabase.createClient === "function") {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        this.isOnline = true;
      } else {
        console.warn("Supabase library not yet loaded on window, fallback mode active.");
      }
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
    }
  }

  getClient() {
    if (!this.client && window.supabase) {
      this.initClient();
    }
    return this.client;
  }

  // Diagnostic health check
  async checkConnection() {
    if (!this.client) {
      this.initClient();
    }
    if (!this.client) {
      return { connected: false, message: "Supabase JS SDK not loaded" };
    }

    try {
      const { data, error } = await this.client
        .from("products")
        .select("id")
        .limit(1);

      if (error) {
        // Table not found or RLS issue
        return {
          connected: true,
          tablesReady: false,
          error: error.message,
          message: "Connected to Supabase project, but 'products' table needs to be created with schema.sql"
        };
      }

      this.hasRemoteTables = true;
      return {
        connected: true,
        tablesReady: true,
        message: "Live connection established to Supabase database!"
      };
    } catch (err) {
      return {
        connected: false,
        tablesReady: false,
        error: err.message,
        message: "Unable to reach Supabase server"
      };
    }
  }

  // Fetch all products (Supabase or Local Fallback)
  async getProducts() {
    const client = this.getClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("products")
          .select("*")
          .order("price", { ascending: false });

        if (!error && data && data.length > 0) {
          this.hasRemoteTables = true;
          return data;
        }
      } catch (e) {
        console.log("Supabase fetch failed, falling back to local catalog:", e);
      }
    }

    // Fallback: Check localStorage + Initial Catalog
    const localSaved = localStorage.getItem("abid_custom_products");
    let products = window.INITIAL_WATCH_CATALOG || [];
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        products = [...parsed, ...products];
      } catch (e) {}
    }
    return products;
  }

  // Fetch single product by ID
  async getProductById(id) {
    const all = await this.getProducts();
    return all.find(p => String(p.id) === String(id)) || null;
  }

  // Add new product (Admin Builder)
  async addProduct(product) {
    const client = this.getClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("products")
          .insert([product])
          .select();

        if (!error && data) {
          return { success: true, data: data[0], source: "supabase" };
        }
      } catch (e) {
        console.warn("Supabase insert error, saving locally:", e);
      }
    }

    // Fallback save to localStorage
    const saved = JSON.parse(localStorage.getItem("abid_custom_products") || "[]");
    const newProd = { ...product, id: "prod-" + Date.now(), created_at: new Date().toISOString() };
    saved.unshift(newProd);
    localStorage.setItem("abid_custom_products", JSON.stringify(saved));
    return { success: true, data: newProd, source: "local" };
  }

  // Delete product (Admin)
  async deleteProduct(id) {
    const client = this.getClient();
    if (client) {
      try {
        const { error } = await client.from("products").delete().eq("id", id);
        if (!error) return { success: true, source: "supabase" };
      } catch (e) {}
    }

    const saved = JSON.parse(localStorage.getItem("abid_custom_products") || "[]");
    const filtered = saved.filter(p => String(p.id) !== String(id));
    localStorage.setItem("abid_custom_products", JSON.stringify(filtered));
    return { success: true, source: "local" };
  }

  // Create Order from Checkout
  async createOrder(orderData) {
    const client = this.getClient();
    const orderNumber = "ABID-" + Math.floor(100000 + Math.random() * 900000);
    const fullOrder = {
      order_number: orderNumber,
      customer_name: orderData.name,
      customer_email: orderData.email,
      customer_phone: orderData.phone || "",
      shipping_address: orderData.address,
      city: orderData.city || "",
      country: orderData.country || "United States",
      postal_code: orderData.zip || "",
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping_fee: orderData.shipping || 0,
      total_amount: orderData.total,
      payment_method: orderData.paymentMethod || "Credit Card",
      order_status: "Confirmed",
      notes: orderData.notes || "",
      created_at: new Date().toISOString()
    };

    if (client) {
      try {
        const { data, error } = await client
          .from("orders")
          .insert([fullOrder])
          .select();

        if (!error && data) {
          return { success: true, order: data[0], source: "supabase" };
        }
      } catch (e) {
        console.warn("Supabase order insert error, saving locally:", e);
      }
    }

    // Fallback store in localStorage
    const savedOrders = JSON.parse(localStorage.getItem("abid_orders") || "[]");
    fullOrder.id = "ord-" + Date.now();
    savedOrders.unshift(fullOrder);
    localStorage.setItem("abid_orders", JSON.stringify(savedOrders));
    return { success: true, order: fullOrder, source: "local" };
  }

  // Get orders list (Admin)
  async getOrders() {
    const client = this.getClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {}
    }

    return JSON.parse(localStorage.getItem("abid_orders") || "[]");
  }

  // Save Bespoke Custom Watch Build from Watch Builder
  async saveCustomWatch(customData) {
    const client = this.getClient();
    const configId = "CFG-" + Math.floor(100000 + Math.random() * 900000);
    const payload = {
      configuration_id: configId,
      customer_name: customData.customerName || "VIP Guest",
      customer_email: customData.customerEmail || "",
      case_type: customData.caseType,
      dial_color: customData.dialColor,
      bezel_type: customData.bezelType,
      strap_type: customData.strapType,
      movement: customData.movement,
      engraving_text: customData.engraving || "",
      total_price: customData.price,
      specs: customData.specs || {},
      status: "Saved Configuration",
      created_at: new Date().toISOString()
    };

    if (client) {
      try {
        const { data, error } = await client
          .from("custom_watches")
          .insert([payload])
          .select();

        if (!error && data) {
          return { success: true, data: data[0], configId, source: "supabase" };
        }
      } catch (e) {
        console.warn("Supabase custom watch save error:", e);
      }
    }

    const saved = JSON.parse(localStorage.getItem("abid_custom_watches") || "[]");
    payload.id = "cfg-" + Date.now();
    saved.unshift(payload);
    localStorage.setItem("abid_custom_watches", JSON.stringify(saved));
    return { success: true, data: payload, configId, source: "local" };
  }

  // Save Inquiry
  async submitInquiry(inquiry) {
    const client = this.getClient();
    const payload = {
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || "",
      subject: inquiry.subject || "VIP Watch Inquiry",
      message: inquiry.message,
      created_at: new Date().toISOString()
    };

    if (client) {
      try {
        const { data, error } = await client.from("inquiries").insert([payload]).select();
        if (!error) return { success: true, source: "supabase" };
      } catch (e) {}
    }

    const saved = JSON.parse(localStorage.getItem("abid_inquiries") || "[]");
    saved.unshift(payload);
    localStorage.setItem("abid_inquiries", JSON.stringify(saved));
    return { success: true, source: "local" };
  }

  // Subscribe Newsletter
  async subscribeNewsletter(email) {
    const client = this.getClient();
    if (client) {
      try {
        const { error } = await client.from("subscribers").insert([{ email }]);
        if (!error) return { success: true, source: "supabase" };
      } catch (e) {}
    }
    const saved = JSON.parse(localStorage.getItem("abid_subscribers") || "[]");
    if (!saved.includes(email)) saved.push(email);
    localStorage.setItem("abid_subscribers", JSON.stringify(saved));
    return { success: true, source: "local" };
  }
}

// Global instance
window.abidSupabase = new SupabaseService();
