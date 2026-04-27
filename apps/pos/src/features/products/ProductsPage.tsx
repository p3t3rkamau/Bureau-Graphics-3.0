import React, { useMemo, useState } from 'react';
import { formatKes } from '../../../../../packages/shared/utils';
import { categories as seedCategories } from '../../data/mockData';
import { productService } from '../../services/productService';
import { Product } from '../../types';

type ViewMode = 'list' | 'form';

const BLANK: Omit<Product, 'id'> = {
  sku: '',
  name: '',
  categoryId: '',
  productType: 'stock',
  retailPrice: 0,
  wholesalePrice: 0,
  reorderLevel: 0,
  vatRate: 16,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const INPUT = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40';

export function ProductsPage() {
  const categories = seedCategories;
  const [view, setView] = useState<ViewMode>('list');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(BLANK);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [tick, setTick] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function refresh() { setTick((n) => n + 1); }

  function openNew() {
    setEditing(null);
    setForm({ ...BLANK, categoryId: categories[0]?.id ?? '' });
    setView('form');
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ sku: p.sku, name: p.name, categoryId: p.categoryId, productType: p.productType, retailPrice: p.retailPrice, wholesalePrice: p.wholesalePrice, reorderLevel: p.reorderLevel, vatRate: p.vatRate });
    setView('form');
  }

  function set(key: keyof Omit<Product, 'id'>, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    if (!form.name.trim() || !form.sku.trim()) return;
    if (editing) {
      productService.update(editing.id, form);
    } else {
      productService.create(form);
    }
    setView('list');
    refresh();
  }

  function confirmDelete(id: string) { setDeleteConfirm(id); }
  function doDelete() {
    if (deleteConfirm) { productService.delete(deleteConfirm); setDeleteConfirm(null); refresh(); }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products = useMemo(() => productService.getAll(), [tick]);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.categoryId === catFilter;
    return matchSearch && matchCat;
  });

  const stats = {
    total: products.length,
    stock: products.filter((p) => p.productType === 'stock').length,
    services: products.filter((p) => p.productType === 'service').length,
  };

  // ── FORM ──────────────────────────────────────────────────────────────────
  if (view === 'form') {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-sm text-slate-500 hover:text-slate-900 transition">← Back</button>
          <h2 className="text-xl font-bold text-slate-900">{editing ? 'Edit Product' : 'New Product'}</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product Name *">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className={INPUT} placeholder="e.g. A4 Flyer Double Sided" />
            </Field>
            <Field label="SKU *">
              <input value={form.sku} onChange={(e) => set('sku', e.target.value.toUpperCase())} className={INPUT} placeholder="e.g. FLY-A4-DS" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={INPUT}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Product Type">
              <select value={form.productType} onChange={(e) => set('productType', e.target.value as 'stock' | 'service')} className={INPUT}>
                <option value="stock">Stock (physical, tracked)</option>
                <option value="service">Service (not tracked)</option>
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Retail Price (KES)">
              <input type="number" min={0} value={form.retailPrice} onChange={(e) => set('retailPrice', Math.max(0, Number(e.target.value)))} className={INPUT} />
            </Field>
            <Field label="Wholesale Price (KES)">
              <input type="number" min={0} value={form.wholesalePrice} onChange={(e) => set('wholesalePrice', Math.max(0, Number(e.target.value)))} className={INPUT} />
            </Field>
            <Field label="VAT Rate (%)">
              <input type="number" min={0} max={100} value={form.vatRate} onChange={(e) => set('vatRate', Math.max(0, Number(e.target.value)))} className={INPUT} />
            </Field>
          </div>

          {form.productType === 'stock' && (
            <Field label="Reorder Level (alert when stock ≤ this)">
              <input type="number" min={0} value={form.reorderLevel} onChange={(e) => set('reorderLevel', Math.max(0, Number(e.target.value)))} className={INPUT} />
              <p className="text-xs text-slate-400 mt-1">Stock alert fires when quantity on hand reaches this number.</p>
            </Field>
          )}

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button onClick={() => setView('list')} className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button
              onClick={save}
              disabled={!form.name.trim() || !form.sku.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm disabled:opacity-40"
            >
              {editing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-slate-900 text-lg mb-2">Delete Product?</h3>
            <p className="text-sm text-slate-600 mb-5">This will also remove all inventory records for this product. This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your product catalog and pricing</p>
        </div>
        <button onClick={openNew} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white font-semibold text-sm shadow-sm hover:bg-[#1e3f8f] transition">+ Add Product</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Products', value: stats.total, color: 'text-slate-900' },
          { label: 'Stock Items', value: stats.stock, color: 'text-[#2B59C3]' },
          { label: 'Services', value: stats.services, color: 'text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or SKU..." className="w-full sm:w-64 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-14 text-center text-slate-400">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-semibold text-slate-600">No products found</p>
            <p className="text-sm mt-1">{products.length === 0 ? 'Click "Add Product" to get started' : 'Try adjusting your search'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">SKU</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Type</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Retail</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Wholesale</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">VAT%</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Reorder</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                      <td className="px-4 py-3 text-slate-600">{cat?.name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${p.productType === 'stock' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {p.productType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">{formatKes(p.retailPrice)}</td>
                      <td className="px-4 py-3 text-right text-slate-500 tabular-nums">{formatKes(p.wholesalePrice)}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{p.vatRate}%</td>
                      <td className="px-4 py-3 text-right text-slate-500">{p.productType === 'stock' ? p.reorderLevel : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEdit(p)} className="text-xs text-[#2B59C3] hover:underline font-semibold">Edit</button>
                          <button onClick={() => confirmDelete(p.id)} className="text-xs text-red-500 hover:underline font-semibold">Delete</button>
                        </div>
                      </td>
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
