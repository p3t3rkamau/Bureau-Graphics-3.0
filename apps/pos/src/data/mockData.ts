import { Branch, Customer, Employee, Expense, InventoryItem, Invoice, MpesaTransaction, Product, ProductCategory, Purchase, Quotation, Sale, Supplier, User, WebsiteOrderRequest } from '../types';

export const branches: Branch[] = [
  { id: 'br_1', name: 'Nairobi CBD', code: 'NBO-CBD', location: 'Tom Mboya', isActive: true },
  { id: 'br_2', name: 'Westlands', code: 'NBO-WEST', location: 'Westlands', isActive: true },
];

export const categories: ProductCategory[] = [
  { id: 'cat_1', name: 'Flyers' },
  { id: 'cat_2', name: 'Banners' },
  { id: 'cat_3', name: 'Apparel' },
  { id: 'cat_4', name: 'Services' },
];

export const products: Product[] = [
  { id: 'prod_flyer', sku: 'FLY-A4-DS', name: 'A4 Flyer Double Sided', categoryId: 'cat_1', productType: 'stock', retailPrice: 50, wholesalePrice: 42, reorderLevel: 200, vatRate: 16 },
  { id: 'prod_banner', sku: 'BAN-NARROW', name: 'Rollup Banner Narrow', categoryId: 'cat_2', productType: 'stock', retailPrice: 6500, wholesalePrice: 6200, reorderLevel: 5, vatRate: 16 },
  { id: 'prod_tshirt', sku: 'TSH-CLR-M', name: 'Branded T-Shirt', categoryId: 'cat_3', productType: 'stock', retailPrice: 1150, wholesalePrice: 980, reorderLevel: 30, vatRate: 16 },
  { id: 'srv_design', sku: 'SRV-DESIGN', name: 'Design Service', categoryId: 'cat_4', productType: 'service', retailPrice: 1500, wholesalePrice: 1200, reorderLevel: 0, vatRate: 0 },
];

export const inventory: InventoryItem[] = [
  { id: 'inv_1', productId: 'prod_flyer', branchId: 'br_1', quantityOnHand: 1000, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_2', productId: 'prod_banner', branchId: 'br_1', quantityOnHand: 12, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_3', productId: 'prod_tshirt', branchId: 'br_1', quantityOnHand: 75, reservedQuantity: 0, expiryDate: '2027-01-01', updatedAt: new Date().toISOString() },
];

export const customers: Customer[] = [
  { id: 'cus_1', name: 'Acme Traders', phone: '0711000000', creditLimit: 50000, loyaltyPoints: 40, currentBalance: 0 },
  { id: 'cus_2', name: 'Walk-in Customer', phone: '0700000000', creditLimit: 0, loyaltyPoints: 0, currentBalance: 0 },
];

export const suppliers: Supplier[] = [{ id: 'sup_1', name: 'Paper Mill KE', phone: '0722000000', currentBalance: 20000 }];
export const sales: Sale[] = [];
export const purchases: Purchase[] = [];
export const invoices: Invoice[] = [];
export const quotations: Quotation[] = [];
export const expenses: Expense[] = [{ id: 'exp_1', branchId: 'br_1', category: 'Transport', amount: 1200, description: 'Delivery fuel', incurredAt: new Date().toISOString() }];
export const mpesaTransactions: MpesaTransaction[] = [];
export const employees: Employee[] = [{ id: 'emp_1', branchId: 'br_1', fullName: 'Jane Admin', department: 'Operations', position: 'Manager', salary: 85000, active: true }];
export const users: User[] = [
  { id: 'usr_admin', branchId: 'br_1', fullName: 'Admin User', email: 'admin@bureau.test', role: 'admin', isActive: true },
  { id: 'usr_cashier', branchId: 'br_1', fullName: 'Cashier User', email: 'cashier@bureau.test', role: 'cashier', isActive: true },
];

export const websiteRequests: WebsiteOrderRequest[] = [
  { id: 'web_1', source: 'website', customerName: 'Mary Wanjiku', phone: '0712121212', productName: 'Flyers Printing', quantity: 500, createdAt: new Date().toISOString(), status: 'new', notes: 'Need by Friday' },
];
