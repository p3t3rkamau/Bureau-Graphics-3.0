import { generateId, nowIso } from '../../../../packages/shared/utils';
import { Expense } from '../types';
import { dbKeys, read, write } from './db';

export const EXPENSE_CATEGORIES = [
  'Rent', 'Utilities', 'Transport', 'Salaries', 'Printing Supplies',
  'Equipment', 'Marketing', 'Maintenance', 'Taxes', 'Other',
];

export const expenseService = {
  getAll(): Expense[] {
    return read(dbKeys.expenses, [] as Expense[]);
  },
  create(data: Omit<Expense, 'id' | 'incurredAt'> & { incurredAt?: string }): Expense {
    const expense: Expense = {
      ...data,
      id: generateId('exp'),
      incurredAt: data.incurredAt ?? nowIso(),
    };
    const list = this.getAll();
    list.unshift(expense);
    write(dbKeys.expenses, list);
    return expense;
  },
  update(id: string, data: Partial<Omit<Expense, 'id'>>): void {
    write(dbKeys.expenses, this.getAll().map((e) => (e.id === id ? { ...e, ...data } : e)));
  },
  delete(id: string): void {
    write(dbKeys.expenses, this.getAll().filter((e) => e.id !== id));
  },
  totalByCategory(): Record<string, number> {
    return this.getAll().reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {});
  },
};
