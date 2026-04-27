import { generateId } from '../../../../packages/shared/utils';
import { Customer } from '../types';
import { dbKeys, read, write } from './db';

export const customerService = {
  getAll(): Customer[] {
    return read(dbKeys.customers, [] as Customer[]);
  },
  getById(id: string): Customer | undefined {
    return this.getAll().find((c) => c.id === id);
  },
  create(data: Omit<Customer, 'id'>): Customer {
    const customer: Customer = { ...data, id: generateId('cus') };
    const list = this.getAll();
    list.unshift(customer);
    write(dbKeys.customers, list);
    return customer;
  },
  update(id: string, data: Partial<Omit<Customer, 'id'>>): void {
    write(dbKeys.customers, this.getAll().map((c) => (c.id === id ? { ...c, ...data } : c)));
  },
  delete(id: string): void {
    write(dbKeys.customers, this.getAll().filter((c) => c.id !== id));
  },
};
