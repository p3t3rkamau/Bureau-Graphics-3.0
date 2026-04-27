import React, { useMemo, useState } from 'react';
import { formatKes, generateId } from '../../../../../packages/shared/utils';
import { customers as seedCustomers } from '../../data/mockData';
import { quotationService } from '../../services/invoiceService';
import { pdfService } from '../../services/pdfService';
import { productService } from '../../services/productService';
import { useBranch } from '../../stores/branchStore';
import { Quotation, QuotationStatus, SaleItem } from '../../types';

type LineItem = {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  vatRate: number;
};

type ViewMode = 'list' | 'create' | 'edit' | 'view';

const STATUS_COLORS: Record<QuotationStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-orange-100 text-orange-700',
};

const STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
};

function lineTotal(item: LineItem): number {
  const gross = item.quantity * item.unitPrice;
  return gross * (1 - item.discountPct / 100);
}

function calcTotals(items: LineItem[], vatPct: number) {
  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const vatTotal = subtotal * (vatPct / 100);
  return { subtotal, vatTotal, total: subtotal + vatTotal };
}

function emptyLine(): LineItem {
  return { id: generateId('li'), productId: '', name: '', quantity: 1, unitPrice: 0, discountPct: 0, vatRate: 16 };
}

export function QuotationsPage() {
  const { branchId } = useBranch();
  const products = productService.getAll();
  const customers = seedCustomers;

  const [view, setView] = useState<ViewMode>('list');
  const [activeQuotation, setActiveQuotation] = useState<Quotation | null>(null);
  const [tick, setTick] = useState(0); // force re-read from localStorage

  // Form state
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '');
  const [validDays, setValidDays] = useState(7);
  const [vatPct, setVatPct] = useState(16);
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);
  const [search, setSearch] = useState('');

  function refresh() {
    setTick((n) => n + 1);
  }

  function resetForm() {
    setCustomerId(customers[0]?.id ?? '');
    setValidDays(7);
    setVatPct(16);
    setNotes('');
    setLines([emptyLine()]);
    setActiveQuotation(null);
  }

  function openNew() {
    resetForm();
    setView('create');
  }

  function openView(q: Quotation) {
    setActiveQuotation(q);
    setView('view');
  }

  function openEdit(q: Quotation) {
    setActiveQuotation(q);
    setCustomerId(q.customerId);
    const msLeft = new Date(q.validUntil).getTime() - Date.now();
    setValidDays(Math.max(1, Math.round(msLeft / 86400000)));
    setNotes(q.notes ?? '');
    setLines(
      q.items.length > 0
        ? q.items.map((item) => ({ id: generateId('li'), productId: item.productId, name: item.name, quantity: item.quantity, unitPrice: item.unitPrice, discountPct: item.discount, vatRate: item.vatRate }))
        : [emptyLine()],
    );
    setView('edit');
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine()]);
  }

  function removeLine(id: string) {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  }

  function updateLine(id: string, patch: Partial<LineItem>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function pickProduct(lineId: string, productId: string) {
    const p = products.find((x) => x.id === productId);
    if (p) updateLine(lineId, { productId: p.id, name: p.name, unitPrice: p.retailPrice, vatRate: p.vatRate });
  }

  const { subtotal, vatTotal, total } = useMemo(() => calcTotals(lines, vatPct), [lines, vatPct]);

  function saveQuotation(status: QuotationStatus) {
    const validLines = lines.filter((l) => l.name.trim());
    if (!validLines.length || !customerId) return;

    const items: SaleItem[] = validLines.map((l) => ({
      productId: l.productId,
      name: l.name,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      discount: l.discountPct,
      vatRate: l.vatRate,
    }));

    const validUntil = new Date(Date.now() + validDays * 86400000).toISOString();
    const q = quotationService.create({ branchId, customerId, items, subtotal, vatTotal, total, validUntil, notes });
    if (status !== 'draft') quotationService.updateStatus(q.id, status);

    resetForm();
    refresh();
    setView('list');
  }

  function saveEdit(status: QuotationStatus) {
    if (!activeQuotation) return;
    const validLines = lines.filter((l) => l.name.trim());
    if (!validLines.length || !customerId) return;
    const items: SaleItem[] = validLines.map((l) => ({ productId: l.productId, name: l.name, quantity: l.quantity, unitPrice: l.unitPrice, discount: l.discountPct, vatRate: l.vatRate }));
    const validUntil = new Date(Date.now() + validDays * 86400000).toISOString();
    quotationService.update(activeQuotation.id, { customerId, items, subtotal, vatTotal, total, validUntil, notes, status });
    resetForm();
    refresh();
    setView('list');
  }

  function toInvoice(id: string) {
    quotationService.convertToInvoice(id);
    refresh();
    setView('list');
  }

  function updateStatus(id: string, status: QuotationStatus) {
    quotationService.updateStatus(id, status);
    refresh();
    setView('list');
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const quotations = useMemo(() => quotationService.getAll(), [tick]);

  const filtered = quotations.filter((q) => {
    if (!search) return true;
    const cust = customers.find((c) => c.id === q.customerId);
    return (
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      (cust?.name ?? '').toLowerCase().includes(search.toLowerCase())
    );
  });

  // ── VIEW: QUOTATION DETAIL ────────────────────────────────────────────────
  if (view === 'view' && activeQuotation) {
    const q = activeQuotation;
    const cust = customers.find((c) => c.id === q.customerId);
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => { setView('list'); setActiveQuotation(null); }} className="text-sm text-slate-500 hover:text-slate-900 transition flex items-center gap-1">
            ← Back to Quotations
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Quotation</p>
                <h2 className="text-2xl font-bold text-slate-900 font-mono">{q.id}</h2>
                <span className={`mt-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[q.status]}`}>
                  {STATUS_LABELS[q.status]}
                </span>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-slate-500">Created</p>
                <p className="font-semibold text-slate-800">{q.createdAt.slice(0, 10)}</p>
                <p className="text-xs text-slate-500 mt-2">Valid Until</p>
                <p className="font-semibold text-slate-800">{q.validUntil.slice(0, 10)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bill To</p>
              <p className="font-semibold text-slate-900">{cust?.name ?? q.customerId}</p>
              {cust?.phone && <p className="text-sm text-slate-500">{cust.phone}</p>}
              {cust?.email && <p className="text-sm text-slate-500">{cust.email}</p>}
            </div>
          </div>

          {/* Line items table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Description</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Qty</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Unit Price</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Disc%</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {q.items.map((item, i) => {
                  const amt = item.quantity * item.unitPrice * (1 - item.discount / 100);
                  return (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 text-slate-800">{item.name}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{item.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{formatKes(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{item.discount > 0 ? `${item.discount}%` : '—'}</td>
                      <td className="px-5 py-3 text-right font-semibold text-slate-900 tabular-nums">{formatKes(amt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals + Notes */}
          <div className="p-6 border-t border-slate-100 grid sm:grid-cols-2 gap-6">
            {q.notes && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Notes / Terms</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">{q.notes}</p>
              </div>
            )}
            <div className={q.notes ? '' : 'sm:col-start-2'}>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium">{formatKes(q.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                  <span>VAT</span>
                  <span className="tabular-nums font-medium">{formatKes(q.vatTotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base py-1">
                  <span>Total</span>
                  <span className="tabular-nums">{formatKes(q.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-wrap gap-2">
            <button onClick={() => pdfService.printQuotation(q, cust)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition">
              Export PDF
            </button>
            {q.status === 'draft' && (
              <button onClick={() => openEdit(q)} className="px-4 py-2 rounded-lg border border-[#2B59C3] text-[#2B59C3] text-sm font-semibold hover:bg-blue-50 transition">
                Edit
              </button>
            )}
            {q.status === 'draft' && (
              <button onClick={() => updateStatus(q.id, 'sent')} className="px-4 py-2 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm">
                Mark as Sent
              </button>
            )}
            {(q.status === 'draft' || q.status === 'sent') && (
              <>
                <button onClick={() => updateStatus(q.id, 'approved')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
                  Approve
                </button>
                <button onClick={() => updateStatus(q.id, 'rejected')} className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                  Reject
                </button>
              </>
            )}
            {q.status !== 'rejected' && q.status !== 'expired' && (
              <button onClick={() => toInvoice(q.id)} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition shadow-sm">
                Convert → Invoice
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW: CREATE / EDIT FORM ─────────────────────────────────────────────
  if (view === 'create' || view === 'edit') {
    const isEdit = view === 'edit';
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView(isEdit ? 'view' : 'list'); if (!isEdit) resetForm(); }} className="text-sm text-slate-500 hover:text-slate-900 transition">← Cancel</button>
          <h2 className="text-xl font-bold text-slate-900">{isEdit ? `Edit Quotation ${activeQuotation?.id}` : 'New Quotation'}</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
          {/* Customer + Dates */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Customer *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Valid For (days)</label>
              <input
                type="number"
                min={1}
                value={validDays}
                onChange={(e) => setValidDays(Math.max(1, Number(e.target.value)))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
              />
              <p className="text-xs text-slate-400 mt-1">
                Valid until: {new Date(Date.now() + validDays * 86400000).toLocaleDateString('en-KE')}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">VAT Rate (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={vatPct}
                onChange={(e) => setVatPct(Math.max(0, Number(e.target.value)))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
              />
            </div>
          </div>

          {/* Line items */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Line Items</p>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-3 py-2.5 font-semibold text-slate-600 w-5/12">Product / Description</th>
                    <th className="text-right px-3 py-2.5 font-semibold text-slate-600 w-16">Qty</th>
                    <th className="text-right px-3 py-2.5 font-semibold text-slate-600 w-28">Unit Price</th>
                    <th className="text-right px-3 py-2.5 font-semibold text-slate-600 w-20">Disc %</th>
                    <th className="text-right px-3 py-2.5 font-semibold text-slate-600 w-28">Total</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line) => (
                    <tr key={line.id} className="group align-middle">
                      <td className="px-2 py-2">
                        <div className="flex flex-col gap-1">
                          <select
                            value={line.productId}
                            onChange={(e) => e.target.value && pickProduct(line.id, e.target.value)}
                            className="border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40 w-full"
                          >
                            <option value="">— Select from catalog —</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                          <input
                            value={line.name}
                            onChange={(e) => updateLine(line.id, { name: e.target.value })}
                            placeholder="Or type custom description..."
                            className="border border-slate-200 rounded px-2 py-1.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40 w-full"
                          />
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) => updateLine(line.id, { quantity: Math.max(1, Number(e.target.value)) })}
                          className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={0}
                          value={line.unitPrice}
                          onChange={(e) => updateLine(line.id, { unitPrice: Math.max(0, Number(e.target.value)) })}
                          className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={line.discountPct}
                          onChange={(e) => updateLine(line.id, { discountPct: Math.min(100, Math.max(0, Number(e.target.value))) })}
                          className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#2B59C3]/40"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        {formatKes(lineTotal(line))}
                      </td>
                      <td className="px-1 py-2 text-center">
                        <button
                          onClick={() => removeLine(line.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition text-lg leading-none"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addLine}
                className="w-full text-left px-4 py-2.5 text-sm text-[#2B59C3] font-medium hover:bg-blue-50/40 border-t border-slate-200 transition"
              >
                + Add line item
              </button>
            </div>
          </div>

          {/* Notes + Totals */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Notes / Terms</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="e.g. Payment due within 7 days of invoice. Prices valid for the period stated above."
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40 placeholder:text-slate-400"
              />
            </div>
            <div className="self-start space-y-1 text-sm bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex justify-between text-slate-600 py-1">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium">{formatKes(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-1">
                <span>VAT ({vatPct}%)</span>
                <span className="tabular-nums font-medium">{formatKes(vatTotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-300 pt-2 mt-1">
                <span>Total</span>
                <span className="tabular-nums">{formatKes(total)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => { setView(isEdit ? 'view' : 'list'); if (!isEdit) resetForm(); }}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => isEdit ? saveEdit('draft') : saveQuotation('draft')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition shadow-sm"
            >
              Save as Draft
            </button>
            <button
              onClick={() => isEdit ? saveEdit('sent') : saveQuotation('sent')}
              className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm"
            >
              {isEdit ? 'Save Changes' : 'Save & Send'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW: LIST ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quotations</h2>
          <p className="text-sm text-slate-500 mt-0.5">Create price quotes for customers and convert them to invoices</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white font-semibold text-sm shadow-sm hover:bg-[#1e3f8f] transition"
        >
          + New Quotation
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-100">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by quotation ID or customer name..."
            className="w-full sm:w-80 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-semibold text-slate-600 text-lg">No quotations yet</p>
            <p className="text-sm mt-1">Click "New Quotation" to create your first quote for a customer</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Quotation #</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Created</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Valid Until</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Items</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Total</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((q) => {
                  const cust = customers.find((c) => c.id === q.customerId);
                  const isExpired = new Date(q.validUntil) < new Date() && q.status !== 'approved' && q.status !== 'rejected';
                  const displayStatus: QuotationStatus = isExpired ? 'expired' : q.status;
                  return (
                    <tr key={q.id} className="hover:bg-slate-50/70 transition cursor-pointer" onClick={() => openView(q)}>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500 font-medium">{q.id}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{cust?.name ?? q.customerId}</td>
                      <td className="px-4 py-3.5 text-slate-500">{q.createdAt.slice(0, 10)}</td>
                      <td className="px-4 py-3.5 text-slate-500">{q.validUntil.slice(0, 10)}</td>
                      <td className="px-4 py-3.5 text-slate-500">{q.items.length}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900 tabular-nums">{formatKes(q.total)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[displayStatus]}`}>
                          {STATUS_LABELS[displayStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          {q.status !== 'rejected' && q.status !== 'expired' && !isExpired && (
                            <button
                              onClick={() => toInvoice(q.id)}
                              className="text-xs text-emerald-600 hover:underline font-semibold whitespace-nowrap"
                            >
                              → Invoice
                            </button>
                          )}
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
