import { createBrowserRouter } from 'react-router';
import { PosLayout } from '../layouts/PosLayout';
import { DashboardPage } from '../features/reports/DashboardPage';
import { SalesPage } from '../features/sales/SalesPage';
import { ProductsPage } from '../features/products/ProductsPage';
import { InventoryPage } from '../features/inventory/InventoryPage';
import { PurchasesPage } from '../features/purchases/PurchasesPage';
import { SuppliersPage } from '../features/suppliers/SuppliersPage';
import { CustomersPage } from '../features/customers/CustomersPage';
import { InvoicesPage } from '../features/invoices/InvoicesPage';
import { QuotationsPage } from '../features/quotations/QuotationsPage';
import { ExpensesPage } from '../features/expenses/ExpensesPage';
import { MpesaPage } from '../features/mpesa/MpesaPage';
import { ModulePlaceholder } from '../components/ModulePlaceholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PosLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'purchases', element: <PurchasesPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'quotations', element: <QuotationsPage /> },
      { path: 'reports', element: <DashboardPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'mpesa', element: <MpesaPage /> },
      { path: 'branches', element: <ModulePlaceholder title="Branches" notes="Multi-branch setup and branch-specific controls. API-ready." /> },
      { path: 'users', element: <ModulePlaceholder title="Users & Access" notes="RBAC matrix and audit-ready access logs. API-ready." /> },
      { path: 'hr', element: <ModulePlaceholder title="HR" notes="Employee records, department setup and payroll API hook. API-ready." /> },
      { path: 'loyalty', element: <ModulePlaceholder title="Loyalty & Bulk SMS" notes="Loyalty points and outbound SMS integration points. API-ready." /> },
    ],
  },
]);
