import { generateId, nowIso } from '../../../../packages/shared/utils';
import { Invoice, InvoiceStatus, Quotation, QuotationStatus, Sale } from '../types';
import { dbKeys, read, write } from './db';
import { salesService } from './salesService';

export const quotationService = {
  getAll(): Quotation[] {
    return read(dbKeys.quotations, [] as Quotation[]);
  },
  update(id: string, data: Partial<Omit<Quotation, 'id' | 'createdAt'>>): void {
    const list = this.getAll().map((q) => (q.id === id ? { ...q, ...data } : q));
    write(dbKeys.quotations, list);
  },
  delete(id: string): void {
    write(dbKeys.quotations, this.getAll().filter((q) => q.id !== id));
  },
  create(quotation: Omit<Quotation, 'id' | 'createdAt' | 'status'>): Quotation {
    const q: Quotation = { ...quotation, id: generateId('qt'), createdAt: nowIso(), status: 'draft' };
    const list = this.getAll();
    list.unshift(q);
    write(dbKeys.quotations, list);
    return q;
  },
  updateStatus(id: string, status: QuotationStatus): void {
    const list = this.getAll().map((q) => (q.id === id ? { ...q, status } : q));
    write(dbKeys.quotations, list);
  },
  convertToInvoice(quotationId: string): Invoice | undefined {
    const quotation = this.getAll().find((q) => q.id === quotationId);
    if (!quotation) return;
    const invoice: Invoice = {
      id: generateId('inv'),
      branchId: quotation.branchId,
      customerId: quotation.customerId,
      items: quotation.items,
      subtotal: quotation.subtotal,
      vatTotal: quotation.vatTotal,
      total: quotation.total,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      paymentTermDays: 7,
      status: 'draft',
      notes: quotation.notes,
      createdAt: nowIso(),
    };
    const invoices = read(dbKeys.invoices, [] as Invoice[]);
    invoices.unshift(invoice);
    write(dbKeys.invoices, invoices);
    // Mark quotation as approved
    this.updateStatus(quotationId, 'approved');
    return invoice;
  },
};

export const invoiceService = {
  getAll(): Invoice[] {
    return read(dbKeys.invoices, [] as Invoice[]);
  },
  update(id: string, data: Partial<Omit<Invoice, 'id' | 'createdAt'>>): void {
    const list = this.getAll().map((inv) => (inv.id === id ? { ...inv, ...data } : inv));
    write(dbKeys.invoices, list);
  },
  delete(id: string): void {
    write(dbKeys.invoices, this.getAll().filter((inv) => inv.id !== id));
  },
  create(invoice: Omit<Invoice, 'id' | 'createdAt'>): Invoice {
    const inv: Invoice = { ...invoice, id: generateId('inv'), createdAt: nowIso() };
    const list = this.getAll();
    list.unshift(inv);
    write(dbKeys.invoices, list);
    return inv;
  },
  updateStatus(id: string, status: InvoiceStatus): void {
    const list = this.getAll().map((inv) => (inv.id === id ? { ...inv, status } : inv));
    write(dbKeys.invoices, list);
  },
  convertToSale(invoiceId: string): Sale | undefined {
    const invoice = this.getAll().find((item) => item.id === invoiceId);
    if (!invoice) return;
    const sale = salesService.createSale({
      branchId: invoice.branchId,
      customerId: invoice.customerId,
      items: invoice.items,
      discount: invoice.discountTotal ?? 0,
      vatRate: invoice.total > 0 ? Math.round((invoice.vatTotal / (invoice.total - invoice.vatTotal)) * 100) : 0,
      paymentMethod: 'cash',
      userId: 'usr_admin',
    });
    this.updateStatus(invoiceId, 'paid');
    return sale;
  },
};
