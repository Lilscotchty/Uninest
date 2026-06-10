// src/lib/formatPrice.ts

import type { PricingTag } from '../types/roles';

export function formatPrice(
  price: number,
  tag: PricingTag | string = '/sem',
  currency = 'GHS'
): string {
  // If price is 0 or invalid
  if (isNaN(price)) return `GHC 0${tag}`;
  
  const formatted = new Intl.NumberFormat('en-GH', {
    style:    'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price).replace('GHS', 'GH₵'); // ensure custom currency symbol
  
  return `${formatted}${tag}`;
}
