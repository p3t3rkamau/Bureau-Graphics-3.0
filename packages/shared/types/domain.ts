export type ID = string;

export type RoleName = 'admin' | 'manager' | 'cashier' | 'inventory' | 'accountant' | 'hr';
export type PaymentMethod = 'cash' | 'mpesa' | 'card' | 'bank';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
export type MpesaStatus = 'pending' | 'confirmed' | 'failed' | 'reversed';
export type StockMovementType = 'sale' | 'purchase' | 'adjustment' | 'return' | 'damage' | 'transfer';

export interface Branch {
  id: ID;
  name: string;
  code: string;
  location: string;
  isActive: boolean;
}

export interface Role {
  id: ID;
  name: RoleName;
  permissions: string[];
}

export interface User {
  id: ID;
  branchId: ID;
  fullName: string;
  email: string;
  phone?: string;
  role: RoleName;
  isActive: boolean;
}

export interface Product {
  id: ID;
  sku: string;
  name: string;
  categoryId: ID;
  productType: 'stock' | 'service';
  retailPrice: number;
  wholesalePrice: number;
  reorderLevel: number;
  vatRate: number;
}

export interface ProductCategory {
  id: ID;
  name: string;
}

export interface InventoryItem {
  id: ID;
  productId: ID;
  branchId: ID;
  quantityOnHand: number;
  reservedQuantity: number;
  expiryDate?: string;
  updatedAt: string;
}

export interface StockMovement {
  id: ID;
  productId: ID;
  branchId: ID;
  type: StockMovementType;
  quantity: number;
  unitCost?: number;
  reason?: string;
  referenceId?: ID;
  createdBy: ID;
  createdAt: string;
}

export interface Customer {
  id: ID;
  name: string;
  email?: string;
  phone: string;
  creditLimit: number;
  loyaltyPoints: number;
  currentBalance: number;
}

export interface Supplier {
  id: ID;
  name: string;
  email?: string;
  phone: string;
  currentBalance: number;
}

export interface SaleItem {
  productId: ID;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  vatRate: number;
}

export interface Payment {
  id: ID;
  saleId?: ID;
  invoiceId?: ID;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  paidAt: string;
}

export interface Sale {
  id: ID;
  branchId: ID;
  customerId?: ID;
  items: SaleItem[];
  subtotal: number;
  discountTotal: number;
  vatTotal: number;
  total: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod: PaymentMethod;
  createdAt: string;
  createdBy: ID;
}

export interface Purchase {
  id: ID;
  branchId: ID;
  supplierId: ID;
  items: Array<{ productId: ID; quantity: number; unitCost: number; expiryDate?: string }>;
  totalCost: number;
  createdAt: string;
}

export interface Invoice {
  id: ID;
  branchId: ID;
  customerId: ID;
  items: SaleItem[];
  subtotal: number;
  vatTotal: number;
  discountTotal?: number;
  total: number;
  dueDate: string;
  paymentTermDays?: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
}

export interface Quotation {
  id: ID;
  branchId: ID;
  customerId: ID;
  items: SaleItem[];
  subtotal: number;
  vatTotal: number;
  total: number;
  validUntil: string;
  status: QuotationStatus;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: ID;
  branchId: ID;
  category: string;
  amount: number;
  description: string;
  incurredAt: string;
}

export interface MpesaTransaction {
  id: ID;
  saleId?: ID;
  invoiceId?: ID;
  reference: string;
  phoneNumber: string;
  amount: number;
  status: MpesaStatus;
  createdAt: string;
}

export interface LoyaltyAccount {
  id: ID;
  customerId: ID;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Employee {
  id: ID;
  branchId: ID;
  fullName: string;
  department: string;
  position: string;
  salary: number;
  active: boolean;
}

export interface WebsiteOrderRequest {
  id: ID;
  source: 'website';
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  notes?: string;
  createdAt: string;
  status: 'new' | 'processing' | 'closed';
}
