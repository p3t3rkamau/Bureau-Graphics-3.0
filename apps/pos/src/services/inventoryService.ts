import { applyStockMovement, getLowStockItems } from '../../../../packages/shared/inventory';
import { InventoryItem, Product, StockMovement, StockMovementType } from '../types';
import { dbKeys, read, write } from './db';
import { generateId, nowIso } from '../../../../packages/shared/utils';

const movementKey = 'bureau.pos.stockMovements';

export const inventoryService = {
  getAll(): InventoryItem[] {
    return read(dbKeys.inventory, [] as InventoryItem[]);
  },
  getMovements(): StockMovement[] {
    return read(movementKey, [] as StockMovement[]);
  },
  adjustStock(params: { productId: string; branchId: string; type: StockMovementType; quantity: number; reason?: string; userId: string }) {
    const items = this.getAll();
    const target = items.find((item) => item.productId === params.productId && item.branchId === params.branchId);
    if (!target) return;
    const updated = applyStockMovement(target, params.type, params.quantity);
    const next = items.map((item) => (item.id === target.id ? updated : item));
    write(dbKeys.inventory, next);

    const movements = this.getMovements();
    movements.unshift({ id: generateId('mov'), productId: params.productId, branchId: params.branchId, type: params.type, quantity: params.quantity, reason: params.reason, createdBy: params.userId, createdAt: nowIso() });
    write(movementKey, movements);
    window.dispatchEvent(new Event('inventory-sync'));
  },
  getLowStock(products: Product[]) {
    return getLowStockItems(this.getAll(), products);
  },
  getExpiryAlerts(days = 30) {
    const today = Date.now();
    return this.getAll().filter((item) => item.expiryDate && (new Date(item.expiryDate).getTime() - today) / (1000 * 60 * 60 * 24) <= days);
  },
};
