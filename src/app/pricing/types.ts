export type Turnaround = 'standard' | 'express' | 'rush';

export type ProductType = 'flyer' | 'banner' | 'tshirt' | (string & {});

export type PricingInput = {
  productType: ProductType;
  quantity: number;
  options: Record<string, string | number | boolean | undefined>;
  deliveryZone?: string;
  turnaround?: Turnaround;
};

export type PricingBreakdown = {
  basePrice: number;
  optionCosts: number;
  quantityDiscount: number;
  addonsCost: number;
  deliveryFee: number;
  turnaroundFee: number;
  total: number;
  selectedTier?: { qty: number; unitPrice: number };
};

export type QuantityTier = { qty: number; unitPrice: number };

export type ProductPricingRule = {
  basePrice?: number;
  optionGroups?: Record<string, Record<string, number>>;
  quantityTiers?: QuantityTier[];
  addons?: Record<string, number>;
};
