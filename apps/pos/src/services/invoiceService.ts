import { generateId, nowIso } from '../../../../packages/shared/utils';
import { Invoice, Quotation, Sale } from '../types';
import { dbKeys, read, write } from './db';
import { salesService } from './salesService';

export const quotationService = {
  getAll(): Quotation[] {
    return read(dbKeys.quotations, [] as Quotation[]);
  },
  create(quotation: Omit<Quotation, 'id' | 'createdAt' | 'status'>): Quotation {
    const q: Quotation = { ...quotation, id: generateId('qt'), createdAt: nowIso(), status: 'draft' };
    const list = this.getAll();
    list.unshift(q);
    write(dbKeys.quotations, list);
    return q;
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
      status: 'draft',
      createdAt: nowIso(),
    };
    const invoices = read(dbKeys.invoices, [] as Invoice[]);
    invoices.unshift(invoice);
    write(dbKeys.invoices, invoices);
    return invoice;
  },
};

export const invoiceService = {
  getAll(): Invoice[] {
    return read(dbKeys.invoices, [] as Invoice[]);
  },
  convertToSale(invoiceId: string): Sale | undefined {
    const invoice = this.getAll().find((item) => item.id === invoiceId);
    if (!invoice) return;
    const sale = salesService.createSale({ branchId: invoice.branchId, customerId: invoice.customerId, items: invoice.items, discount: 0, vatRate: 0, paymentMethod: 'cash', userId: 'usr_admin' });
    const invoices = this.getAll().map((item) => (item.id === invoiceId ? { ...item, status: 'paid' } : item));
    write(dbKeys.invoices, invoices);
    return sale;
  },
};
