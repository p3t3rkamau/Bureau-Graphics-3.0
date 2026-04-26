import { deliveryZones, freeDeliveryThreshold, pricingConfig, turnaroundFees } from './config';
import { PricingBreakdown, PricingInput, ProductPricingRule, QuantityTier } from './types';

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) return 0;
  return Math.floor(quantity);
}

export function getUnitPrice(qty: number, tiers: QuantityTier[] = []): QuantityTier | undefined {
  if (!tiers.length || qty <= 0) return undefined;
  return tiers
    .slice()
    .sort((a, b) => a.qty - b.qty)
    .reduce<QuantityTier | undefined>((selected, tier) => (qty >= tier.qty ? tier : selected), undefined);
}

export function calculateBase(input: PricingInput, rule: ProductPricingRule): number {
  if (input.productType === 'flyer') return 0;
  if (input.productType === 'banner') return Number(input.options.size ? rule.optionGroups?.size?.[String(input.options.size)] ?? 0 : 0);
  return rule.basePrice ?? 0;
}

export function applyOptions(input: PricingInput, rule: ProductPricingRule): number {
  const optionGroups = rule.optionGroups ?? {};
  return Object.entries(input.options).reduce((total, [optionKey, selected]) => {
    if (selected === undefined || selected === false) return total;
    const group = optionGroups[optionKey];
    if (!group) return total;
    return total + (group[String(selected)] ?? 0);
  }, 0);
}

export function applyQuantityPricing(input: PricingInput, rule: ProductPricingRule, runningUnitPrice: number): { quantityPrice: number; discount: number; selectedTier?: QuantityTier } {
  const selectedTier = getUnitPrice(input.quantity, rule.quantityTiers);
  const unitAdjustment = selectedTier?.unitPrice ?? 0;
  const unitPrice = runningUnitPrice + unitAdjustment;
  const quantityPrice = unitPrice * input.quantity;
  const discount = unitAdjustment < 0 ? Math.abs(unitAdjustment) * input.quantity : 0;
  return { quantityPrice, discount, selectedTier };
}

export function applyAddons(input: PricingInput, rule: ProductPricingRule): number {
  const addons = rule.addons ?? {};
  return Object.entries(addons).reduce((sum, [addonKey, addonCost]) => {
    return input.options[addonKey] ? sum + addonCost : sum;
  }, 0);
}

export function applyTurnaround(input: PricingInput): number {
  return turnaroundFees[input.turnaround ?? 'standard'] ?? 0;
}

export function applyDelivery(subtotalBeforeDelivery: number, deliveryZone?: string): number {
  if (!deliveryZone) return 0;
  if (subtotalBeforeDelivery >= freeDeliveryThreshold) return 0;
  return deliveryZones[deliveryZone] ?? 0;
}

export function calculatePrice(input: PricingInput): PricingBreakdown {
  const quantity = clampQuantity(input.quantity);
  const safeInput: PricingInput = { ...input, quantity };
  const rule = pricingConfig[safeInput.productType];

  if (!rule || quantity === 0) {
    return {
      basePrice: 0,
      optionCosts: 0,
      quantityDiscount: 0,
      addonsCost: 0,
      deliveryFee: 0,
      turnaroundFee: 0,
      total: 0,
    };
  }

  const basePrice = calculateBase(safeInput, rule);
  const optionCosts = applyOptions(safeInput, rule);
  const runningUnitPrice = basePrice + optionCosts;

  const { quantityPrice, discount, selectedTier } = applyQuantityPricing(safeInput, rule, runningUnitPrice);
  const addonsCost = applyAddons(safeInput, rule);
  const turnaroundFee = applyTurnaround(safeInput);

  const subtotalBeforeDelivery = quantityPrice + addonsCost + turnaroundFee;
  const deliveryFee = applyDelivery(subtotalBeforeDelivery, safeInput.deliveryZone);

  return {
    basePrice: basePrice * quantity,
    optionCosts: optionCosts * quantity,
    quantityDiscount: discount,
    addonsCost,
    turnaroundFee,
    deliveryFee,
    total: Math.max(0, Math.round(subtotalBeforeDelivery + deliveryFee)),
    selectedTier,
  };
}
