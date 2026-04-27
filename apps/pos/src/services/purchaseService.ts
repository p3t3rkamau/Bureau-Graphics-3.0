import { generateId, nowIso } from '../../../../packages/shared/utils';
import { Purchase } from '../types';
import { dbKeys, read, write } from './db';
import { inventoryService } from './inventoryService';

export const purchaseService = {
  getAll(): Purchase[] {
    return read(dbKeys.purchases, [] as Purchase[]);
  },
  create(data: {
    branchId: string;
    supplierId: string;
    items: Array<{ productId: string; quantity: number; unitCost: number; expiryDate?: string }>;
    userId: string;
  }): Purchase {
    const totalCost = data.items.reduce((s, i) => s + i.quantity * i.unitCost, 0);
    const purchase: Purchase = {
      id: generateId('po'),
      branchId: data.branchId,
      supplierId: data.supplierId,
      items: data.items,
      totalCost,
      createdAt: nowIso(),
    };

    const list = this.getAll();
    list.unshift(purchase);
    write(dbKeys.purchases, list);

    // Receive stock for each item
    data.items.forEach((item) => {
      const inventory = inventoryService.getAll();
      const existing = inventory.find(
        (i) => i.productId === item.productId && i.branchId === data.branchId,
      );
      if (existing) {
        inventoryService.adjustStock({
          productId: item.productId,
          branchId: data.branchId,
          type: 'purchase',
          quantity: item.quantity,
          reason: `Purchase Order ${purchase.id}`,
          userId: data.userId,
        });
      }
    });

    return purchase;
  },
};
