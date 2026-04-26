export type Turnaround = 'standard' | 'express' | 'rush';
export type PricingInput = {
  productType: 'flyer' | 'banner' | 'tshirt' | (string & {});
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

type ProductPricingRule = {
  basePrice?: number;
  optionGroups?: Record<string, Record<string, number>>;
  quantityTiers?: Array<{ qty: number; unitPrice: number }>;
  addons?: Record<string, number>;
};

export const deliveryZones = { cbd: 200, nairobi: 400, towns: 1150 };
export const turnaroundFees: Record<Turnaround, number> = { standard: 0, express: 500, rush: 1500 };
export const freeDeliveryThreshold = 2500;

export const pricingConfig: Record<string, ProductPricingRule> = {
  flyer: {
    optionGroups: {
      size: { A6: 0, A5: 3, A4: 10, DL: 2 },
      sides: { single: 0, double: 4 },
      paper: { 'bond-80gsm': 0, 'artpaper-150gsm': 2, 'artpaper-200gsm': 5 },
    },
    quantityTiers: [{ qty: 50, unitPrice: 45 }, { qty: 100, unitPrice: 42 }, { qty: 200, unitPrice: 40 }, { qty: 400, unitPrice: 38 }, { qty: 500, unitPrice: 35 }, { qty: 1000, unitPrice: 30 }],
    addons: { designNeeded: 1500, artworkCleanup: 300 },
  },
  banner: {
    optionGroups: { size: { narrow: 6500, broad: 8500 }, material: { pvc: 0, premium: 600, mesh: 900 }, finishing: { eyelets: 0, 'pole-pockets': 200, none: 0 } },
    quantityTiers: [{ qty: 1, unitPrice: 0 }, { qty: 2, unitPrice: -250 }, { qty: 3, unitPrice: -533 }, { qty: 5, unitPrice: -900 }, { qty: 10, unitPrice: -1100 }],
    addons: { designNeeded: 2000, standAssembly: 500 },
  },
  tshirt: {
    basePrice: 800,
    optionGroups: { color: { white: 0, color: 100 }, method: { text: 0, image: 150, dtf: 200, screen: 150, embroidery: 400 }, area: { front: 0, back: 0, both: 150 }, fit: { kids: 0, adult: 0 }, size: { XS: 0, S: 0, M: 0, L: 0, XL: 50, XXL: 80, XXXL: 120 } },
    quantityTiers: [{ qty: 1, unitPrice: 0 }, { qty: 2, unitPrice: -50 }, { qty: 5, unitPrice: -80 }, { qty: 10, unitPrice: -120 }, { qty: 20, unitPrice: -180 }, { qty: 50, unitPrice: -220 }],
    addons: { designNeeded: 1200 },
  },
};

const getUnitPrice = (qty: number, tiers = []) => tiers.slice().sort((a, b) => a.qty - b.qty).reduce((s: any, t: any) => (qty >= t.qty ? t : s), undefined);

export function calculatePrice(input: PricingInput): PricingBreakdown {
  const quantity = Math.max(0, Math.floor(input.quantity || 0));
  const rule = pricingConfig[input.productType];
  if (!rule || quantity === 0) return { basePrice: 0, optionCosts: 0, quantityDiscount: 0, addonsCost: 0, deliveryFee: 0, turnaroundFee: 0, total: 0 };

  const base = input.productType === 'flyer' ? 0 : input.productType === 'banner' ? Number(rule.optionGroups?.size?.[String(input.options.size)] ?? 0) : rule.basePrice ?? 0;
  const options = Object.entries(input.options).reduce((sum, [k, v]) => {
    if (v === undefined || v === false) return sum;
    const group = rule.optionGroups?.[k];
    return sum + (group?.[String(v)] ?? 0);
  }, 0);
  const tier = getUnitPrice(quantity, rule.quantityTiers as any);
  const unitAdj = tier?.unitPrice ?? 0;
  const quantityPrice = (base + options + unitAdj) * quantity;
  const addons = Object.entries(rule.addons ?? {}).reduce((sum, [k, cost]) => (input.options[k] ? sum + cost : sum), 0);
  const turnaround = turnaroundFees[input.turnaround ?? 'standard'] ?? 0;
  const sub = quantityPrice + addons + turnaround;
  const delivery = sub >= freeDeliveryThreshold ? 0 : (deliveryZones[input.deliveryZone as keyof typeof deliveryZones] ?? 0);

  return {
    basePrice: base * quantity,
    optionCosts: options * quantity,
    quantityDiscount: unitAdj < 0 ? Math.abs(unitAdj) * quantity : 0,
    addonsCost: addons,
    turnaroundFee: turnaround,
    deliveryFee: delivery,
    total: Math.max(0, Math.round(sub + delivery)),
    selectedTier: tier,
  };
}
