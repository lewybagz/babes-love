// Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  images: string[];
  available?: boolean;
  customizationOptions?: {
    fonts: boolean;
    styles: boolean;
  };
  category?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  customization: ProductCustomization | CustomHatData;
}

export interface ProductCustomization {
  font: string;
  style: string;
  quantity?: number;
}

// Define the structure for custom hat data
export interface CustomHatData {
  isCustomHat: true;
  font: string;
  color: string;
  customText: string;
}

// Customization Options
export interface CustomizationOption {
  id: string;
  type: 'font' | 'style' | 'color';
  value: string;
  label: string;
  name: string;
  preview?: string;
  thumbnail?: string;
}

// Represents customization options available in the customizer
export interface CustomizerConfig {
  fonts: string[];
  colors: { name: string; hex: string }[];
  minQuantity: number;
  maxTextLength: number;
  maxWords: number;
  fixedPrefix: string;
}

// Order Types
export interface OrderData {
  customer: CustomerInfo;
  shipping: ShippingInfo;
  payment: PaymentInfo;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
} 