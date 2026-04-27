export type Turnaround = 'standard' | 'express' | 'rush';

export type PricingInput = {
  productType: 'flyer' | 'banner' | 'tshirt' | 'business-card' | 'booklet' | 'poster' | 'sticker' | (string & {});
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
  unitPrice: number;
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
    quantityTiers: [
      { qty: 50, unitPrice: 45 },
      { qty: 100, unitPrice: 42 },
      { qty: 200, unitPrice: 40 },
      { qty: 400, unitPrice: 38 },
      { qty: 500, unitPrice: 35 },
      { qty: 1000, unitPrice: 30 },
    ],
    addons: { designNeeded: 1500, artworkCleanup: 300 },
  },

  banner: {
    optionGroups: {
      size: { narrow: 6500, broad: 8500 },
      material: { pvc: 0, premium: 600, mesh: 900 },
      finishing: { eyelets: 0, 'pole-pockets': 200, none: 0 },
    },
    quantityTiers: [
      { qty: 1, unitPrice: 0 },
      { qty: 2, unitPrice: -250 },
      { qty: 3, unitPrice: -533 },
      { qty: 5, unitPrice: -900 },
      { qty: 10, unitPrice: -1100 },
    ],
    addons: { designNeeded: 2000, standAssembly: 500 },
  },

  tshirt: {
    basePrice: 800,
    optionGroups: {
      color: { white: 0, color: 100 },
      method: { text: 0, image: 150, dtf: 200, screen: 150, embroidery: 400 },
      area: { front: 0, back: 0, both: 150 },
      fit: { kids: 0, adult: 0 },
      size: { XS: 0, S: 0, M: 0, L: 0, XL: 50, XXL: 80, XXXL: 120 },
    },
    quantityTiers: [
      { qty: 1, unitPrice: 0 },
      { qty: 2, unitPrice: -50 },
      { qty: 5, unitPrice: -80 },
      { qty: 10, unitPrice: -120 },
      { qty: 20, unitPrice: -180 },
      { qty: 50, unitPrice: -220 },
    ],
    addons: { designNeeded: 1200 },
  },

  'business-card': {
    optionGroups: {
      sides: { single: 0, double: 300 },
      lamination: { none: 0, matte: 400, gloss: 350 },
      corners: { square: 0, rounded: 200 },
      paper: { '350gsm': 0, '400gsm': 200 },
    },
    quantityTiers: [
      { qty: 100, unitPrice: 15 },
      { qty: 250, unitPrice: 12 },
      { qty: 500, unitPrice: 10 },
      { qty: 1000, unitPrice: 8 },
    ],
    addons: { designNeeded: 1500 },
  },

  booklet: {
    optionGroups: {
      pages: { '8': 0, '12': 2, '16': 4, '20': 6, '24': 8, '32': 12, '48': 18, '64': 24 },
      innerPrint: { 'bw': 0, 'color': 10 },
      cover: { 'glossy': 0, 'matte': 100 },
      paperWeight: { '80gsm': 0, '100gsm': 5, '150gsm': 10 },
      binding: { staple: 0, 'perfect-bind': 120, spiral: 80 },
    },
    quantityTiers: [
      { qty: 1, unitPrice: 350 },
      { qty: 5, unitPrice: 280 },
      { qty: 10, unitPrice: 240 },
      { qty: 25, unitPrice: 200 },
      { qty: 50, unitPrice: 175 },
      { qty: 100, unitPrice: 150 },
    ],
    addons: { designNeeded: 3500 },
  },

  poster: {
    optionGroups: {
      size: { 'A3': 0, 'A2': 300, 'A1': 600, '60x90': 800 },
      finish: { 'matte': 0, 'gloss': 100, 'satin': 80 },
      paper: { '150gsm': 0, '200gsm': 100, '250gsm': 200 },
      framing: { none: 0, basic: 800, premium: 1500 },
    },
    quantityTiers: [
      { qty: 1, unitPrice: 300 },
      { qty: 5, unitPrice: 250 },
      { qty: 10, unitPrice: 220 },
      { qty: 20, unitPrice: 190 },
      { qty: 50, unitPrice: 160 },
    ],
    addons: { designNeeded: 2000 },
  },

  sticker: {
    optionGroups: {
      shape: { rectangle: 0, circle: 0, custom: 200 },
      size: { small: 0, medium: 10, large: 20 },
      finish: { matte: 0, gloss: 5, holographic: 25 },
      material: { paper: 0, vinyl: 15, transparent: 20 },
    },
    quantityTiers: [
      { qty: 50, unitPrice: 20 },
      { qty: 100, unitPrice: 17 },
      { qty: 250, unitPrice: 14 },
      { qty: 500, unitPrice: 11 },
      { qty: 1000, unitPrice: 8 },
    ],
    addons: { designNeeded: 1000 },
  },
};

function getUnitTier(qty: number, tiers: Array<{ qty: number; unitPrice: number }>) {
  return tiers
    .slice()
    .sort((a, b) => a.qty - b.qty)
    .reduce<{ qty: number; unitPrice: number } | undefined>(
      (best, t) => (qty >= t.qty ? t : best),
      undefined,
    );
}

export function calculatePrice(input: PricingInput): PricingBreakdown {
  const quantity = Math.max(0, Math.floor(input.quantity || 0));
  const rule = pricingConfig[input.productType];

  const zero: PricingBreakdown = { basePrice: 0, optionCosts: 0, quantityDiscount: 0, addonsCost: 0, deliveryFee: 0, turnaroundFee: 0, total: 0, unitPrice: 0 };
  if (!rule || quantity === 0) return zero;

  // Base price: banner uses size option as base, others use basePrice field
  let base = rule.basePrice ?? 0;
  if (input.productType === 'banner') {
    base = Number(rule.optionGroups?.size?.[String(input.options.size)] ?? 0);
  } else if (input.productType === 'flyer') {
    base = 0;
  }

  // Sum all option costs (skip base-price options that were already counted)
  const optionKeys = Object.keys(rule.optionGroups ?? {});
  const optionCostPerUnit = optionKeys.reduce((sum, key) => {
    if (input.productType === 'banner' && key === 'size') return sum; // already in base
    const val = input.options[key];
    if (val === undefined || val === false) return sum;
    return sum + (rule.optionGroups![key]?.[String(val)] ?? 0);
  }, 0);

  // Quantity tier
  const tier = getUnitTier(quantity, rule.quantityTiers ?? []);
  const tierAdj = tier?.unitPrice ?? 0;

  // Per-unit total before addons
  const unitTotal = base + optionCostPerUnit + (tierAdj > 0 ? tierAdj : 0);
  const quantityPrice = unitTotal * quantity;
  const quantityDiscount = tierAdj < 0 ? Math.abs(tierAdj) * quantity : 0;
  const quantityPriceWithDiscount = (base + optionCostPerUnit) * quantity - quantityDiscount;

  // Addons (flat fee, not per-unit)
  const addonsCost = Object.entries(rule.addons ?? {}).reduce(
    (sum, [k, cost]) => (input.options[k] ? sum + cost : sum),
    0,
  );

  const turnaroundFee = turnaroundFees[input.turnaround ?? 'standard'] ?? 0;

  const sub = quantityPriceWithDiscount + addonsCost + turnaroundFee;
  const deliveryFee = sub >= freeDeliveryThreshold
    ? 0
    : (deliveryZones[input.deliveryZone as keyof typeof deliveryZones] ?? 0);

  const total = Math.max(0, Math.round(sub + deliveryFee));

  return {
    basePrice: base * quantity,
    optionCosts: optionCostPerUnit * quantity,
    quantityDiscount,
    addonsCost,
    turnaroundFee,
    deliveryFee,
    total,
    unitPrice: total > 0 && quantity > 0 ? Math.round(total / quantity) : 0,
    selectedTier: tier,
  };
}
