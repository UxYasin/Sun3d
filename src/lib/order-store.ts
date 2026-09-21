import {
  CustomerDesign,
  CustomerOrder,
  PaymentSettings,
  PaymentMethod,
  PaymentStatus,
  ProductionStatus,
  NameplateDesignState,
  BusinessSettings,
  CustomerSummary,
  Template
} from '@/types/nameplate';
import { INITIAL_MOCK_DESIGNS, INITIAL_MOCK_ORDERS } from '@/data/mock-customer-data';
import { MOCK_TEMPLATES } from '@/data/mock-templates';

const STORAGE_KEYS = {
  DESIGNS: 'sun3d_customer_designs',
  ORDERS: 'sun3d_customer_orders',
  PAYMENT_SETTINGS: 'sun3d_payment_settings',
  BUSINESS_SETTINGS: 'sun3d_business_settings',
  ADMIN_TEMPLATES: 'sun3d_admin_templates'
};

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  bkashNumber: '01711-223344',
  bkashAccountType: 'Personal / Send Money',
  bkashInstructions: 'Go to your bKash app → Select Send Money → Enter 01711-223344 → Enter Exact Total Amount → Use Reference: Nameplate → Copy TrxID and submit below.',
  bkashEnabled: true,
  nagadNumber: '01800-786333',
  nagadAccountType: 'Personal / Send Money',
  nagadInstructions: 'Go to your Nagad app → Select Send Money → Enter 01800-786333 → Enter Exact Total Amount → Use Reference: Sun3D → Copy TrxID and submit below.',
  nagadEnabled: true
};

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  businessName: 'Sun3D Nameplates Bangladesh',
  contactPhone: '+880 1800-SUN3D',
  contactEmail: 'orders@sun3d.com.bd',
  defaultCurrency: 'BDT (৳)',
  defaultOrderStatus: 'New',
  workshopAddress: 'Tejgaon Industrial Area, Dhaka-1208, Bangladesh'
};

let syncInitialized = false;

export class OrderStoreService {
  // --- SYNC WITH SUPABASE BACKEND ---
  static async syncWithServer(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // 1. Sync Templates from Supabase
      const tplRes = await fetch('/api/templates').catch(() => null);
      if (tplRes && tplRes.ok) {
        const data = await tplRes.json();
        if (data.success && Array.isArray(data.templates) && data.templates.length > 0) {
          localStorage.setItem(STORAGE_KEYS.ADMIN_TEMPLATES, JSON.stringify(data.templates));
        }
      }

      // 2. Sync Settings from Supabase
      const setRes = await fetch('/api/settings').catch(() => null);
      if (setRes && setRes.ok) {
        const data = await setRes.json();
        if (data.success) {
          if (data.paymentSettings) {
            localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(data.paymentSettings));
          }
          if (data.businessSettings) {
            localStorage.setItem(STORAGE_KEYS.BUSINESS_SETTINGS, JSON.stringify(data.businessSettings));
          }
        }
      }

      // 3. Sync Orders from Supabase
      const ordRes = await fetch('/api/orders').catch(() => null);
      if (ordRes && ordRes.ok) {
        const data = await ordRes.json();
        if (data.success && Array.isArray(data.orders)) {
          // Merge remote orders with existing local-only orders
          const localOrders = this.getOrders();
          const remoteOrderIds = new Set(data.orders.map((o: CustomerOrder) => o.id || o.orderNumber));
          const localOnly = localOrders.filter((o) => !remoteOrderIds.has(o.id) && !remoteOrderIds.has(o.orderNumber));
          const merged = [...data.orders, ...localOnly];
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(merged));
        }
      }

      // 4. Sync Designs from Supabase
      const desRes = await fetch('/api/designs').catch(() => null);
      if (desRes && desRes.ok) {
        const data = await desRes.json();
        if (data.success && Array.isArray(data.designs) && data.designs.length > 0) {
          const localDesigns = this.getDesigns();
          const remoteDesignIds = new Set(data.designs.map((d: CustomerDesign) => d.id));
          const localOnly = localDesigns.filter((d) => !remoteDesignIds.has(d.id));
          const merged = [...data.designs, ...localOnly];
          localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(merged));
        }
      }

      window.dispatchEvent(new CustomEvent('sun3d_store_synced'));
    } catch (err) {
      console.warn('Sync with Supabase skipped or encountered network issue:', err);
    }
  }

  // --- DESIGNS ---
  static getDesigns(): CustomerDesign[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_DESIGNS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DESIGNS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(INITIAL_MOCK_DESIGNS));
        return INITIAL_MOCK_DESIGNS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_MOCK_DESIGNS;
    }
  }

  static getUserDesigns(userId: string): CustomerDesign[] {
    return this.getDesigns().filter((d) => d.userId === userId);
  }

  static getDesignById(id: string): CustomerDesign | undefined {
    return this.getDesigns().find((d) => d.id === id);
  }

  static saveDesign(designInput: Omit<CustomerDesign, 'id' | 'updatedAt'> & { id?: string }): CustomerDesign {
    const designs = this.getDesigns();
    const existingIndex = designInput.id ? designs.findIndex((d) => d.id === designInput.id) : -1;

    const design: CustomerDesign = {
      ...designInput,
      id: designInput.id || `des-${Date.now().toString().slice(-6)}`,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      designs[existingIndex] = design;
    } else {
      designs.unshift(design);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designs));

      // Asynchronously persist to Supabase
      fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(design)
      }).catch((e) => console.warn('Background Supabase saveDesign error:', e));
    }
    return design;
  }

  // --- ORDERS ---
  static getOrders(): CustomerOrder[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_ORDERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_MOCK_ORDERS));
        return INITIAL_MOCK_ORDERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_MOCK_ORDERS;
    }
  }

  static getUserOrders(customerId: string): CustomerOrder[] {
    return this.getOrders().filter((o) => o.customerId === customerId);
  }

  static getOrderById(orderId: string): CustomerOrder | undefined {
    return this.getOrders().find((o) => o.id === orderId || o.orderNumber === orderId);
  }

  static createOrder(params: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    designId?: string;
    finalDesignData: NameplateDesignState;
    price: number;
    paymentMethod?: PaymentMethod;
  }): CustomerOrder {
    const orders = this.getOrders();
    const idNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ord-${idNum}`;
    const orderNumber = `SN-${idNum}`;

    const newOrder: CustomerOrder = {
      id: orderId,
      orderNumber,
      customerId: params.customerId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      designId: params.designId || `des-${idNum}`,
      templateId: params.finalDesignData.templateId,
      size: params.finalDesignData.size,
      houseName: params.finalDesignData.houseName,
      proprietor: params.finalDesignData.proprietor,
      address: params.finalDesignData.address,
      holdingNumber: params.finalDesignData.holdingNumber,
      finalDesignData: params.finalDesignData,
      price: params.price,
      paymentMethod: params.paymentMethod || 'bKash',
      paymentStatus: 'unpaid',
      productionStatus: 'New',
      statusHistory: [
        {
          status: 'New',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer, awaiting manual payment'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

      // Asynchronously post to Supabase database
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: params.customerId,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          customerPhone: params.customerPhone,
          finalDesignData: params.finalDesignData,
          price: params.price,
          paymentMethod: params.paymentMethod || 'bKash'
        })
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.order) {
              const currentOrders = OrderStoreService.getOrders();
              const idx = currentOrders.findIndex((o) => o.id === orderId || o.orderNumber === orderNumber);
              if (idx !== -1) {
                currentOrders[idx] = { ...currentOrders[idx], id: data.order.id, orderNumber: data.order.orderNumber };
                localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(currentOrders));
              }
            }
          }
        })
        .catch((e) => console.warn('Background Supabase createOrder error:', e));
    }
    return newOrder;
  }

  static submitOrderPayment(params: {
    orderId: string;
    paymentMethod: PaymentMethod;
    transactionId: string;
    senderPhone: string;
    paymentNote?: string;
  }): CustomerOrder | null {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === params.orderId || o.orderNumber === params.orderId);
    if (orderIndex === -1) return null;

    const existing = orders[orderIndex];
    const updated: CustomerOrder = {
      ...existing,
      paymentMethod: params.paymentMethod,
      transactionId: params.transactionId,
      senderPhone: params.senderPhone,
      paymentNote: params.paymentNote,
      paymentStatus: 'submitted',
      productionStatus: 'Payment Pending',
      statusHistory: [
        ...(existing.statusHistory || []),
        {
          status: 'Payment Pending',
          timestamp: new Date().toISOString(),
          note: `Payment submitted via ${params.paymentMethod} (TrxID: ${params.transactionId})`
        }
      ],
      updatedAt: new Date().toISOString()
    };

    orders[orderIndex] = updated;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

      // Asynchronously update Supabase database
      fetch(`/api/orders/${encodeURIComponent(params.orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: 'submitted',
          productionStatus: 'Payment Pending',
          transactionId: params.transactionId,
          senderPhone: params.senderPhone,
          paymentNote: params.paymentNote,
          historyNote: `Payment submitted via ${params.paymentMethod} (TrxID: ${params.transactionId})`
        })
      }).catch((e) => console.warn('Background Supabase submitOrderPayment error:', e));
    }
    return updated;
  }

  static updateOrderProductionStatus(orderId: string, status: ProductionStatus, note?: string): CustomerOrder | null {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (orderIndex === -1) return null;

    const existing = orders[orderIndex];
    const updated: CustomerOrder = {
      ...existing,
      productionStatus: status,
      statusHistory: [
        ...(existing.statusHistory || []),
        {
          status,
          timestamp: new Date().toISOString(),
          note: note || `Admin updated production to ${status}`
        }
      ],
      updatedAt: new Date().toISOString()
    };

    orders[orderIndex] = updated;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

      // Update Supabase
      fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productionStatus: status,
          historyNote: note || `Admin updated production to ${status}`
        })
      }).catch((e) => console.warn('Background Supabase updateProduction error:', e));
    }
    return updated;
  }

  static updateOrderPaymentStatus(orderId: string, status: PaymentStatus): CustomerOrder | null {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (orderIndex === -1) return null;

    const existing = orders[orderIndex];
    const nextProdStatus: ProductionStatus = status === 'paid' ? 'Working' : existing.productionStatus;

    const updated: CustomerOrder = {
      ...existing,
      paymentStatus: status,
      productionStatus: nextProdStatus,
      statusHistory: [
        ...(existing.statusHistory || []),
        {
          status: nextProdStatus,
          timestamp: new Date().toISOString(),
          note: `Admin marked payment as "${status}". Production status is "${nextProdStatus}".`
        }
      ],
      updatedAt: new Date().toISOString()
    };

    orders[orderIndex] = updated;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

      // Update Supabase
      fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: status,
          productionStatus: nextProdStatus,
          historyNote: `Admin marked payment as "${status}". Production status is "${nextProdStatus}".`
        })
      }).catch((e) => console.warn('Background Supabase updatePayment error:', e));
    }
    return updated;
  }

  // --- CUSTOMERS DIRECTORY (PROMPT 5) ---
  static getCustomersList(): CustomerSummary[] {
    const orders = this.getOrders();
    const customerMap: Record<string, CustomerSummary> = {
      'usr-cust-01': {
        id: 'usr-cust-01',
        name: 'Md. Anisur Rahman',
        email: 'customer@example.com',
        phone: '+880 1711-223344',
        totalOrders: 0,
        totalSpent: 0,
        joinedDate: '2026-01-15'
      }
    };

    orders.forEach((ord) => {
      const cid = ord.customerId || 'usr-cust-01';
      if (!customerMap[cid]) {
        customerMap[cid] = {
          id: cid,
          name: ord.customerName,
          email: ord.customerEmail,
          phone: ord.customerPhone,
          totalOrders: 0,
          totalSpent: 0,
          joinedDate: ord.createdAt.split('T')[0],
          lastOrderDate: ord.createdAt
        };
      }
      customerMap[cid].totalOrders += 1;
      customerMap[cid].totalSpent += ord.price;
      customerMap[cid].lastOrderDate = ord.createdAt;
    });

    return Object.values(customerMap);
  }

  // --- TEMPLATES MANAGEMENT (PROMPT 5) ---
  static getAdminTemplates(): Template[] {
    if (typeof window === 'undefined') return MOCK_TEMPLATES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_TEMPLATES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TEMPLATES, JSON.stringify(MOCK_TEMPLATES));
        return MOCK_TEMPLATES;
      }
      return JSON.parse(stored);
    } catch {
      return MOCK_TEMPLATES;
    }
  }

  static toggleTemplateEnabled(templateId: string): Template[] {
    const tpls = this.getAdminTemplates();
    const target = tpls.find((t) => t.id === templateId);
    const newEnabled = target ? (target.enabled === false ? true : false) : true;
    const updated = tpls.map((t) => (t.id === templateId ? { ...t, enabled: newEnabled } : t));

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TEMPLATES, JSON.stringify(updated));

      // Asynchronously update Supabase
      fetch(`/api/templates/${encodeURIComponent(templateId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled })
      }).catch((e) => console.warn('Background Supabase toggleTemplateEnabled error:', e));
    }
    return updated;
  }

  static updateTemplate(templateId: string, updates: Partial<Template>): Template[] {
    const tpls = this.getAdminTemplates();
    const updated = tpls.map((t) => (t.id === templateId ? { ...t, ...updates } : t));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TEMPLATES, JSON.stringify(updated));

      // Asynchronously update Supabase
      fetch(`/api/templates/${encodeURIComponent(templateId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).catch((e) => console.warn('Background Supabase updateTemplate error:', e));
    }
    return updated;
  }

  // --- PAYMENT SETTINGS ---
  static getPaymentSettings(): PaymentSettings {
    if (typeof window === 'undefined') return DEFAULT_PAYMENT_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(DEFAULT_PAYMENT_SETTINGS));
        return DEFAULT_PAYMENT_SETTINGS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PAYMENT_SETTINGS;
    }
  }

  static updatePaymentSettings(settings: PaymentSettings): PaymentSettings {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(settings));

      // Asynchronously update Supabase
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'payment', paymentSettings: settings })
      }).catch((e) => console.warn('Background Supabase updatePaymentSettings error:', e));
    }
    return settings;
  }

  // --- BUSINESS SETTINGS ---
  static getBusinessSettings(): BusinessSettings {
    if (typeof window === 'undefined') return DEFAULT_BUSINESS_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUSINESS_SETTINGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.BUSINESS_SETTINGS, JSON.stringify(DEFAULT_BUSINESS_SETTINGS));
        return DEFAULT_BUSINESS_SETTINGS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_BUSINESS_SETTINGS;
    }
  }

  static updateBusinessSettings(settings: BusinessSettings): BusinessSettings {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BUSINESS_SETTINGS, JSON.stringify(settings));

      // Asynchronously update Supabase
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'business', businessSettings: settings })
      }).catch((e) => console.warn('Background Supabase updateBusinessSettings error:', e));
    }
    return settings;
  }
}

// Automatically initiate a one-time sync in browser environment
if (typeof window !== 'undefined' && !syncInitialized) {
  syncInitialized = true;
  setTimeout(() => {
    OrderStoreService.syncWithServer();
  }, 100);
}
