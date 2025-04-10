/**
 * Tax configuration for BabesLove
 * Simple fixed tax rate of 7.43% for all transactions
 */

// Read from environment or use default
const FIXED_TAX_RATE = parseFloat(process.env.FIXED_TAX_RATE || 0.0743);

/**
 * Calculate tax amount for a given subtotal
 * @param {number} subtotal - Order subtotal
 * @returns {number} Tax amount (rounded to 2 decimal places)
 */
const calculateTax = (subtotal) => {
  return parseFloat((subtotal * FIXED_TAX_RATE).toFixed(2));
};

module.exports = {
  FIXED_TAX_RATE,
  calculateTax,
};
