import { generateId, nowIso } from '../../../../packages/shared/utils';
import { InventoryItem, Product } from '../types';
import { dbKeys, read, write } from './db';

export const productService = {
  getAll(): Product[] {
    return read(dbKeys.products, [] as Product[]);
  },
  getById(id: string): Product | undefined {
    return this.getAll().find((p) => p.id === id);
  },
  create(data: Omit<Product, 'id'>): Product {
    const product: Product = { ...data, id: generateId('prod') };
    const list = this.getAll();
    list.unshift(product);
    write(dbKeys.products, list);

    // Auto-create inventory record for all branches if stock product
    if (product.productType === 'stock') {
      const branches = read('bureau.pos.branches', [] as Array<{ id: string }>);
      const inventory = read(dbKeys.inventory, [] as InventoryItem[]);
      branches.forEach((br) => {
        inventory.push({
          id: generateId('inv'),
          productId: product.id,
          branchId: br.id,
          quantityOnHand: 0,
          reservedQuantity: 0,
          updatedAt: nowIso(),
        });
      });
      write(dbKeys.inventory, inventory);
    }

    window.dispatchEvent(new Event('inventory-sync'));
    return product;
  },
  update(id: string, data: Partial<Omit<Product, 'id'>>): void {
    const list = this.getAll().map((p) => (p.id === id ? { ...p, ...data } : p));
    write(dbKeys.products, list);
    window.dispatchEvent(new Event('inventory-sync'));
  },
  delete(id: string): void {
    write(dbKeys.products, this.getAll().filter((p) => p.id !== id));
    const inv = read(dbKeys.inventory, [] as InventoryItem[]);
    write(dbKeys.inventory, inv.filter((i) => i.productId !== id));
    window.dispatchEvent(new Event('inventory-sync'));
  },
  saveAll(products: Product[]) {
    write(dbKeys.products, products);
    window.dispatchEvent(new Event('inventory-sync'));
  },
};
