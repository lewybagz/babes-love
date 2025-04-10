import { Product, CustomizationOption, OrderData, CustomerInfo, ShippingInfo } from './index';

// Product template for saving frequent configurations
export interface ProductTemplate {
  id: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
  customizationOptions: {
    fonts: boolean;
    styles: boolean;
  };
  category: string;
}

// Extended product interface for admin form
export interface AdminProductFormData {
  name: string;
  price: number;
  description: string;
  available: boolean;
  imageFiles: File[]; // For file upload
  customizationOptions: {
    fonts: boolean;
    styles: boolean;
  };
  category: string;
  templateId?: string; // Optional reference to a template
}

// Product categories
export type ProductCategory = 'hats' | 'accessories' | 'apparel' | 'custom';

// Order management interfaces
export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: AdminOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  shippingInfo: ShippingInfo;
  trackingNumber?: string;
  notes?: string;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  customization?: {
    font?: string;
    style?: string;
  };
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

// Filter options for order listing
export interface OrderFilterOptions {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  searchTerm?: string;
}

// Customer (User) management interfaces
export interface AdminCustomer {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateCreated: string;
  lastLogin?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string; 
  addresses?: Address[];
  notes?: string;
  isVerified: boolean;
}

export interface Address {
  id: string;
  isPrimary: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string; 
  country: string;
}

// Customer filter options
export interface CustomerFilterOptions {
  searchTerm?: string;
  hasOrders?: boolean; // true = has placed at least one order, false = has placed no orders
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

// Payment management interfaces
export interface AdminPayment {
  id: string;
  stripePaymentId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: PaymentTransactionStatus;
  paymentMethod: string;
  cardBrand?: string;
  cardLast4?: string;
  createdAt: string;
  metadata?: Record<string, string>;
  refundedAmount?: number;
  refunds?: AdminRefund[];
  error?: string;
}

export interface AdminRefund {
  id: string;
  amount: number;
  createdAt: string;
  reason?: string;
  status: string;
}

export type PaymentTransactionStatus = 
  | 'succeeded'
  | 'pending'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'canceled';

export interface PaymentFilterOptions {
  status?: PaymentTransactionStatus;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  searchTerm?: string;
}

export type TimePeriod = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface SalesDataPoint {
  date: string; // Format like 'YYYY-MM-DD' or 'YYYY-MM'
  revenue: number;
  orders: number;
  itemsSold: number;
}

export interface KpiCardData {
  title: string;
  value: string | number;
  change?: number; // Percentage change (e.g., 15 for +15%)
  changePeriod?: string; // e.g., "vs last 30d"
  description?: string;
}

export interface TopProductData {
  id: string;
  name: string;
  imageUrl?: string;
  revenue: number;
  unitsSold: number;
}

export interface CustomerActivityData {
  date: string;
  newUsers: number;
  activeUsers: number;
  purchases: number;
  productViews: number;
}

export interface TrafficSourceData {
  source: string;
  visits: number;
  conversionRate: number; // As percentage (e.g., 2.5 for 2.5%)
}

export interface AnalyticsOverview {
  kpis: KpiCardData[];
  salesOverTime: SalesDataPoint[];
  topProducts: TopProductData[];
  customerActivity: CustomerActivityData[];
  trafficSources: TrafficSourceData[];
  // Add more specific data as needed
}

export interface AnalyticsOptions {
  timePeriod: TimePeriod;
  customDateRange?: DateRange;
} 