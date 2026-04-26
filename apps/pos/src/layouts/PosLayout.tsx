import { Link, Outlet, useLocation } from 'react-router';
import { branches } from '../data/mockData';
import { useAuth } from '../stores/authStore';
import { useBranch } from '../stores/branchStore';
import { canAccess } from '../utils/rbac';
import { PosModule, RoleName } from '../types';

const nav: Array<{ to: string; module: PosModule; label: string }> = [
  { to: '/', module: 'dashboard', label: 'Dashboard' },
  { to: '/sales', module: 'sales', label: 'Sales POS' },
  { to: '/products', module: 'products', label: 'Products' },
  { to: '/inventory', module: 'inventory', label: 'Inventory' },
  { to: '/purchases', module: 'purchases', label: 'Purchases' },
  { to: '/suppliers', module: 'suppliers', label: 'Suppliers' },
  { to: '/customers', module: 'customers', label: 'Customers' },
  { to: '/invoices', module: 'invoices', label: 'Invoices' },
  { to: '/quotations', module: 'quotations', label: 'Quotations' },
  { to: '/reports', module: 'reports', label: 'Reports' },
  { to: '/expenses', module: 'expenses', label: 'Expenses' },
  { to: '/mpesa', module: 'mpesa', label: 'M-Pesa' },
  { to: '/branches', module: 'branches', label: 'Branches' },
  { to: '/users', module: 'users', label: 'Users & Roles' },
  { to: '/hr', module: 'hr', label: 'HR' },
  { to: '/loyalty', module: 'loyalty', label: 'Loyalty/SMS' },
];

export function PosLayout() {
  const { pathname } = useLocation();
  const { user, setRole } = useAuth();
  const { branchId, setBranchId } = useBranch();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-60 bg-[#111827] text-white p-4 space-y-2">
        <h1 className="text-xl font-bold">Bureau POS</h1>
        <p className="text-xs text-gray-400">Scalable multi-branch print ERP</p>
        <nav className="mt-4 space-y-1">
          {nav.filter((item) => canAccess(user.role, item.module)).map((item) => (
            <Link key={item.to} to={item.to} className={`block rounded px-3 py-2 text-sm ${pathname === item.to ? 'bg-[#2B59C3]' : 'hover:bg-gray-700'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <div className="bg-white border rounded-xl p-3 mb-4 flex flex-wrap gap-3 items-center">
          <select value={user.role} onChange={(e) => setRole(e.target.value as RoleName)} className="border rounded p-2 text-sm">
            <option value="admin">admin</option><option value="manager">manager</option><option value="cashier">cashier</option><option value="inventory">inventory</option><option value="accountant">accountant</option><option value="hr">hr</option>
          </select>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="border rounded p-2 text-sm">
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
          <span className="text-sm text-gray-500">Logged in as <b>{user.fullName}</b></span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
