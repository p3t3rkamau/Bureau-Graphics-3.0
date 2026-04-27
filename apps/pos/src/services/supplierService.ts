import { generateId } from '../../../../packages/shared/utils';
import { Supplier } from '../types';
import { dbKeys, read, write } from './db';

export const supplierService = {
  getAll(): Supplier[] {
    return read(dbKeys.suppliers, [] as Supplier[]);
  },
  getById(id: string): Supplier | undefined {
    return this.getAll().find((s) => s.id === id);
  },
  create(data: Omit<Supplier, 'id'>): Supplier {
    const supplier: Supplier = { ...data, id: generateId('sup') };
    const list = this.getAll();
    list.unshift(supplier);
    write(dbKeys.suppliers, list);
    return supplier;
  },
  update(id: string, data: Partial<Omit<Supplier, 'id'>>): void {
    write(dbKeys.suppliers, this.getAll().map((s) => (s.id === id ? { ...s, ...data } : s)));
  },
  delete(id: string): void {
    write(dbKeys.suppliers, this.getAll().filter((s) => s.id !== id));
  },
};
