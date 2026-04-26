import { Product as WebsiteProduct } from '../data/products';

type PosProduct = { id: string; name: string };
type PosInventory = { productId: string; quantityOnHand: number };

const POS_PRODUCTS_KEY = 'bureau.pos.products';
const POS_INVENTORY_KEY = 'bureau.pos.inventory';

export function getWebsiteStockStatus(product: WebsiteProduct): { available: boolean; quantity?: number } {
  const rawProducts = localStorage.getItem(POS_PRODUCTS_KEY);
  const rawInventory = localStorage.getItem(POS_INVENTORY_KEY);
  if (!rawProducts || !rawInventory) return { available: true };

  try {
    const products = JSON.parse(rawProducts) as PosProduct[];
    const inventory = JSON.parse(rawInventory) as PosInventory[];
    const posProduct = products.find((item) => product.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]));
    if (!posProduct) return { available: true };
    const qty = inventory.filter((item) => item.productId === posProduct.id).reduce((sum, item) => sum + item.quantityOnHand, 0);
    return { available: qty > 0, quantity: qty };
  } catch {
    return { available: true };
  }
}
