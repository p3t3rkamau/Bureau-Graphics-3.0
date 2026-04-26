import { formatKes } from '../../../../packages/shared/utils';
import { dbKeys, read } from './db';

export const reportService = {
  getDashboard() {
    const sales = read(dbKeys.sales, [] as any[]);
    const expenses = read(dbKeys.expenses, [] as any[]);
    const invoices = read(dbKeys.invoices, [] as any[]);
    const quotations = read(dbKeys.quotations, [] as any[]);
    const mpesa = read(dbKeys.mpesa, [] as any[]);
    const inventory = read(dbKeys.inventory, [] as any[]);
    const products = read(dbKeys.products, [] as any[]);

    const todayKey = new Date().toISOString().slice(0, 10);
    const todaySales = sales.filter((s) => s.createdAt.slice(0, 10) === todayKey);
    const revenue = todaySales.reduce((sum, s) => sum + s.total, 0);
    const topProducts = new Map<string, number>();
    sales.forEach((sale) => sale.items.forEach((item: any) => topProducts.set(item.name, (topProducts.get(item.name) ?? 0) + item.quantity)));

    return {
      todaySalesCount: todaySales.length,
      todayRevenue: formatKes(revenue),
      pendingInvoices: invoices.filter((inv) => inv.status !== 'paid').length,
      pendingQuotations: quotations.filter((qt) => qt.status !== 'approved').length,
      expenseTotal: formatKes(expenses.reduce((sum, ex) => sum + ex.amount, 0)),
      recentMpesa: mpesa.slice(0, 5),
      lowStock: inventory.filter((item) => {
        const product = products.find((p: any) => p.id === item.productId);
        return product && item.quantityOnHand <= product.reorderLevel;
      }),
      topSelling: Array.from(topProducts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
    };
  },
};
