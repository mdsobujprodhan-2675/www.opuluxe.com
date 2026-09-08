import { Currency } from '../types';

export const formatPrice = (amount: number, currency: Currency = 'BDT'): string => {
  if (currency === 'USD') {
    // 1 USD ~ 118 BDT conversion rate
    const usd = amount / 118;
    return `$${usd.toFixed(2)}`;
  }
  return `৳${Math.round(amount).toLocaleString('en-IN')}`;
};

export const calculateDiscount = (price: number, originalPrice?: number): number | null => {
  if (!originalPrice || originalPrice <= price) return null;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  return discount > 0 ? discount : null;
};
