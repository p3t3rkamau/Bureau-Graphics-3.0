import { StatCard } from '../../components/StatCard';
import { reportService } from '../../services/reportService';

export function DashboardPage() {
  const data = reportService.getDashboard();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">POS Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Overview of sales, invoices, quotations, and stock health.</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard title="Today's Sales" value={data.todaySalesCount} />
        <StatCard title="Today's Revenue" value={data.todayRevenue} />
        <StatCard title="Pending Invoices" value={data.pendingInvoices} />
        <StatCard title="Pending Quotations" value={data.pendingQuotations} />
        <StatCard title="Expenses Summary" value={data.expenseTotal} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">Low Stock Alerts</h3>
          <ul className="text-sm text-slate-700 space-y-2">{data.lowStock.map((item: any) => <li key={item.id} className="flex justify-between border-b border-slate-100 pb-1"><span>Product {item.productId}</span><b>{item.quantityOnHand}</b></li>)}</ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">Top Selling Products</h3>
          <ul className="text-sm text-slate-700 space-y-2">{data.topSelling.map(([name, qty]: any) => <li key={name} className="flex justify-between border-b border-slate-100 pb-1"><span>{name}</span><b>{qty} sold</b></li>)}</ul>
        </div>
      </div>
    </div>
  );
}
