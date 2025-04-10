import { useState, useCallback } from 'react';

// Simplified interface for the address details (still needed for API signature compatibility)
interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Fixed tax rate of 7.43%
export const FIXED_TAX_RATE = 0.0743;

/**
 * Calculate tax for a subtotal
 * @param subtotal The subtotal amount
 * @returns The tax amount (rounded to 2 decimal places)
 */
export const calculateTax = (subtotal: number): number => {
  return parseFloat((subtotal * FIXED_TAX_RATE).toFixed(2));
};

interface SimpleTaxRateReturn {
  taxRate: number;
  isLoading: boolean;
  error: null;
}

/**
 * Simplified tax hook that just returns the fixed rate
 */
const useTaxRate = (): SimpleTaxRateReturn => {
  return {
    taxRate: FIXED_TAX_RATE,
    isLoading: false,
    error: null
  };
};

export default useTaxRate;
