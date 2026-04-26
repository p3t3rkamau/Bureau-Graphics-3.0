import { useState } from 'react';
import { quotationService } from '../../services/invoiceService';
import { customers } from '../../data/mockData';
import { productService } from '../../services/productService';

export function QuotationsPage() {
  const products = productService.getAll();
  const [customerId, setCustomerId] = useState(customers[0].id);

  const createDemoQuotation = () => {
    const item = products[0];
    quotationService.create({ branchId: 'br_1', customerId, items: [{ productId: item.id, name: item.name, quantity: 100, unitPrice: item.retailPrice, discount: 0, vatRate: item.vatRate }], subtotal: item.retailPrice * 100, vatTotal: 0, total: item.retailPrice * 100, validUntil: new Date(Date.now() + 5 * 86400000).toISOString() });
    alert('Quotation created');
  };

  const quotations = quotationService.getAll();

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3">
      <h2 className="text-xl font-semibold">Quotations</h2>
      <div className="flex gap-2">
        <select className="border rounded p-2" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <button className="px-4 py-2 rounded bg-[#2B59C3] text-white" onClick={createDemoQuotation}>Create quotation</button>
      </div>
      <table className="w-full text-sm"><thead><tr><th className="text-left">ID</th><th>Status</th><th>Total</th><th /></tr></thead><tbody>{quotations.map((q) => <tr key={q.id}><td>{q.id}</td><td>{q.status}</td><td>{q.total}</td><td><button onClick={() => { quotationService.convertToInvoice(q.id); alert('Converted to invoice'); }}>To Invoice</button></td></tr>)}</tbody></table>
    </div>
  );
}
