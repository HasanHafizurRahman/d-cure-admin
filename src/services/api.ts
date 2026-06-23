import type { PackageOption, OrderDetails, DeliverySettings, LoginResponse, District, Thana } from '../types';



// API Configuration
const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || 'http://118.179.144.13:8005');

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('dcure_admin_token');
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = getAuthHeaders();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('dcure_admin_token');
    localStorage.removeItem('dcure_admin_user');
    localStorage.removeItem('dcure_admin_menus');

    window.dispatchEvent(new Event('dcure_unauthorized'));

    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  return response;
};

// Constants
const LOCAL_STORAGE_KEYS = {
  PACKAGES: 'dcure_admin_packages',
  ORDERS: 'dcure_admin_orders',
  SETTINGS: 'dcure_admin_settings',
};

// Seed Defaults
const DEFAULT_PACKAGES: PackageOption[] = [
  {
    id: 'single',
    title: '১টি বক্স (১২০ ক্যাপসুল)',
    capsules: '১২০টি ক্যাপসুল',
    price: 1200,
    originalPrice: 1200,
    savings: 0,
    label: 'সাধারণ মূল্য',
    isPopular: false
  },
  {
    id: 'double',
    title: '২টি বক্স (২৪০ ক্যাপসুল)',
    capsules: '২৪০টি ক্যাপসুল',
    price: 2200,
    originalPrice: 2400,
    savings: 200,
    label: 'বিশেষ অফার',
    isPopular: false
  },
  {
    id: 'triple',
    title: '৩টি বক্স (৩৬০ ক্যাপসুল - ফুল কোর্স)',
    capsules: '৩৬০টি ক্যাপসুল (ফুল কোর্স)',
    price: 3000,
    originalPrice: 3600,
    savings: 600,
    label: 'সেরা অফার (ফুল কোর্স)',
    isPopular: true
  }
];

const DEFAULT_SETTINGS: DeliverySettings = {
  insideDhakaCharge: 60,
  outsideDhakaCharge: 130,
};

const DEFAULT_ORDERS: OrderDetails[] = [
  {
    id: 'DC-482910',
    packageName: '৩টি বক্স (৩৬০ ক্যাপসুল - ফুল কোর্স)',
    packagePrice: 3000,
    customerName: 'আব্দুল্লাহ আল মামুন',
    phoneNumber: '01712345678',
    address: 'মিরপুর ১০, ঢাকা',
    deliveryArea: 'inside',
    deliveryCharge: 60,
    totalCost: 3060,
    orderDate: '20 June 2026',
    status: 'Processing'
  },
  {
    id: 'DC-318492',
    packageName: '২টি বক্স (২৪০ ক্যাপসুল)',
    packagePrice: 2200,
    customerName: 'মো: কামরুল হাসান',
    phoneNumber: '01898765432',
    address: 'জিইসি মোড়, চট্টগ্রাম',
    deliveryArea: 'outside',
    deliveryCharge: 130,
    totalCost: 2330,
    orderDate: '19 June 2026',
    status: 'Shipped'
  },
  {
    id: 'DC-927318',
    packageName: '১টি বক্স (১২০ ক্যাপসুল)',
    packagePrice: 1200,
    customerName: 'বেগম খালেদা আক্তার',
    phoneNumber: '01911223344',
    address: 'সদরঘাট, ঢাকা',
    deliveryArea: 'inside',
    deliveryCharge: 60,
    totalCost: 1260,
    orderDate: '18 June 2026',
    status: 'Delivered'
  },
  {
    id: 'DC-129845',
    packageName: '৩টি বক্স (৩৬০ ক্যাপসুল - ফুল কোর্স)',
    packagePrice: 3000,
    customerName: 'মো: রফিকুল ইসলাম',
    phoneNumber: '01555667788',
    address: 'রাজশাহী সদর, রাজশাহী',
    deliveryArea: 'outside',
    deliveryCharge: 130,
    totalCost: 3130,
    orderDate: '17 June 2026',
    status: 'Cancelled'
  },
  {
    id: 'DC-884927',
    packageName: '৩টি বক্স (৩৬০ ক্যাপসুল - ফুল কোর্স)',
    packagePrice: 3000,
    customerName: 'তানভীর আহমেদ',
    phoneNumber: '01676543210',
    address: 'উত্তরা সেক্টর ৭, ঢাকা',
    deliveryArea: 'inside',
    deliveryCharge: 60,
    totalCost: 3060,
    orderDate: '21 June 2026',
    status: 'Processing'
  }
];

// Helper functions for Local Storage
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Simulated latency helper
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // --- AUTH ENDPOINTS ---
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }
    return data;
  },

  // --- PACKAGES ENDPOINTS ---
  getPackages: async (): Promise<PackageOption[]> => {
    await delay();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/public/products`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.items)) {
          return data.items.map((item: any) => ({
            id: String(item.id),
            title: item.name || '',
            capsules: item.capsule_quantity || '',
            price: Number(item.selling_price) || 0,
            originalPrice: Number(item.original_price) || Number(item.selling_price) || 0,
            savings: Number(item.original_price) > Number(item.selling_price)
              ? Number(item.original_price) - Number(item.selling_price)
              : 0,
            label: item.offer_label || '',
            isPopular: Boolean(item.is_popular),
          }));
        }
      }
    } catch (e) {
      console.error('Failed to get packages from product API:', e);
    }
    return getStorageItem<PackageOption[]>(LOCAL_STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
  },

  createPackage: async (pkg: Omit<PackageOption, 'id'>): Promise<PackageOption> => {
    await delay();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pkg.title,
          package_details: pkg.title,
          capsule_quantity: pkg.capsules,
          selling_price: pkg.price,
          original_price: pkg.originalPrice || pkg.price,
          offer_label: pkg.label || '',
          is_popular: pkg.isPopular || false,
          image_path: 'assets/d-cure.png',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const item = data.item || data.product;
        if (item) {
          return {
            id: String(item.id),
            title: item.name || '',
            capsules: item.capsule_quantity || '',
            price: Number(item.selling_price) || 0,
            originalPrice: Number(item.original_price) || Number(item.selling_price) || 0,
            savings: Number(item.original_price) > Number(item.selling_price)
              ? Number(item.original_price) - Number(item.selling_price)
              : 0,
            label: item.offer_label || '',
            isPopular: Boolean(item.is_popular),
          };
        }
      }
    } catch (e) {
      console.error('Failed to create package on product API:', e);
    }

    // Failover
    const newPkg: PackageOption = {
      ...pkg,
      id: `pkg-${Date.now()}`,
    };
    const packages = getStorageItem<PackageOption[]>(LOCAL_STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
    packages.push(newPkg);
    setStorageItem(LOCAL_STORAGE_KEYS.PACKAGES, packages);
    return newPkg;
  },

  updatePackage: async (id: string, updatedPkg: Partial<PackageOption>): Promise<PackageOption> => {
    await delay();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedPkg.title,
          package_details: updatedPkg.title,
          capsule_quantity: updatedPkg.capsules,
          selling_price: updatedPkg.price,
          original_price: updatedPkg.originalPrice || updatedPkg.price,
          offer_label: updatedPkg.label || '',
          is_popular: updatedPkg.isPopular || false,
          image_path: 'assets/d-cure.png',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const item = data.item || data.product;
        if (item) {
          return {
            id: String(item.id),
            title: item.name || '',
            capsules: item.capsule_quantity || '',
            price: Number(item.selling_price) || 0,
            originalPrice: Number(item.original_price) || Number(item.selling_price) || 0,
            savings: Number(item.original_price) > Number(item.selling_price)
              ? Number(item.original_price) - Number(item.selling_price)
              : 0,
            label: item.offer_label || '',
            isPopular: Boolean(item.is_popular),
          };
        }
      }
    } catch (e) {
      console.error('Failed to update package on product API:', e);
    }

    const packages = getStorageItem<PackageOption[]>(LOCAL_STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
    const index = packages.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Package not found');
    packages[index] = { ...packages[index], ...updatedPkg };
    setStorageItem(LOCAL_STORAGE_KEYS.PACKAGES, packages);
    return packages[index];
  },

  deletePackage: async (id: string): Promise<boolean> => {
    await delay();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) return true;
      }
    } catch (e) {
      console.error('Failed to delete package on product API:', e);
    }

    const packages = getStorageItem<PackageOption[]>(LOCAL_STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
    const filtered = packages.filter((p) => p.id !== id);
    setStorageItem(LOCAL_STORAGE_KEYS.PACKAGES, filtered);
    return true;
  },

  // --- ORDERS ENDPOINTS ---
  getOrders: async (filters?: { status?: string; search?: string }): Promise<OrderDetails[]> => {
    await delay();
    try {
      let url = '/api/orders';
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetchWithAuth(`${API_BASE_URL}${url}`);
      if (response.ok) return await response.json();
    } catch {
      // Failover to local storage
    }

    let orders = getStorageItem<OrderDetails[]>(LOCAL_STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);

    // Apply filtering client-side for mock fallback
    if (filters) {
      if (filters.status && filters.status !== 'All') {
        orders = orders.filter((o) => o.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.customerName.toLowerCase().includes(query) ||
            o.phoneNumber.toLowerCase().includes(query) ||
            o.id.toLowerCase().includes(query)
        );
      }
    }
    return orders.sort((a, b) => b.id.localeCompare(a.id)); // Newest first by id sorting
  },

  createOrder: async (order: Omit<OrderDetails, 'id'>): Promise<OrderDetails> => {
    await delay();
    const newOrder: OrderDetails = {
      ...order,
      id: `DC-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (response.ok) return await response.json();
    } catch {
      // Failover to local storage
    }
    const orders = getStorageItem<OrderDetails[]>(LOCAL_STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    orders.unshift(newOrder); // Add to beginning
    setStorageItem(LOCAL_STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  updateOrderStatus: async (
    id: string,
    status: OrderDetails['status']
  ): Promise<OrderDetails> => {
    await delay();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) return await response.json();
    } catch {
      // Failover to local storage
    }
    const orders = getStorageItem<OrderDetails[]>(LOCAL_STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');
    orders[index].status = status;
    setStorageItem(LOCAL_STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  deleteOrder: async (id: string): Promise<boolean> => {
    await delay();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) return true;
    } catch {
      // Failover to local storage
    }
    const orders = getStorageItem<OrderDetails[]>(LOCAL_STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const filtered = orders.filter((o) => o.id !== id);
    setStorageItem(LOCAL_STORAGE_KEYS.ORDERS, filtered);
    return true;
  },

  // --- SETTINGS ENDPOINTS ---
  getSettings: async (): Promise<DeliverySettings> => {
    await delay();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/settings`);
      if (response.ok) return await response.json();
    } catch {
      // Failover to local storage
    }
    return getStorageItem<DeliverySettings>(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  updateSettings: async (settings: Partial<DeliverySettings>): Promise<DeliverySettings> => {
    await delay();
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) return await response.json();
    } catch {
      // Failover to local storage
    }
    const current = getStorageItem<DeliverySettings>(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const updated = { ...current, ...settings };
    setStorageItem(LOCAL_STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // --- DISTRICTS ENDPOINTS ---
  getDistricts: async (): Promise<District[]> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/public/districts`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.items)) {
          return data.items;
        }
      }
    } catch (e) {
      console.error('Failed to get districts:', e);
    }
    return [];
  },

  // --- THANAS ENDPOINTS ---
  getThanas: async (districtCode: string): Promise<Thana[]> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/public/thanas/district/${districtCode}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.items)) {
          return data.items;
        }
      }
    } catch (e) {
      console.error(`Failed to get thanas for district ${districtCode}:`, e);
    }
    return [];
  },
};

