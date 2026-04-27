import React, { useMemo, useState } from 'react';
import { formatKes } from '../../../../../packages/shared/utils';
import { supplierService } from '../../services/supplierService';
import { Supplier } from '../../types';

const BLANK: Omit<Supplier, 'id'> = { name: '', email: '', phone: '', currentBalance: 0 };
const INPUT = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40';

export function SuppliersPage() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState<Omit<Supplier, 'id'>>(BLANK);
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function refresh() { setTick((n) => n + 1); }
  function set(k: keyof Omit<Supplier, 'id'>, v: unknown) { setForm((p) => ({ ...p, [k]: v })); }

  function openNew() { setEditing(null); setForm(BLANK); setView('form'); }
  function openEdit(s: Supplier) { setEditing(s); setForm({ name: s.name, email: s.email ?? '', phone: s.phone, currentBalance: s.currentBalance }); setView('form'); }

  function save() {
    if (!form.name.trim() || !form.phone.trim()) return;
    if (editing) supplierService.update(editing.id, form);
    else supplierService.create(form);
    setView('list');
    refresh();
  }

  function doDelete() {
    if (deleteConfirm) { supplierService.delete(deleteConfirm); setDeleteConfirm(null); refresh(); }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const suppliers = useMemo(() => supplierService.getAll(), [tick]);
  const filtered = suppliers.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search));

  if (view === 'form') {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-sm text-slate-500 hover:text-slate-900">← Back</button>
          <h2 className="text-xl font-bold text-slate-900">{editing ? 'Edit Supplier' : 'New Supplier'}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Company Name *</label><input value={form.name} onChange={(e) => set('name', e.target.value)} className={INPUT} placeholder="e.g. Paper Mill Kenya" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Phone *</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={INPUT} placeholder="+254 700 000 000" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Email</label><input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} className={INPUT} placeholder="orders@supplier.co.ke" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Opening Balance Owed (KES)</label><input type="number" min={0} value={form.currentBalance} onChange={(e) => set('currentBalance', Math.max(0, Number(e.target.value)))} className={INPUT} /></div>
          <div className="flex gap-2 pt-1 border-t border-slate-100">
            <button onClick={() => setView('list')} className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button onClick={save} disabled={!form.name.trim() || !form.phone.trim()} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm disabled:opacity-40">{editing ? 'Save Changes' : 'Add Supplier'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-slate-900 text-lg mb-2">Delete Supplier?</h3>
            <p className="text-sm text-slate-600 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-slate-900">Suppliers</h2><p className="text-sm text-slate-500 mt-0.5">Manage supplier contacts and balances</p></div>
        <button onClick={openNew} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white font-semibold text-sm shadow-sm hover:bg-[#1e3f8f] transition">+ Add Supplier</button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search supplier..." className="w-full sm:w-64 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" />
        </div>
        {filtered.length === 0 ? (
          <div className="p-14 text-center text-slate-400"><div className="text-4xl mb-3">🏭</div><p className="font-semibold text-slate-600">{suppliers.length === 0 ? 'No suppliers yet' : 'No results'}</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Email</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Balance Owed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.phone}</td>
                  <td className="px-4 py-3 text-slate-500">{s.email ?? '—'}</td>
                  <td className={`px-4 py-3 text-right font-bold tabular-nums ${s.currentBalance > 0 ? 'text-red-600' : 'text-slate-400'}`}>{s.currentBalance > 0 ? formatKes(s.currentBalance) : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(s)} className="text-xs text-[#2B59C3] hover:underline font-semibold">Edit</button>
                      <button onClick={() => setDeleteConfirm(s.id)} className="text-xs text-red-500 hover:underline font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
