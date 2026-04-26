import { invoiceService } from '../../services/invoiceService';

export function InvoicesPage() {
  const invoices = invoiceService.getAll();
  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="text-xl font-semibold mb-3">Invoices</h2>
      <table className="w-full text-sm"><thead><tr><th className="text-left">Invoice</th><th>Status</th><th>Total</th><th>Due Date</th><th /></tr></thead><tbody>{invoices.map((inv) => <tr key={inv.id}><td>{inv.id}</td><td>{inv.status}</td><td>{inv.total}</td><td>{inv.dueDate.slice(0,10)}</td><td><button onClick={() => { invoiceService.convertToSale(inv.id); alert('Converted to sale'); }}>Invoice → Sale</button></td></tr>)}</tbody></table>
    </div>
  );
}
