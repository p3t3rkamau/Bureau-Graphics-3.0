import { PosModule, RoleName } from '../types';

const permissions: Record<RoleName, PosModule[]> = {
  admin: ['dashboard', 'sales', 'products', 'inventory', 'purchases', 'suppliers', 'customers', 'invoices', 'quotations', 'reports', 'expenses', 'mpesa', 'branches', 'users', 'hr', 'loyalty'],
  manager: ['dashboard', 'sales', 'products', 'inventory', 'purchases', 'suppliers', 'customers', 'invoices', 'quotations', 'reports', 'expenses', 'mpesa', 'loyalty'],
  cashier: ['dashboard', 'sales', 'customers', 'invoices', 'quotations', 'mpesa', 'loyalty'],
  inventory: ['dashboard', 'products', 'inventory', 'purchases', 'suppliers'],
  accountant: ['dashboard', 'invoices', 'reports', 'expenses', 'customers', 'suppliers', 'mpesa'],
  hr: ['dashboard', 'hr', 'users'],
};

export const canAccess = (role: RoleName, module: PosModule) => permissions[role].includes(module);
