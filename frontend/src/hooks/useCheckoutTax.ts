import { CartItem } from '../types';
import { FIXED_TAX_RATE, calculateTax as calculateTaxAmount } from './useTaxRate';

interface CheckoutAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
}

interface TaxDetails {
  totalTax: number;
  totalAmount: number;
  taxableAmount: number;
  rate: number;
  breakdown?: {
    state?: number;
    county?: number;
    city?: number;
    special?: number;
  };
}

interface UseCheckoutTaxReturn {
  calculateTax: (items: CartItem[]) => TaxDetails;
}

/**
 * Simplified hook to calculate taxes using fixed 7.43% rate
 */
const useCheckoutTax = (): UseCheckoutTaxReturn => {
  const calculateTax = (items: CartItem[]): TaxDetails => {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply fixed tax rate
    const taxAmount = calculateTaxAmount(subtotal);
    
    // Prepare response with fixed rate
    return {
      totalTax: taxAmount,
      totalAmount: subtotal + taxAmount,
      taxableAmount: subtotal,
      rate: FIXED_TAX_RATE,
      breakdown: {
        state: taxAmount,
        county: 0,
        city: 0,
        special: 0
      }
    };
  };

  return { calculateTax };
};

export default useCheckoutTax; 