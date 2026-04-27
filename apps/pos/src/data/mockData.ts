import { Branch, Customer, Employee, Expense, InventoryItem, Invoice, MpesaTransaction, Product, ProductCategory, Purchase, Quotation, Sale, Supplier, User, WebsiteOrderRequest } from '../types';

export const branches: Branch[] = [
  { id: 'br_1', name: 'Nairobi CBD', code: 'NBO-CBD', location: 'Tom Mboya St', isActive: true },
  { id: 'br_2', name: 'Westlands', code: 'NBO-WEST', location: 'Westlands Ave', isActive: true },
];

export const categories: ProductCategory[] = [
  { id: 'cat_flyers', name: 'Flyers & Leaflets' },
  { id: 'cat_banners', name: 'Banners & Signage' },
  { id: 'cat_apparel', name: 'Branded Apparel' },
  { id: 'cat_cards', name: 'Business Cards' },
  { id: 'cat_booklets', name: 'Booklets & Brochures' },
  { id: 'cat_posters', name: 'Posters' },
  { id: 'cat_stickers', name: 'Stickers & Labels' },
  { id: 'cat_services', name: 'Design Services' },
];

export const products: Product[] = [
  // Flyers
  { id: 'prod_flyer_a4_ds', sku: 'FLY-A4-DS', name: 'A4 Flyer (Double Sided, Art 150gsm)', categoryId: 'cat_flyers', productType: 'stock', retailPrice: 58, wholesalePrice: 48, reorderLevel: 200, vatRate: 16 },
  { id: 'prod_flyer_a4_ss', sku: 'FLY-A4-SS', name: 'A4 Flyer (Single Sided, Bond)', categoryId: 'cat_flyers', productType: 'stock', retailPrice: 45, wholesalePrice: 38, reorderLevel: 200, vatRate: 16 },
  { id: 'prod_flyer_a5_ds', sku: 'FLY-A5-DS', name: 'A5 Flyer (Double Sided, Art 150gsm)', categoryId: 'cat_flyers', productType: 'stock', retailPrice: 50, wholesalePrice: 42, reorderLevel: 200, vatRate: 16 },
  { id: 'prod_flyer_a6_ss', sku: 'FLY-A6-SS', name: 'A6 Flyer (Single Sided)', categoryId: 'cat_flyers', productType: 'stock', retailPrice: 35, wholesalePrice: 28, reorderLevel: 300, vatRate: 16 },
  { id: 'prod_flyer_dl', sku: 'FLY-DL-DS', name: 'DL Flyer (Double Sided)', categoryId: 'cat_flyers', productType: 'stock', retailPrice: 48, wholesalePrice: 40, reorderLevel: 200, vatRate: 16 },

  // Banners
  { id: 'prod_banner_narrow', sku: 'BAN-NARROW-PVC', name: 'Rollup Banner Narrow (PVC)', categoryId: 'cat_banners', productType: 'stock', retailPrice: 6500, wholesalePrice: 6000, reorderLevel: 5, vatRate: 16 },
  { id: 'prod_banner_broad', sku: 'BAN-BROAD-PVC', name: 'Rollup Banner Broad (PVC)', categoryId: 'cat_banners', productType: 'stock', retailPrice: 8500, wholesalePrice: 7800, reorderLevel: 5, vatRate: 16 },
  { id: 'prod_banner_narrow_prem', sku: 'BAN-NARROW-PREM', name: 'Rollup Banner Narrow (Premium)', categoryId: 'cat_banners', productType: 'stock', retailPrice: 7100, wholesalePrice: 6500, reorderLevel: 3, vatRate: 16 },
  { id: 'prod_banner_mesh', sku: 'BAN-MESH', name: 'Mesh Banner (Outdoor)', categoryId: 'cat_banners', productType: 'stock', retailPrice: 9400, wholesalePrice: 8600, reorderLevel: 3, vatRate: 16 },

  // T-shirts
  { id: 'prod_tshirt_white', sku: 'TSH-WHT-M', name: 'Branded T-Shirt White (Text, Front)', categoryId: 'cat_apparel', productType: 'stock', retailPrice: 800, wholesalePrice: 700, reorderLevel: 30, vatRate: 16 },
  { id: 'prod_tshirt_color', sku: 'TSH-CLR-M', name: 'Branded T-Shirt Color (Image, Front)', categoryId: 'cat_apparel', productType: 'stock', retailPrice: 1050, wholesalePrice: 920, reorderLevel: 30, vatRate: 16 },
  { id: 'prod_tshirt_dtf', sku: 'TSH-DTF-M', name: 'Branded T-Shirt (DTF, Both Sides)', categoryId: 'cat_apparel', productType: 'stock', retailPrice: 1250, wholesalePrice: 1100, reorderLevel: 20, vatRate: 16 },
  { id: 'prod_tshirt_embroid', sku: 'TSH-EMB-M', name: 'Branded T-Shirt (Embroidery)', categoryId: 'cat_apparel', productType: 'stock', retailPrice: 1500, wholesalePrice: 1300, reorderLevel: 10, vatRate: 16 },

  // Business Cards
  { id: 'prod_bizcard_std', sku: 'BC-STD-100', name: 'Business Cards 100 pcs (Single Side)', categoryId: 'cat_cards', productType: 'stock', retailPrice: 1500, wholesalePrice: 1300, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_bizcard_ds', sku: 'BC-DS-250', name: 'Business Cards 250 pcs (Double Side, Gloss)', categoryId: 'cat_cards', productType: 'stock', retailPrice: 3400, wholesalePrice: 3000, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_bizcard_lux', sku: 'BC-LUX-500', name: 'Business Cards 500 pcs (Matte Laminate, Rounded)', categoryId: 'cat_cards', productType: 'stock', retailPrice: 5800, wholesalePrice: 5200, reorderLevel: 0, vatRate: 16 },

  // Booklets
  { id: 'prod_booklet_8p', sku: 'BKL-8P-A4', name: 'A4 Booklet 8 Pages (Color, Staple)', categoryId: 'cat_booklets', productType: 'stock', retailPrice: 350, wholesalePrice: 300, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_booklet_16p', sku: 'BKL-16P-A4', name: 'A4 Booklet 16 Pages (Color, Staple)', categoryId: 'cat_booklets', productType: 'stock', retailPrice: 420, wholesalePrice: 360, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_booklet_32p', sku: 'BKL-32P-A4', name: 'A4 Booklet 32 Pages (Color, Perfect Bind)', categoryId: 'cat_booklets', productType: 'stock', retailPrice: 580, wholesalePrice: 500, reorderLevel: 0, vatRate: 16 },

  // Posters
  { id: 'prod_poster_a3', sku: 'POST-A3-GLO', name: 'A3 Poster (Gloss, 150gsm)', categoryId: 'cat_posters', productType: 'stock', retailPrice: 300, wholesalePrice: 250, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_poster_a2', sku: 'POST-A2-GLO', name: 'A2 Poster (Gloss, 200gsm)', categoryId: 'cat_posters', productType: 'stock', retailPrice: 600, wholesalePrice: 520, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_poster_a1', sku: 'POST-A1-MAT', name: 'A1 Poster (Matte, 200gsm)', categoryId: 'cat_posters', productType: 'stock', retailPrice: 900, wholesalePrice: 780, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_poster_framed', sku: 'POST-A3-FRM', name: 'A3 Poster (Framed, Basic)', categoryId: 'cat_posters', productType: 'stock', retailPrice: 1100, wholesalePrice: 950, reorderLevel: 0, vatRate: 16 },

  // Stickers
  { id: 'prod_sticker_vinyl_sm', sku: 'STK-VNL-SM', name: 'Vinyl Stickers Small (50 pcs)', categoryId: 'cat_stickers', productType: 'stock', retailPrice: 1000, wholesalePrice: 850, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_sticker_vinyl_lg', sku: 'STK-VNL-LG', name: 'Vinyl Stickers Large (50 pcs)', categoryId: 'cat_stickers', productType: 'stock', retailPrice: 1500, wholesalePrice: 1300, reorderLevel: 0, vatRate: 16 },
  { id: 'prod_sticker_holo', sku: 'STK-HOLO-100', name: 'Holographic Stickers (100 pcs)', categoryId: 'cat_stickers', productType: 'stock', retailPrice: 2500, wholesalePrice: 2200, reorderLevel: 0, vatRate: 16 },

  // Services
  { id: 'srv_design_logo', sku: 'SRV-LOGO', name: 'Logo Design', categoryId: 'cat_services', productType: 'service', retailPrice: 5000, wholesalePrice: 4000, reorderLevel: 0, vatRate: 0 },
  { id: 'srv_design_flyer', sku: 'SRV-FLY-DES', name: 'Flyer Design', categoryId: 'cat_services', productType: 'service', retailPrice: 1500, wholesalePrice: 1200, reorderLevel: 0, vatRate: 0 },
  { id: 'srv_design_banner', sku: 'SRV-BAN-DES', name: 'Banner Design', categoryId: 'cat_services', productType: 'service', retailPrice: 2000, wholesalePrice: 1600, reorderLevel: 0, vatRate: 0 },
  { id: 'srv_design_bc', sku: 'SRV-BC-DES', name: 'Business Card Design', categoryId: 'cat_services', productType: 'service', retailPrice: 1500, wholesalePrice: 1200, reorderLevel: 0, vatRate: 0 },
  { id: 'srv_design_full', sku: 'SRV-BRAND', name: 'Full Brand Kit Design', categoryId: 'cat_services', productType: 'service', retailPrice: 15000, wholesalePrice: 12000, reorderLevel: 0, vatRate: 0 },
  { id: 'srv_delivery', sku: 'SRV-DEL', name: 'Delivery (Nairobi)', categoryId: 'cat_services', productType: 'service', retailPrice: 400, wholesalePrice: 400, reorderLevel: 0, vatRate: 0 },
];

export const inventory: InventoryItem[] = [
  { id: 'inv_1', productId: 'prod_flyer_a4_ds', branchId: 'br_1', quantityOnHand: 2000, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_2', productId: 'prod_flyer_a4_ss', branchId: 'br_1', quantityOnHand: 1500, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_3', productId: 'prod_flyer_a5_ds', branchId: 'br_1', quantityOnHand: 1800, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_4', productId: 'prod_banner_narrow', branchId: 'br_1', quantityOnHand: 15, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_5', productId: 'prod_banner_broad', branchId: 'br_1', quantityOnHand: 10, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_6', productId: 'prod_tshirt_white', branchId: 'br_1', quantityOnHand: 80, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_7', productId: 'prod_tshirt_color', branchId: 'br_1', quantityOnHand: 60, reservedQuantity: 0, updatedAt: new Date().toISOString() },
  { id: 'inv_8', productId: 'prod_bizcard_std', branchId: 'br_1', quantityOnHand: 50, reservedQuantity: 0, updatedAt: new Date().toISOString() },
];

export const customers: Customer[] = [
  { id: 'cus_1', name: 'Acme Traders Ltd', email: 'acme@example.com', phone: '0711000001', creditLimit: 50000, loyaltyPoints: 120, currentBalance: 0 },
  { id: 'cus_2', name: 'Savanna Media Group', email: 'info@savanna.co.ke', phone: '0722000002', creditLimit: 80000, loyaltyPoints: 340, currentBalance: 5000 },
  { id: 'cus_3', name: 'Kenyatta University', email: 'procurement@ku.ac.ke', phone: '0700000003', creditLimit: 200000, loyaltyPoints: 800, currentBalance: 0 },
  { id: 'cus_4', name: 'Nairobi Events Co.', email: 'events@nairobieco.com', phone: '0733000004', creditLimit: 30000, loyaltyPoints: 60, currentBalance: 2500 },
  { id: 'cus_5', name: 'Walk-in Customer', phone: '0700000000', creditLimit: 0, loyaltyPoints: 0, currentBalance: 0 },
];

export const suppliers: Supplier[] = [
  { id: 'sup_1', name: 'Paper Mill Kenya', email: 'orders@papermill.co.ke', phone: '0722100001', currentBalance: 20000 },
  { id: 'sup_2', name: 'Ink & Toner Supplies', phone: '0711200002', currentBalance: 8500 },
  { id: 'sup_3', name: 'Fabric World EA', phone: '0733300003', currentBalance: 15000 },
];

export const sales: Sale[] = [];
export const purchases: Purchase[] = [];
export const invoices: Invoice[] = [];
export const quotations: Quotation[] = [];

export const expenses: Expense[] = [
  { id: 'exp_1', branchId: 'br_1', category: 'Transport', amount: 1200, description: 'Delivery fuel (CBD runs)', incurredAt: new Date().toISOString() },
  { id: 'exp_2', branchId: 'br_1', category: 'Utilities', amount: 8500, description: 'Monthly electricity bill', incurredAt: new Date().toISOString() },
  { id: 'exp_3', branchId: 'br_1', category: 'Rent', amount: 35000, description: 'Monthly shop rent', incurredAt: new Date().toISOString() },
];

export const mpesaTransactions: MpesaTransaction[] = [];

export const employees: Employee[] = [
  { id: 'emp_1', branchId: 'br_1', fullName: 'Jane Admin', department: 'Operations', position: 'Branch Manager', salary: 85000, active: true },
  { id: 'emp_2', branchId: 'br_1', fullName: 'John Cashier', department: 'Sales', position: 'Cashier', salary: 40000, active: true },
  { id: 'emp_3', branchId: 'br_1', fullName: 'Mary Designer', department: 'Creative', position: 'Graphic Designer', salary: 55000, active: true },
];

export const users: User[] = [
  { id: 'usr_admin', branchId: 'br_1', fullName: 'Admin User', email: 'admin@bureau.test', role: 'admin', isActive: true },
  { id: 'usr_cashier', branchId: 'br_1', fullName: 'John Cashier', email: 'cashier@bureau.test', role: 'cashier', isActive: true },
  { id: 'usr_accountant', branchId: 'br_1', fullName: 'Sarah Books', email: 'accounts@bureau.test', role: 'accountant', isActive: true },
];

export const websiteRequests: WebsiteOrderRequest[] = [
  { id: 'web_1', source: 'website', customerName: 'Mary Wanjiku', phone: '0712121212', productName: 'A4 Flyers', quantity: 500, createdAt: new Date().toISOString(), status: 'new', notes: 'Need by Friday, double-sided' },
  { id: 'web_2', source: 'website', customerName: 'James Omondi', phone: '0722333444', productName: 'Rollup Banner', quantity: 2, createdAt: new Date().toISOString(), status: 'new', notes: 'Event on Saturday, premium material' },
];
