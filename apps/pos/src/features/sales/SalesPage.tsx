import { useMemo, useState } from 'react';
import { formatKes } from '../../../../../packages/shared/utils';
import { customers } from '../../data/mockData';
import { productService } from '../../services/productService';
import { salesService } from '../../services/salesService';
import { useBranch } from '../../stores/branchStore';

export function SalesPage() {
  const { branchId } = useBranch();
  const [query, setQuery] = useState('');
  const [discount, setDiscount] = useState(0);
  const [vatRate, setVatRate] = useState(16);
  const [customerId, setCustomerId] = useState(customers[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card' | 'bank'>('cash');
  const [cart, setCart] = useState<Array<{ productId: string; name: string; quantity: number; unitPrice: number; discount: number; vatRate: number }>>([]);

  const products = productService.getAll();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vat = Math.max(0, subtotal - discount) * (vatRate / 100);
  const total = Math.max(0, subtotal - discount + vat);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) return prev.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...prev, { productId: product.id, name: product.name, quantity: 1, unitPrice: product.retailPrice, discount: 0, vatRate: product.vatRate }];
    });
  };

  const completeSale = () => {
    if (!cart.length) return;
    salesService.createSale({ branchId, customerId, items: cart, discount, vatRate, paymentMethod, userId: 'usr_admin' });
    setCart([]);
    alert('Sale completed and stock updated.');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Sales Screen</h2>
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" placeholder="Search products / barcode" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((product) => (
            <button key={product.id} className="text-left border border-slate-200 rounded-xl p-3.5 hover:border-[#2B59C3] hover:bg-blue-50/40 transition" onClick={() => addToCart(product)}>
              <p className="font-semibold text-slate-900">{product.name}</p><p className="text-xs text-slate-500 mt-1">Retail {formatKes(product.retailPrice)} | Wholesale {formatKes(product.wholesalePrice)}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
        <h3 className="font-semibold text-slate-900">Cart / Receipt Preview</h3>
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm border-b border-slate-100 py-2">
            <span className="text-slate-700">{item.name}</span>
            <div className="flex gap-2 items-center">
              <button className="h-7 w-7 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => setCart((prev) => prev.map((x) => x.productId === item.productId ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x))}>-</button>
              <span className="w-5 text-center font-medium">{item.quantity}</span>
              <button className="h-7 w-7 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => setCart((prev) => prev.map((x) => x.productId === item.productId ? { ...x, quantity: x.quantity + 1 } : x))}>+</button>
            </div>
          </div>
        ))}
        <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} placeholder="Discount" />
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" type="number" value={vatRate} onChange={(e) => setVatRate(Number(e.target.value) || 0)} placeholder="VAT %" />
        <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
          <option value="cash">Cash</option><option value="mpesa">M-Pesa</option><option value="card">Card</option><option value="bank">Bank</option>
        </select>
        <div className="text-sm rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
          <p className="flex justify-between"><span className="text-slate-600">Subtotal</span><b className="text-slate-900">{formatKes(subtotal)}</b></p>
          <p className="flex justify-between"><span className="text-slate-600">VAT</span><b className="text-slate-900">{formatKes(vat)}</b></p>
          <p className="flex justify-between text-base"><span className="font-semibold text-slate-800">Total</span><b className="font-bold text-[#EF233C]">{formatKes(total)}</b></p>
        </div>
        <button className="w-full bg-[#EF233C] text-white rounded-lg py-2.5 font-semibold hover:bg-[#d61f35] transition shadow-sm" onClick={completeSale}>Complete Sale</button>
      </div>
    </div>
  );
}
