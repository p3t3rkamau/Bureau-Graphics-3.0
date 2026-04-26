import { shouldReduceStock } from '../../../../packages/shared/inventory';
import { generateId, nowIso } from '../../../../packages/shared/utils';
import { PaymentMethod, Sale, SaleItem } from '../types';
import { dbKeys, read, write } from './db';
import { inventoryService } from './inventoryService';
import { productService } from './productService';

export const salesService = {
  getAll(): Sale[] {
    return read(dbKeys.sales, [] as Sale[]);
  },
  createSale(input: { branchId: string; customerId?: string; items: SaleItem[]; discount: number; vatRate: number; paymentMethod: PaymentMethod; userId: string }): Sale {
    const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const discountTotal = input.discount;
    const taxable = Math.max(0, subtotal - discountTotal);
    const vatTotal = taxable * (input.vatRate / 100);
    const total = taxable + vatTotal;

    const sale: Sale = {
      id: generateId('sale'),
      branchId: input.branchId,
      customerId: input.customerId,
      items: input.items,
      subtotal,
      discountTotal,
      vatTotal,
      total,
      paymentStatus: 'paid',
      paymentMethod: input.paymentMethod,
      createdAt: nowIso(),
      createdBy: input.userId,
    };

    const sales = this.getAll();
    sales.unshift(sale);
    write(dbKeys.sales, sales);

    const products = productService.getAll();
    input.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product && shouldReduceStock(product)) {
        inventoryService.adjustStock({ productId: item.productId, branchId: input.branchId, type: 'sale', quantity: item.quantity, reason: `Sale ${sale.id}`, userId: input.userId });
      }
    });

    return sale;
  },
};
