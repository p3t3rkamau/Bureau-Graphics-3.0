import React, { useMemo, useState } from 'react';
import { formatKes } from '../../../../../packages/shared/utils';
import { customers } from '../../data/mockData';
import { productService } from '../../services/productService';
import { salesService } from '../../services/salesService';
import { useBranch } from '../../stores/branchStore';

type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  vatRate: number;
};

function itemTotal(item: CartItem) {
  return item.quantity * item.unitPrice * (1 - item.discountPct / 100);
}

export function SalesPage() {
  const { branchId } = useBranch();
  const [query, setQuery] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [vatRate, setVatRate] = useState(16);
  const [customerId, setCustomerId] = useState(customers[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card' | 'bank'>('cash');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState('');
  const [receipt, setReceipt] = useState<{ id: string; total: number } | null>(null);

  const products = productService.getAll();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()),
  );

  const lineSubtotal = useMemo(() => cart.reduce((s, i) => s + itemTotal(i), 0), [cart]);
  const afterDiscount = Math.max(0, lineSubtotal - globalDiscount);
  const vat = afterDiscount * (vatRate / 100);
  const total = afterDiscount + vat;

  function addToCart(product: ReturnType<typeof productService.getAll>[number]) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.retailPrice,
          discountPct: 0,
          vatRate: product.vatRate,
        },
      ];
    });
  }

  function updateQty(productId: string, qty: number) {
    if (qty < 1) return removeFromCart(productId);
    setCart((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)));
  }

  function updateUnitPrice(productId: string, price: number) {
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, unitPrice: Math.max(0, price) } : i)),
    );
  }

  function updateDiscount(productId: string, disc: number) {
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, discountPct: Math.min(100, Math.max(0, disc)) }
          : i,
      ),
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }

  function completeSale() {
    if (!cart.length) return;
    const sale = salesService.createSale({
      branchId,
      customerId,
      items: cart.map((i) => ({
        productId: i.productId,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discount: i.discountPct,
        vatRate: i.vatRate,
      })),
      discount: globalDiscount,
      vatRate,
      paymentMethod,
      userId: 'usr_admin',
    });
    setReceipt({ id: sale.id, total: sale.total });
    setCart([]);
    setGlobalDiscount(0);
    setNote('');
  }

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      {/* ── Product Panel ── */}
      <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Sales POS</h2>
            <p className="text-sm text-slate-500 mt-0.5">Click a product to add it to the cart</p>
          </div>
          {receipt && (
            <div className="text-right bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm">
              <p className="font-semibold text-emerald-700">Sale recorded!</p>
              <p className="text-xs text-emerald-600 font-mono">{receipt.id}</p>
              <p className="text-xs text-emerald-600">{formatKes(receipt.total)}</p>
              <button onClick={() => setReceipt(null)} className="text-xs text-emerald-500 hover:underline mt-0.5">Dismiss</button>
            </div>
          )}
        </div>

        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
          placeholder="Search by product name or SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="grid sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 col-span-2 py-4 text-center">No products found</p>
          )}
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="text-left border border-slate-200 rounded-xl p-3.5 hover:border-[#2B59C3] hover:bg-blue-50/40 transition group"
            >
              <p className="font-semibold text-slate-900 group-hover:text-[#2B59C3] transition text-sm leading-snug">
                {product.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{product.sku}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-slate-800">{formatKes(product.retailPrice)}</span>
                <span className="text-xs text-slate-400">W: {formatKes(product.wholesalePrice)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Cart Panel ── */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-slate-900 text-lg">Cart</h3>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-8">
            No items — click a product to add
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[42vh] pr-1">
            {cart.map((item) => (
              <div key={item.productId} className="border border-slate-200 rounded-xl p-3 space-y-2 group">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-semibold text-slate-800 leading-snug flex-1">{item.name}</p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-300 hover:text-red-500 transition text-xl leading-none flex-shrink-0"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="text-xs text-slate-500 block mb-0.5">Qty</label>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition text-sm font-bold"
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                      >−</button>
                      <span className="flex-1 text-center text-sm font-semibold text-slate-800 py-1">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition text-sm font-bold"
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-0.5">Unit Price</label>
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateUnitPrice(item.productId, Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-0.5">Disc %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.discountPct}
                      onChange={(e) => updateDiscount(item.productId, Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Line total</span>
                  <span className="font-bold text-slate-800 tabular-nums">{formatKes(itemTotal(item))}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customer + Payment */}
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-0.5">Global Disc (KES)</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
                type="number"
                min={0}
                value={globalDiscount}
                onChange={(e) => setGlobalDiscount(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-0.5">VAT %</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
                type="number"
                min={0}
                value={vatRate}
                onChange={(e) => setVatRate(Math.max(0, Number(e.target.value)))}
              />
            </div>
          </div>

          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
          >
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
          </select>

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Totals */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal ({cart.length} items)</span>
            <span className="tabular-nums font-medium">{formatKes(lineSubtotal)}</span>
          </div>
          {globalDiscount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Discount</span>
              <span className="tabular-nums font-medium">− {formatKes(globalDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>VAT ({vatRate}%)</span>
            <span className="tabular-nums font-medium">{formatKes(vat)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-1.5 mt-1">
            <span>Total</span>
            <span className="tabular-nums text-[#EF233C]">{formatKes(total)}</span>
          </div>
        </div>

        <button
          className="w-full bg-[#EF233C] text-white rounded-xl py-3 font-bold text-base hover:bg-[#d61f35] transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={completeSale}
          disabled={cart.length === 0}
        >
          Complete Sale — {formatKes(total)}
        </button>
      </div>
    </div>
  );
}
