import { ProductPricingRule, Turnaround } from './types';

export const deliveryZones: Record<string, number> = {
  cbd: 200,
  nairobi: 400,
  towns: 1150,
};

export const turnaroundFees: Record<Turnaround, number> = {
  standard: 0,
  express: 500,
  rush: 1500,
};

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
    addons: {
      designNeeded: 1500,
      artworkCleanup: 300,
    },
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
    addons: {
      designNeeded: 2000,
      standAssembly: 500,
    },
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
    addons: {
      designNeeded: 1200,
    },
  },
};
