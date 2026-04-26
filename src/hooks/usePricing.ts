import { useMemo } from 'react';
import { calculatePrice } from '../app/pricing/engine';
import { PricingInput } from '../app/pricing/types';

export function usePricing(input: PricingInput) {
  const breakdown = useMemo(() => calculatePrice(input), [input]);

  return {
    total: breakdown.total,
    breakdown,
  };
}
