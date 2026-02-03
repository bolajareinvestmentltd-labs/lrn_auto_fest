// Utility functions for number formatting and currency

/**
 * Format number as Nigerian Naira (₦)
 */
export function formatNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-NG');
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Calculate price with group discount logic
 */
export function calculateGroupPrice(
  basePrice: number,
  groupSize: 'SINGLE' | 'GROUP_2' | 'GROUP_4'
): number {
  const multipliers = {
    SINGLE: 1,
    GROUP_2: 1.8, // approx 2x with 10% discount
    GROUP_4: 3.4, // approx 4x with 15% discount
  };

  return Math.round(basePrice * (multipliers[groupSize] || 1));
}

/**
 * Calculate parking passes required
 */
export function calculateParkingPasses(
  groupSize: 'SINGLE' | 'GROUP_2' | 'GROUP_4'
): number {
  const passes = {
    SINGLE: 1,
    GROUP_2: 1,
    GROUP_4: 2,
  };
  return passes[groupSize] || 1;
}

/**
 * Check if presale price should be used
 */
export function shouldUsePresalePrice(presaleEndDate: Date): boolean {
  return new Date() <= presaleEndDate;
}
