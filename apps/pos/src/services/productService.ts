import { Product } from '../types';
import { dbKeys, read, write } from './db';

export const productService = {
  getAll(): Product[] {
    return read(dbKeys.products, [] as Product[]);
  },
  saveAll(products: Product[]) {
    write(dbKeys.products, products);
    window.dispatchEvent(new Event('inventory-sync'));
  },
};
