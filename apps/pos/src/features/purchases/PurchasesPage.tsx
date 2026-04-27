import React, { useMemo, useState } from 'react';
import { formatKes, generateId } from '../../../../../packages/shared/utils';
import { productService } from '../../services/productService';
import { purchaseService } from '../../services/purchaseService';
import { supplierService } from '../../services/supplierService';
import { useBranch } from '../../stores/branchStore';

type PurchaseLine = { id: string; productId: string; quantity: number; unitCost: number; expiryDate: string };

function lineTotal(l: PurchaseLine) { return l.quantity * l.unitCost; }

export function PurchasesPage() {
  const { branchId } = useBranch();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [tick, setTick] = useState(0);

  // Form state
  const [supplierId, setSupplierId] = useState('');
  const [lines, setLines] = useState<PurchaseLine[]>([emptyLine()]);

  function emptyLine(): PurchaseLine {
    return { id: generateId('pl'), productId: '', quantity: 1, unitCost: 0, expiryDate: '' };
  }
  function refresh() { setTick((n) => n + 1); }

  function addLine() { setLines((p) => [...p, emptyLine()]); }
  function removeLine(id: string) { setLines((p) => p.length > 1 ? p.filter((l) => l.id !== id) : p); }
  function updateLine(id: string, patch: Partial<PurchaseLine>) {
    setLines((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function pickProduct(lineId: string, productId: string) {
    const p = productService.getById(productId);
    if (p) updateLine(lineId, { productId: p.id, unitCost: p.wholesalePrice });
  }

  const total = useMemo(() => lines.reduce((s, l) => s + lineTotal(l), 0), [lines]);

  function save() {
    const valid = lines.filter((l) => l.productId && l.quantity > 0 && l.unitCost > 0);
    if (!valid.length || !supplierId) return;
    purchaseService.create({
      branchId,
      supplierId,
      items: valid.map((l) => ({ productId: l.productId, quantity: l.quantity, unitCost: l.unitCost, expiryDate: l.expiryDate || undefined })),
      userId: 'usr_admin',
    });
    setLines([emptyLine()]);
    setSupplierId('');
    setView('list');
    refresh();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const purchases = useMemo(() => purchaseService.getAll(), [tick]);
  const suppliers = supplierService.getAll();
  const products = productService.getAll().filter((p) => p.productType === 'stock');

  if (view === 'create') {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-sm text-slate-500 hover:text-slate-900">← Cancel</button>
          <h2 className="text-xl font-bold text-slate-900">New Purchase Order</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Supplier *</label>
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full sm:w-72 border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40">
              <option value="">— Select supplier —</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Items Received</p>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-3 py-2.5 font-semibold text-slate-600 w-2/5">Product</th>
                    <th className="text-right px-3 py-2.5 font-semibold text-slate-600 w-20">Qty</th>
                    <th className="text-right px-3 py-2.5 font-semibold text-slate-600 w-28">Unit Cost</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-slate-600 w-28">Expiry Date</th>
                    <th className="text-right px-3 py-2.5 font-semibold text-slate-600 w-24">Total</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line) => (
                    <tr key={line.id} className="group">
                      <td className="px-2 py-2">
                        <select value={line.productId} onChange={(e) => e.target.value && pickProduct(line.id, e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40">
                          <option value="">— Select product —</option>
                          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-2"><input type="number" min={1} value={line.quantity} onChange={(e) => updateLine(line.id, { quantity: Math.max(1, Number(e.target.value)) })} className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40" /></td>
                      <td className="px-2 py-2"><input type="number" min={0} value={line.unitCost} onChange={(e) => updateLine(line.id, { unitCost: Math.max(0, Number(e.target.value)) })} className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40" /></td>
                      <td className="px-2 py-2"><input type="date" value={line.expiryDate} onChange={(e) => updateLine(line.id, { expiryDate: e.target.value })} className="w-full border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40" /></td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">{formatKes(lineTotal(line))}</td>
                      <td className="px-1 py-2 text-center"><button onClick={() => removeLine(line.id)} className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 transition text-lg leading-none">×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addLine} className="w-full text-left px-4 py-2.5 text-sm text-[#2B59C3] font-medium hover:bg-blue-50/40 border-t border-slate-200 transition">+ Add item</button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <div className="text-sm font-bold text-slate-900">Total Cost: <span className="text-[#2B59C3] tabular-nums">{formatKes(total)}</span></div>
            <div className="flex gap-2">
              <button onClick={() => setView('list')} className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={save} disabled={!supplierId || lines.every((l) => !l.productId)} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm disabled:opacity-40">Receive Stock</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Purchases</h2>
          <p className="text-sm text-slate-500 mt-0.5">Record supplier deliveries — stock is updated automatically</p>
        </div>
        <button onClick={() => setView('create')} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white font-semibold text-sm shadow-sm hover:bg-[#1e3f8f] transition">+ Receive Stock</button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {purchases.length === 0 ? (
          <div className="p-14 text-center text-slate-400">
            <div className="text-4xl mb-3">🚚</div>
            <p className="font-semibold text-slate-600">No purchases yet</p>
            <p className="text-sm mt-1">Click "Receive Stock" to record a supplier delivery</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">PO #</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Supplier</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Items</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map((po) => {
                  const sup = suppliers.find((s) => s.id === po.supplierId);
                  return (
                    <tr key={po.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500 font-medium">{po.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{sup?.name ?? po.supplierId}</td>
                      <td className="px-4 py-3 text-slate-500">{po.createdAt.slice(0, 10)}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{po.items.length}</td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">{formatKes(po.totalCost)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
