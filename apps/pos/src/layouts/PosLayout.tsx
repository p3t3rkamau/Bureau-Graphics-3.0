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
  const visibleNav = nav.filter((item) => canAccess(user.role, item.module));

  return (
    <div className="min-h-screen bg-transparent flex">
      <aside className="hidden lg:block w-72 bg-slate-950/95 text-slate-100 p-5 space-y-3 border-r border-slate-800 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Bureau POS</h1>
          <p className="text-xs text-slate-400 mt-1">Scalable multi-branch print ERP</p>
        </div>
        <nav className="mt-4 space-y-1.5">
          {visibleNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                pathname === item.to
                  ? 'bg-[#2B59C3] text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-3 sm:p-4 lg:p-6">
        <div className="lg:hidden bg-slate-950 text-slate-100 rounded-2xl p-4 mb-4 shadow-xl">
          <h1 className="text-lg font-bold tracking-tight">Bureau POS</h1>
          <p className="text-xs text-slate-400 mt-1">Scalable multi-branch print ERP</p>
          <nav className="mt-3 -mx-1 px-1 overflow-x-auto whitespace-nowrap">
            {visibleNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-block mr-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  pathname === item.to
                    ? 'bg-[#2B59C3] text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-3 sm:p-4 mb-4 lg:mb-5 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-center shadow-sm">
          <select
            value={user.role}
            onChange={(e) => setRole(e.target.value as RoleName)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
          >
            <option value="admin">admin</option><option value="manager">manager</option><option value="cashier">cashier</option><option value="inventory">inventory</option><option value="accountant">accountant</option><option value="hr">hr</option>
          </select>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
          >
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
          <span className="text-sm text-slate-600 sm:ml-auto">Logged in as <b className="text-slate-900">{user.fullName}</b></span>
        </div>
        <div className="rounded-2xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
