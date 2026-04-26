import { InventoryItem, Product, StockMovement, StockMovementType } from '../types/domain';

export function applyStockMovement(item: InventoryItem, type: StockMovementType, quantity: number): InventoryItem {
  const next = { ...item };
  if (type === 'purchase' || type === 'return' || type === 'transfer') next.quantityOnHand += quantity;
  if (type === 'sale' || type === 'damage') next.quantityOnHand -= quantity;
  if (type === 'adjustment') next.quantityOnHand = quantity;
  next.updatedAt = new Date().toISOString();
  return next;
}

export function shouldReduceStock(product: Product): boolean {
  return product.productType === 'stock';
}

export function getLowStockItems(items: InventoryItem[], products: Product[]) {
  const productMap = new Map(products.map((p) => [p.id, p]));
  return items.filter((item) => {
    const product = productMap.get(item.productId);
    return product ? item.quantityOnHand <= product.reorderLevel : false;
  });
}

export function createMovement(params: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement {
  return {
    ...params,
    id: `mov_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  };
}
