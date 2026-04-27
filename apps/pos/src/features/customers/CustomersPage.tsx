import React, { useMemo, useState } from 'react';
import { formatKes } from '../../../../../packages/shared/utils';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types';

const BLANK: Omit<Customer, 'id'> = { name: '', email: '', phone: '', creditLimit: 0, loyaltyPoints: 0, currentBalance: 0 };
const INPUT = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40';

export function CustomersPage() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Omit<Customer, 'id'>>(BLANK);
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function refresh() { setTick((n) => n + 1); }
  function set(k: keyof Omit<Customer, 'id'>, v: unknown) { setForm((p) => ({ ...p, [k]: v })); }

  function openNew() { setEditing(null); setForm(BLANK); setView('form'); }
  function openEdit(c: Customer) {
    setEditing(c);
    setForm({ name: c.name, email: c.email ?? '', phone: c.phone, creditLimit: c.creditLimit, loyaltyPoints: c.loyaltyPoints, currentBalance: c.currentBalance });
    setView('form');
  }

  function save() {
    if (!form.name.trim() || !form.phone.trim()) return;
    if (editing) customerService.update(editing.id, form);
    else customerService.create(form);
    setView('list');
    refresh();
  }

  function doDelete() {
    if (deleteConfirm) { customerService.delete(deleteConfirm); setDeleteConfirm(null); refresh(); }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customers = useMemo(() => customerService.getAll(), [tick]);
  const filtered = customers.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  if (view === 'form') {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-sm text-slate-500 hover:text-slate-900">← Back</button>
          <h2 className="text-xl font-bold text-slate-900">{editing ? 'Edit Customer' : 'New Customer'}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Full Name / Company *</label><input value={form.name} onChange={(e) => set('name', e.target.value)} className={INPUT} placeholder="e.g. Acme Traders Ltd" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Phone *</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={INPUT} placeholder="+254 700 000 000" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Email</label><input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} className={INPUT} placeholder="customer@company.co.ke" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Credit Limit (KES)</label><input type="number" min={0} value={form.creditLimit} onChange={(e) => set('creditLimit', Math.max(0, Number(e.target.value)))} className={INPUT} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Current Balance (KES)</label><input type="number" min={0} value={form.currentBalance} onChange={(e) => set('currentBalance', Math.max(0, Number(e.target.value)))} className={INPUT} /></div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Loyalty Points</label><input type="number" min={0} value={form.loyaltyPoints} onChange={(e) => set('loyaltyPoints', Math.max(0, Number(e.target.value)))} className={INPUT} /></div>
          <div className="flex gap-2 pt-1 border-t border-slate-100">
            <button onClick={() => setView('list')} className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button onClick={save} disabled={!form.name.trim() || !form.phone.trim()} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm disabled:opacity-40">{editing ? 'Save Changes' : 'Add Customer'}</button>
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
            <h3 className="font-bold text-slate-900 text-lg mb-2">Delete Customer?</h3>
            <p className="text-sm text-slate-600 mb-5">Their transaction history will remain intact. This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-slate-900">Customers</h2><p className="text-sm text-slate-500 mt-0.5">Manage customer profiles, credit limits, and loyalty points</p></div>
        <button onClick={openNew} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white font-semibold text-sm shadow-sm hover:bg-[#1e3f8f] transition">+ Add Customer</button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone, or email..." className="w-full sm:w-72 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" />
        </div>
        {filtered.length === 0 ? (
          <div className="p-14 text-center text-slate-400"><div className="text-4xl mb-3">👥</div><p className="font-semibold text-slate-600">{customers.length === 0 ? 'No customers yet' : 'No results'}</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Email</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Credit Limit</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Balance</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Points</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phone}</td>
                    <td className="px-4 py-3 text-slate-500">{c.email ?? '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.creditLimit > 0 ? formatKes(c.creditLimit) : '—'}</td>
                    <td className={`px-4 py-3 text-right font-semibold tabular-nums ${c.currentBalance > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{c.currentBalance > 0 ? formatKes(c.currentBalance) : '—'}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{c.loyaltyPoints > 0 ? c.loyaltyPoints.toLocaleString() : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(c)} className="text-xs text-[#2B59C3] hover:underline font-semibold">Edit</button>
                        <button onClick={() => setDeleteConfirm(c.id)} className="text-xs text-red-500 hover:underline font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
