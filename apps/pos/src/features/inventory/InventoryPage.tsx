import React, { useMemo, useState } from 'react';
import { formatKes } from '../../../../../packages/shared/utils';
import { inventoryService } from '../../services/inventoryService';
import { productService } from '../../services/productService';
import { useBranch } from '../../stores/branchStore';
import { StockMovementType } from '../../types';

const MOVEMENT_TYPES: { value: StockMovementType; label: string }[] = [
  { value: 'adjustment', label: 'Set Exact Qty (adjustment)' },
  { value: 'purchase', label: 'Receive Stock (purchase)' },
  { value: 'return', label: 'Customer Return' },
  { value: 'damage', label: 'Mark as Damaged / Write-off' },
  { value: 'transfer', label: 'Branch Transfer In' },
];

export function InventoryPage() {
  const { branchId } = useBranch();
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [adjustModal, setAdjustModal] = useState<string | null>(null); // productId
  const [adjType, setAdjType] = useState<StockMovementType>('adjustment');
  const [adjQty, setAdjQty] = useState(0);
  const [adjReason, setAdjReason] = useState('');

  function refresh() { setTick((n) => n + 1); }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products = useMemo(() => productService.getAll().filter((p) => p.productType === 'stock'), [tick]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inventory = useMemo(() => inventoryService.getAll().filter((i) => i.branchId === branchId), [tick, branchId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const movements = useMemo(() => inventoryService.getMovements().filter((m) => m.branchId === branchId).slice(0, 30), [tick, branchId]);

  const rows = useMemo(() => {
    return products.map((p) => {
      const inv = inventory.find((i) => i.productId === p.id);
      const qty = inv?.quantityOnHand ?? 0;
      const status = qty === 0 ? 'out' : qty <= p.reorderLevel ? 'low' : 'ok';
      return { product: p, inv, qty, status };
    });
  }, [products, inventory]);

  const filtered = rows.filter((r) => {
    const matchSearch = !search || r.product.name.toLowerCase().includes(search.toLowerCase()) || r.product.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: rows.length,
    low: rows.filter((r) => r.status === 'low').length,
    out: rows.filter((r) => r.status === 'out').length,
    totalValue: rows.reduce((s, r) => s + r.qty * r.product.wholesalePrice, 0),
  };

  function openAdjust(productId: string) {
    setAdjustModal(productId);
    setAdjType('adjustment');
    setAdjQty(0);
    setAdjReason('');
  }

  function submitAdjust() {
    if (!adjustModal) return;
    if (adjQty <= 0 && adjType !== 'adjustment') return;
    inventoryService.adjustStock({
      productId: adjustModal,
      branchId,
      type: adjType,
      quantity: adjQty,
      reason: adjReason || adjType,
      userId: 'usr_admin',
    });
    setAdjustModal(null);
    refresh();
  }

  const adjustingProduct = adjustModal ? products.find((p) => p.id === adjustModal) : null;
  const adjustingInv = adjustModal ? inventory.find((i) => i.productId === adjustModal) : null;

  return (
    <div className="space-y-4">
      {/* Adjust modal */}
      {adjustModal && adjustingProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Adjust Stock — {adjustingProduct.name}</h3>
            <p className="text-sm text-slate-500">Current qty: <b className="text-slate-800">{adjustingInv?.quantityOnHand ?? 0}</b></p>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Movement Type</label>
              <select value={adjType} onChange={(e) => setAdjType(e.target.value as StockMovementType)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40">
                {MOVEMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                {adjType === 'adjustment' ? 'New Exact Quantity' : 'Quantity'}
              </label>
              <input type="number" min={0} value={adjQty} onChange={(e) => setAdjQty(Math.max(0, Number(e.target.value)))} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Reason / Note</label>
              <input value={adjReason} onChange={(e) => setAdjReason(e.target.value)} placeholder="e.g. Stock count, supplier delivery..." className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" />
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setAdjustModal(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={submitAdjust} className="flex-1 px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm">Apply</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory</h2>
          <p className="text-sm text-slate-500 mt-0.5">Stock levels, adjustments, and alerts</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Total SKUs</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${stats.low > 0 ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
          <p className="text-xs text-amber-600 font-medium">Low Stock Alerts</p>
          <p className={`text-2xl font-bold mt-1 ${stats.low > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{stats.low}</p>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${stats.out > 0 ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}>
          <p className="text-xs text-red-600 font-medium">Out of Stock</p>
          <p className={`text-2xl font-bold mt-1 ${stats.out > 0 ? 'text-red-600' : 'text-slate-400'}`}>{stats.out}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Estimated Value</p>
          <p className="text-2xl font-bold text-[#2B59C3] mt-1 tabular-nums">{formatKes(stats.totalValue)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product..." className="w-full sm:w-64 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" />
          <div className="flex gap-1.5">
            {(['all', 'low', 'out'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${filter === f ? 'bg-[#2B59C3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f === 'all' ? 'All' : f === 'low' ? `Low Stock (${stats.low})` : `Out of Stock (${stats.out})`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">SKU</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">On Hand</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Reorder At</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Unit Cost</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Stock Value</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(({ product: p, qty, status }) => (
                <tr key={p.id} className={`hover:bg-slate-50/60 transition ${status === 'out' ? 'bg-red-50/40' : status === 'low' ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                  <td className={`px-4 py-3 text-right font-bold tabular-nums ${status === 'out' ? 'text-red-600' : status === 'low' ? 'text-amber-600' : 'text-slate-900'}`}>{qty.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-500 tabular-nums">{p.reorderLevel}</td>
                  <td className="px-4 py-3 text-right text-slate-500 tabular-nums">{formatKes(p.wholesalePrice)}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{formatKes(qty * p.wholesalePrice)}</td>
                  <td className="px-4 py-3 text-center">
                    {status === 'out' && <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">OUT</span>}
                    {status === 'low' && <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">LOW</span>}
                    {status === 'ok' && <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">OK</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openAdjust(p.id)} className="text-xs text-[#2B59C3] hover:underline font-semibold whitespace-nowrap">Adjust</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No products match your filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent movements */}
      {movements.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recent Stock Movements</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Product</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Type</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-slate-600">Qty</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Reason</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((m) => {
                  const p = products.find((x) => x.id === m.productId);
                  const isMinus = m.type === 'sale' || m.type === 'damage';
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{p?.name ?? m.productId}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${isMinus ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{m.type}</span>
                      </td>
                      <td className={`px-4 py-2.5 text-right font-bold tabular-nums ${isMinus ? 'text-red-600' : 'text-green-700'}`}>{isMinus ? '−' : '+'}{m.quantity}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">{m.reason ?? '—'}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">{m.createdAt.slice(0, 16).replace('T', ' ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
