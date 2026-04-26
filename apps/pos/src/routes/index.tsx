import { createBrowserRouter } from 'react-router';
import { PosLayout } from '../layouts/PosLayout';
import { DashboardPage } from '../features/reports/DashboardPage';
import { SalesPage } from '../features/sales/SalesPage';
import { InvoicesPage } from '../features/invoices/InvoicesPage';
import { QuotationsPage } from '../features/quotations/QuotationsPage';
import { MpesaPage } from '../features/mpesa/MpesaPage';
import { ModulePlaceholder } from '../components/ModulePlaceholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PosLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'products', element: <ModulePlaceholder title="Products" notes="API-ready products CRUD, barcode support and category setup." /> },
      { path: 'inventory', element: <ModulePlaceholder title="Inventory" notes="Stock in/out, adjustments, damages, returns, transfers, expiry and reorder alerts by branch." /> },
      { path: 'purchases', element: <ModulePlaceholder title="Purchases" notes="Supplier purchasing workflows and GRN-style stock in." /> },
      { path: 'suppliers', element: <ModulePlaceholder title="Suppliers" notes="Supplier ledger / creditors and payment history module." /> },
      { path: 'customers', element: <ModulePlaceholder title="Customers" notes="Customer profile, credit limit controls, and debtors ledger." /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'quotations', element: <QuotationsPage /> },
      { path: 'reports', element: <DashboardPage /> },
      { path: 'expenses', element: <ModulePlaceholder title="Expenses" notes="Categorized expenses and accounting export hooks." /> },
      { path: 'mpesa', element: <MpesaPage /> },
      { path: 'branches', element: <ModulePlaceholder title="Branches" notes="Multi-branch setup and branch-specific controls." /> },
      { path: 'users', element: <ModulePlaceholder title="Users & Access" notes="RBAC matrix and audit-ready access logs." /> },
      { path: 'hr', element: <ModulePlaceholder title="HR" notes="Employee records, department setup and payroll API hook." /> },
      { path: 'loyalty', element: <ModulePlaceholder title="Loyalty & Bulk SMS" notes="Loyalty points and outbound SMS integration points." /> },
    ],
  },
]);
