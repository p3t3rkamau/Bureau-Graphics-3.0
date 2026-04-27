import React, { useMemo, useState } from 'react';
import { formatKes, generateId } from '../../../../../packages/shared/utils';
import { customers as seedCustomers } from '../../data/mockData';
import { invoiceService } from '../../services/invoiceService';
import { pdfService } from '../../services/pdfService';
import { productService } from '../../services/productService';
import { useBranch } from '../../stores/branchStore';
import { Invoice, InvoiceStatus, SaleItem } from '../../types';

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

const PAYMENT_TERMS = [
  { label: 'Due on receipt', days: 0 },
  { label: 'Net 7', days: 7 },
  { label: 'Net 14', days: 14 },
  { label: 'Net 30', days: 30 },
];

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-200 text-slate-500',
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

function lineTotal(item: LineItem): number {
  return item.quantity * item.unitPrice * (1 - item.discountPct / 100);
}

function calcTotals(items: LineItem[], vatPct: number) {
  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const vatTotal = subtotal * (vatPct / 100);
  return { subtotal, vatTotal, total: subtotal + vatTotal };
}

function emptyLine(): LineItem {
  return { id: generateId('li'), productId: '', name: '', quantity: 1, unitPrice: 0, discountPct: 0, vatRate: 16 };
}

export function InvoicesPage() {
  const { branchId } = useBranch();
  const products = productService.getAll();
  const customers = seedCustomers;

  const [view, setView] = useState<ViewMode>('list');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [tick, setTick] = useState(0);

  // Form state
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '');
  const [termDays, setTermDays] = useState(7);
  const [vatPct, setVatPct] = useState(16);
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  function refresh() { setTick((n) => n + 1); }

  function resetForm() {
    setCustomerId(customers[0]?.id ?? '');
    setTermDays(7);
    setVatPct(16);
    setNotes('');
    setLines([emptyLine()]);
    setActiveInvoice(null);
  }

  function openNew() { resetForm(); setView('create'); }
  function openView(inv: Invoice) { setActiveInvoice(inv); setView('view'); }
  function openEdit(inv: Invoice) {
    setActiveInvoice(inv);
    setCustomerId(inv.customerId);
    setTermDays(inv.paymentTermDays ?? 7);
    setNotes(inv.notes ?? '');
    setLines(
      inv.items.length > 0
        ? inv.items.map((item) => ({ id: generateId('li'), productId: item.productId, name: item.name, quantity: item.quantity, unitPrice: item.unitPrice, discountPct: item.discount, vatRate: item.vatRate }))
        : [emptyLine()],
    );
    setView('edit');
  }

  function addLine() { setLines((p) => [...p, emptyLine()]); }
  function removeLine(id: string) { setLines((p) => p.length > 1 ? p.filter((l) => l.id !== id) : p); }
  function updateLine(id: string, patch: Partial<LineItem>) {
    setLines((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function pickProduct(lineId: string, productId: string) {
    const p = products.find((x) => x.id === productId);
    if (p) updateLine(lineId, { productId: p.id, name: p.name, unitPrice: p.retailPrice, vatRate: p.vatRate });
  }

  const { subtotal, vatTotal, total } = useMemo(() => calcTotals(lines, vatPct), [lines, vatPct]);

  function saveInvoice(status: InvoiceStatus = 'draft') {
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

    const dueDate = new Date(Date.now() + termDays * 86400000).toISOString();
    invoiceService.create({
      branchId,
      customerId,
      items,
      subtotal,
      vatTotal,
      total,
      dueDate,
      paymentTermDays: termDays,
      status,
      notes,
    });

    resetForm();
    refresh();
    setView('list');
  }

  function saveEdit(status: InvoiceStatus = 'draft') {
    if (!activeInvoice) return;
    const validLines = lines.filter((l) => l.name.trim());
    if (!validLines.length || !customerId) return;
    const items: SaleItem[] = validLines.map((l) => ({ productId: l.productId, name: l.name, quantity: l.quantity, unitPrice: l.unitPrice, discount: l.discountPct, vatRate: l.vatRate }));
    const dueDate = new Date(Date.now() + termDays * 86400000).toISOString();
    invoiceService.update(activeInvoice.id, { customerId, items, subtotal, vatTotal, total, dueDate, paymentTermDays: termDays, notes, status });
    resetForm();
    refresh();
    setView('list');
  }

  function markStatus(id: string, status: InvoiceStatus) {
    invoiceService.updateStatus(id, status);
    refresh();
    if (view === 'view') setView('list');
  }

  function convertToSale(id: string) {
    invoiceService.convertToSale(id);
    refresh();
    setView('list');
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const invoices = useMemo(() => invoiceService.getAll(), [tick]);

  const filtered = invoices.filter((inv) => {
    const cust = customers.find((c) => c.id === inv.customerId);
    const matchSearch = !search ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      (cust?.name ?? '').toLowerCase().includes(search.toLowerCase());
    const isOverdue = new Date(inv.dueDate) < new Date() && inv.status === 'sent';
    const effectiveStatus: InvoiceStatus = isOverdue ? 'overdue' : inv.status;
    const matchStatus = statusFilter === 'all' || effectiveStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = useMemo(() => {
    const allInv = invoiceService.getAll();
    return {
      total: allInv.length,
      unpaid: allInv.filter((i) => i.status === 'sent' || i.status === 'draft').length,
      paid: allInv.filter((i) => i.status === 'paid').length,
      totalValue: allInv.filter((i) => i.status !== 'cancelled').reduce((s, i) => s + i.total, 0),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  // ── VIEW: INVOICE DETAIL ──────────────────────────────────────────────────
  if (view === 'view' && activeInvoice) {
    const inv = activeInvoice;
    const cust = customers.find((c) => c.id === inv.customerId);
    const isOverdue = new Date(inv.dueDate) < new Date() && inv.status === 'sent';
    const displayStatus: InvoiceStatus = isOverdue ? 'overdue' : inv.status;
    const termLabel = PAYMENT_TERMS.find((t) => t.days === inv.paymentTermDays)?.label ?? `Net ${inv.paymentTermDays ?? 7}`;

    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <button onClick={() => { setView('list'); setActiveInvoice(null); }} className="text-sm text-slate-500 hover:text-slate-900 transition">
          ← Back to Invoices
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Invoice Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Invoice</p>
                <h2 className="text-2xl font-bold text-slate-900 font-mono">{inv.id}</h2>
                <span className={`mt-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[displayStatus]}`}>
                  {STATUS_LABELS[displayStatus]}
                </span>
              </div>
              <div className="text-right space-y-2">
                <div>
                  <p className="text-xs text-slate-500">Issue Date</p>
                  <p className="font-semibold text-slate-800">{inv.createdAt.slice(0, 10)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Due Date</p>
                  <p className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>{inv.dueDate.slice(0, 10)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Payment Terms</p>
                  <p className="font-semibold text-slate-800">{termLabel}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bill To</p>
              <p className="font-semibold text-slate-900">{cust?.name ?? inv.customerId}</p>
              {cust?.phone && <p className="text-sm text-slate-500">{cust.phone}</p>}
              {cust?.email && <p className="text-sm text-slate-500">{cust.email}</p>}
            </div>
          </div>

          {/* Line items */}
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
                {inv.items.map((item, i) => {
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
            {inv.notes ? (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">{inv.notes}</p>
              </div>
            ) : <div />}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium">{formatKes(inv.subtotal)}</span>
              </div>
              {(inv.discountTotal ?? 0) > 0 && (
                <div className="flex justify-between text-red-600 py-1 border-b border-slate-100">
                  <span>Discount</span>
                  <span className="tabular-nums font-medium">− {formatKes(inv.discountTotal ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                <span>VAT</span>
                <span className="tabular-nums font-medium">{formatKes(inv.vatTotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base py-2">
                <span>Total Due</span>
                <span className="tabular-nums">{formatKes(inv.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button onClick={() => pdfService.printInvoice(inv, cust)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition">
              Export PDF
            </button>
            {(inv.status === 'draft') && (
              <button onClick={() => openEdit(inv)} className="px-4 py-2 rounded-lg border border-[#2B59C3] text-[#2B59C3] text-sm font-semibold hover:bg-blue-50 transition">
                Edit
              </button>
            )}
            {inv.status === 'draft' && (
              <button onClick={() => markStatus(inv.id, 'sent')} className="px-4 py-2 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm">
                Mark as Sent
              </button>
            )}
            {(inv.status === 'sent' || inv.status === 'overdue' || isOverdue) && (
              <button onClick={() => markStatus(inv.id, 'paid')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
                Mark as Paid
              </button>
            )}
            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
              <button onClick={() => convertToSale(inv.id)} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition shadow-sm">
                Record Sale &amp; Mark Paid
              </button>
            )}
            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
              <button onClick={() => markStatus(inv.id, 'cancelled')} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
                Cancel Invoice
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
    const dueDate = new Date(Date.now() + termDays * 86400000).toLocaleDateString('en-KE');
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView(isEdit ? 'view' : 'list'); if (!isEdit) resetForm(); }} className="text-sm text-slate-500 hover:text-slate-900 transition">← Cancel</button>
          <h2 className="text-xl font-bold text-slate-900">{isEdit ? `Edit Invoice ${activeInvoice?.id}` : 'New Invoice'}</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
          {/* Customer + Terms */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Bill To *</label>
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
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Payment Terms</label>
              <select
                value={termDays}
                onChange={(e) => setTermDays(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
              >
                {PAYMENT_TERMS.map((t) => (
                  <option key={t.days} value={t.days}>{t.label}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">Due: {dueDate}</p>
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
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="e.g. Bank: Equity Bank | Acc: 0123456789 | Thank you for your business."
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
                <span>Total Due</span>
                <span className="tabular-nums">{formatKes(total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => { setView(isEdit ? 'view' : 'list'); if (!isEdit) resetForm(); }}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => isEdit ? saveEdit('draft') : saveInvoice('draft')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition shadow-sm"
            >
              Save as Draft
            </button>
            <button
              onClick={() => isEdit ? saveEdit('sent') : saveInvoice('sent')}
              className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white text-sm font-semibold hover:bg-[#1e3f8f] transition shadow-sm"
            >
              {isEdit ? 'Save Changes' : 'Save & Send'}
            </button>
            {!isEdit && (
              <button
                onClick={() => saveInvoice('paid')}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
              >
                Save &amp; Mark Paid
              </button>
            )}
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
          <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
          <p className="text-sm text-slate-500 mt-0.5">Issue, track, and collect payment on customer invoices</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2.5 rounded-lg bg-[#2B59C3] text-white font-semibold text-sm shadow-sm hover:bg-[#1e3f8f] transition"
        >
          + New Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Invoices', value: stats.total, color: 'text-slate-900' },
          { label: 'Unpaid', value: stats.unpaid, color: 'text-amber-600' },
          { label: 'Paid', value: stats.paid, color: 'text-emerald-600' },
          { label: 'Total Value', value: formatKes(stats.totalValue), color: 'text-[#2B59C3]' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice ID or customer..."
            className="w-full sm:w-72 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59C3]/40"
          />
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition capitalize ${
                  statusFilter === s
                    ? 'bg-[#2B59C3] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s === 'all' ? 'All' : STATUS_LABELS[s as InvoiceStatus]}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <div className="text-5xl mb-4">🧾</div>
            <p className="font-semibold text-slate-600 text-lg">No invoices found</p>
            <p className="text-sm mt-1">
              {invoices.length === 0
                ? 'Click "New Invoice" to create your first invoice'
                : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Invoice #</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Issue Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Due Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Items</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Total</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inv) => {
                  const cust = customers.find((c) => c.id === inv.customerId);
                  const isOverdue = new Date(inv.dueDate) < new Date() && inv.status === 'sent';
                  const displayStatus: InvoiceStatus = isOverdue ? 'overdue' : inv.status;
                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/70 transition cursor-pointer"
                      onClick={() => openView(inv)}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500 font-medium">{inv.id}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{cust?.name ?? inv.customerId}</td>
                      <td className="px-4 py-3.5 text-slate-500">{inv.createdAt.slice(0, 10)}</td>
                      <td className={`px-4 py-3.5 font-medium ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                        {inv.dueDate.slice(0, 10)}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{inv.items.length}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900 tabular-nums">{formatKes(inv.total)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[displayStatus]}`}>
                          {STATUS_LABELS[displayStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                          <button
                            onClick={() => markStatus(inv.id, 'paid')}
                            className="text-xs text-emerald-600 hover:underline font-semibold whitespace-nowrap"
                          >
                            Mark Paid
                          </button>
                        )}
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
