// Shared Package/Product Option Schema
export type PackageId = string;

export interface PackageOption {
  id: PackageId;
  title: string;          // e.g. "১টি বক্স (১২০ ক্যাপসুল)"
  capsules: string;       // e.g. "১২০টি ক্যাপসুল"
  price: number;          // e.g. 1200
  originalPrice?: number; // e.g. 1200
  savings?: number;       // e.g. 200
  label?: string;         // e.g. "বিশেষ অফার"
  isPopular?: boolean;    // Highlight flag
}

export interface OrderDetails {
  id: string;             // Generated ID (e.g. 20 or DC-458129)
  orderNumber?: string;   // order_number from backend (e.g. OR-20260622-0020)
  packageName: string;
  packagePrice: number;
  customerName: string;
  phoneNumber: string;
  alternativePhone?: string | null;
  address: string;
  districtName?: string;
  districtNameBn?: string;
  thanaName?: string;
  thanaNameBn?: string;
  deliveryArea: 'inside' | 'outside';
  deliveryCharge: number; // 60 or 130
  totalCost: number;      // packagePrice + deliveryCharge
  orderDate: string;      // e.g. "21 June 2026"
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  quantity?: number;
  unitPrice?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string | null;
}

// Delivery Configurations
export interface DeliverySettings {
  insideDhakaCharge: number;  // Default: 60
  outsideDhakaCharge: number; // Default: 130
}

// User details returned from the login API
export interface User {
  name: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  is_active: boolean;
  encrypted_id: string;
}

// Menu items returned from the login API
export interface MenuItem {
  parent_id: number;
  name: string;
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  encrypted_id: string;
}

// Login API response structure
export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  token_type: string;
  user: User;
  menus: MenuItem[];
}

export interface District {
  name: string;
  name_bn: string;
  code: string;
  encrypted_id: string;
}

export interface Thana {
  district_id: number;
  name: string;
  name_bn: string;
  code: string;
  encrypted_id: string;
}

