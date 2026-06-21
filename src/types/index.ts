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

// Order details submitted from the landing page CheckoutForm
export interface OrderDetails {
  id: string;             // Generated ID (e.g. DC-458129)
  packageName: string;
  packagePrice: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryArea: 'inside' | 'outside';
  deliveryCharge: number; // 60 or 130
  totalCost: number;      // packagePrice + deliveryCharge
  orderDate: string;      // e.g. "21 June 2026"
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

// Delivery Configurations
export interface DeliverySettings {
  insideDhakaCharge: number;  // Default: 60
  outsideDhakaCharge: number; // Default: 130
}
