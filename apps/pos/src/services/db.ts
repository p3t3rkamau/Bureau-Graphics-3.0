import * as seed from '../data/mockData';
import { getStorage, setStorage } from './storage';

const KEYS = {
  products: 'bureau.pos.products',
  inventory: 'bureau.pos.inventory',
  sales: 'bureau.pos.sales',
  purchases: 'bureau.pos.purchases',
  customers: 'bureau.pos.customers',
  suppliers: 'bureau.pos.suppliers',
  invoices: 'bureau.pos.invoices',
  quotations: 'bureau.pos.quotations',
  expenses: 'bureau.pos.expenses',
  mpesa: 'bureau.pos.mpesa',
  websiteRequests: 'bureau.pos.websiteRequests',
  branches: 'bureau.pos.branches',
  users: 'bureau.pos.users',
  categories: 'bureau.pos.categories',
};

export const initDb = () => {
  Object.entries(KEYS).forEach(([name, key]) => {
    if (!localStorage.getItem(key)) {
      // @ts-expect-error dynamic seed key mapping
      setStorage(key, seed[name]);
    }
  });
};

export const dbKeys = KEYS;
export const read = getStorage;
export const write = setStorage;
