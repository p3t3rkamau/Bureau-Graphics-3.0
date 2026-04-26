import { StatCard } from '../../components/StatCard';
import { reportService } from '../../services/reportService';

export function DashboardPage() {
  const data = reportService.getDashboard();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">POS Dashboard</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <StatCard title="Today's Sales" value={data.todaySalesCount} />
        <StatCard title="Today's Revenue" value={data.todayRevenue} />
        <StatCard title="Pending Invoices" value={data.pendingInvoices} />
        <StatCard title="Pending Quotations" value={data.pendingQuotations} />
        <StatCard title="Expenses Summary" value={data.expenseTotal} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold mb-2">Low Stock Alerts</h3>
          <ul className="text-sm space-y-1">{data.lowStock.map((item: any) => <li key={item.id}>Product {item.productId}: {item.quantityOnHand}</li>)}</ul>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold mb-2">Top Selling Products</h3>
          <ul className="text-sm space-y-1">{data.topSelling.map(([name, qty]: any) => <li key={name}>{name} — {qty} sold</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
