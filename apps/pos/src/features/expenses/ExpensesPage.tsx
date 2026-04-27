import React, { useMemo, useState } from 'react';
import { formatKes } from '../../../../../packages/shared/utils';
import { EXPENSE_CATEGORIES, expenseService } from '../../services/expenseService';
import { useBranch } from '../../stores/branchStore';
import { Expense } from '../../types';

const INPUT = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40';

export function ExpensesPage() {
  const { branchId } = useBranch();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState({ category: EXPENSE_CATEGORIES[0], amount: 0, description: '', incurredAt: new Date().toISOString().slice(0, 10) });
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [tick, setTick] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function refresh() { setTick((n) => n + 1); }
  function set(k: keyof typeof form, v: unknown) { setForm((p) => ({ ...p, [k]: v })); }

  function openNew() {
    setEditing(null);
    setForm({ category: EXPENSE_CATEGORIES[0], amount: 0, description: '', incurredAt: new Date().toISOString().slice(0, 10) });
    setView('form');
  }
  function openEdit(e: Expense) {
    setEditing(e);
    setForm({ category: e.category, amount: e.amount, description: e.description, incurredAt: e.incurredAt.slice(0, 10) });
    setView('form');
  }

  function save() {
    if (!form.description.trim() || form.amount <= 0) return;
    const incurredAt = new Date(form.incurredAt).toISOString();
    if (editing) expenseService.update(editing.id, { ...form, incurredAt });
    else expenseService.create({ branchId, ...form, incurredAt });
    setView('list');
    refresh();
  }

  function doDelete() {
    if (deleteConfirm) { expenseService.delete(deleteConfirm); setDeleteConfirm(null); refresh(); }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const expenses = useMemo(() => expenseService.getAll().filter((e) => e.branchId === branchId || !e.branchId), [tick, branchId]);

  const filtered = expenses.filter((e) => {
    const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || e.category === catFilter;
    return matchSearch && matchCat;
  });

  const byCategory = useMemo(() => {
    const acc: Record<string, number> = {};
    expenses.forEach((e) => { acc[e.category] = (acc[e.category] ?? 0) + e.amount; });
    return Object.entries(acc).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = expenses.filter((e) => e.incurredAt.slice(0, 7) === thisMonth).reduce((s, e) => s + e.amount, 0);

  if (view === 'form') {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-sm text-slate-500 hover:text-slate-900">← Back</button>
          <h2 className="text-xl font-bold text-slate-900">{editing ? 'Edit Expense' : 'Record Expense'}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={INPUT}>
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Amount (KES) *</label><input type="number" min={1} value={form.amount} onChange={(e) => set('amount', Math.max(0, Number(e.target.value)))} className={INPUT} /></div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Description *</label><input value={form.description} onChange={(e) => set('description', e.target.value)} className={INPUT} placeholder="e.g. Monthly electricity bill" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Date</label><input type="date" value={form.incurredAt} onChange={(e) => set('incurredAt', e.target.value)} className={INPUT} /></div>
          <div className="flex gap-2 pt-1 border-t border-slate-100">
            <button onClick={() => setView('list')} className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button onClick={save} disabled={!form.description.trim() || form.amount <= 0} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm disabled:opacity-40">{editing ? 'Save Changes' : 'Record Expense'}</button>
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
            <h3 className="font-bold text-slate-900 text-lg mb-2">Delete Expense?</h3>
            <p className="text-sm text-slate-600 mb-5">This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-slate-900">Expenses</h2><p className="text-sm text-slate-500 mt-0.5">Record and track all business expenses</p></div>
        <button onClick={openNew} className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white font-semibold text-sm shadow-sm hover:bg-[#1e3f8f] transition">+ Record Expense</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">This Month</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">{formatKes(monthExpenses)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">All Time Total</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{formatKes(totalExpenses)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1 col-span-2">
          <p className="text-xs text-slate-500 mb-2">Top Categories</p>
          {byCategory.slice(0, 3).map(([cat, amt]) => (
            <div key={cat} className="flex justify-between text-xs py-0.5">
              <span className="text-slate-600">{cat}</span>
              <span className="font-semibold tabular-nums">{formatKes(amt)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." className="w-full sm:w-64 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40" />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40">
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? (
          <div className="p-14 text-center text-slate-400"><div className="text-4xl mb-3">💸</div><p className="font-semibold text-slate-600">{expenses.length === 0 ? 'No expenses recorded yet' : 'No results'}</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Description</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Amount</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{e.incurredAt.slice(0, 10)}</td>
                    <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{e.category}</span></td>
                    <td className="px-4 py-3 text-slate-700">{e.description}</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-900">{formatKes(e.amount)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(e)} className="text-xs text-[#2B59C3] hover:underline font-semibold">Edit</button>
                        <button onClick={() => setDeleteConfirm(e.id)} className="text-xs text-red-500 hover:underline font-semibold">Delete</button>
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
