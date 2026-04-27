import { formatKes } from '../../../../packages/shared/utils';
import { Customer, Invoice, Quotation } from '../types';

const CO = {
  name: 'Bureau Graphics',
  tagline: 'Professional Print & Design Services — Nairobi',
  phone: '+254 700 000 000',
  email: 'info@bureaugraphics.co.ke',
  address: 'Tom Mboya Street, Nairobi CBD, Kenya',
  website: 'www.bureaugraphics.co.ke',
};

function shell(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#1e293b;background:#fff;padding:40px;max-width:820px;margin:0 auto}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #2B59C3}
.logo{font-size:26px;font-weight:900;color:#2B59C3;letter-spacing:-0.5px}
.co-sub{font-size:11px;color:#64748b;margin-top:5px;line-height:1.7}
.doc-label{font-size:24px;font-weight:800;text-align:right;color:#1e293b;letter-spacing:-0.3px}
.doc-id{font-family:monospace;font-size:13px;color:#2B59C3;text-align:right;margin-top:3px}
.doc-meta{font-size:12px;color:#64748b;text-align:right;margin-top:2px}
.badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:6px}
.b-draft{background:#f1f5f9;color:#64748b}
.b-sent{background:#dbeafe;color:#1d4ed8}
.b-paid,.b-approved{background:#dcfce7;color:#16a34a}
.b-overdue,.b-rejected{background:#fee2e2;color:#dc2626}
.b-expired,.b-cancelled{background:#f3f4f6;color:#6b7280}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:26px}
.lbl{font-size:10px;text-transform:uppercase;letter-spacing:.7px;color:#94a3b8;margin-bottom:5px;font-weight:600}
.val{font-size:13px;line-height:1.7;color:#374151}
.val strong{color:#111827;font-weight:700}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
thead{background:#f8fafc}
th{padding:9px 12px;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;border-bottom:2px solid #e2e8f0;font-weight:600}
th.r{text-align:right}
td{padding:9px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#374151}
td.r{text-align:right}
td.bold{font-weight:600;color:#111827}
.tot{display:flex;justify-content:flex-end;margin-bottom:24px}
.tot-box{width:260px}
.tot-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9}
.tot-row.disc{color:#dc2626}
.tot-grand{display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:#111827;border-top:2px solid #111827;padding-top:8px;margin-top:3px}
.notes{background:#f8fafc;border-left:3px solid #2B59C3;padding:10px 14px;border-radius:3px;margin-bottom:24px;font-size:12px;color:#475569;line-height:1.7}
.notes .lbl{margin-bottom:3px}
.footer{text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:16px;line-height:1.7}
@media print{body{padding:0}@page{size:A4;margin:15mm}}
</style></head><body>${body}</body></html>`;
}

function statusClass(s: string) {
  return `b-${s}`;
}

export const pdfService = {
  printQuotation(q: Quotation, customer: Customer | undefined): void {
    const rows = q.items
      .map((item, i) => {
        const amt = item.quantity * item.unitPrice * (1 - item.discount / 100);
        return `<tr>
          <td>${i + 1}</td>
          <td>${item.name}</td>
          <td class="r">${item.quantity.toLocaleString()}</td>
          <td class="r">${formatKes(item.unitPrice)}</td>
          <td class="r">${item.discount > 0 ? item.discount + '%' : '—'}</td>
          <td class="r bold">${formatKes(amt)}</td>
        </tr>`;
      })
      .join('');

    const body = `
      <div class="hdr">
        <div>
          <div class="logo">${CO.name}</div>
          <div class="co-sub">${CO.tagline}<br>${CO.phone} · ${CO.email}<br>${CO.address}</div>
        </div>
        <div>
          <div class="doc-label">QUOTATION</div>
          <div class="doc-id">${q.id}</div>
          <div class="doc-meta">Date: ${q.createdAt.slice(0, 10)}</div>
          <div class="doc-meta">Valid Until: ${q.validUntil.slice(0, 10)}</div>
          <div><span class="badge ${statusClass(q.status)}">${q.status}</span></div>
        </div>
      </div>
      <div class="grid2">
        <div>
          <div class="lbl">Quote To</div>
          <div class="val"><strong>${customer?.name ?? q.customerId}</strong><br>${customer?.phone ?? ''}${customer?.email ? '<br>' + customer.email : ''}</div>
        </div>
        <div>
          <div class="lbl">Payment Details</div>
          <div class="val">Ref: <strong>${q.id}</strong><br>Date: <strong>${q.createdAt.slice(0, 10)}</strong><br>Valid: <strong>${q.validUntil.slice(0, 10)}</strong></div>
        </div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th class="r">Qty</th><th class="r">Unit Price</th><th class="r">Disc%</th><th class="r">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="tot">
        <div class="tot-box">
          <div class="tot-row"><span>Subtotal</span><span>${formatKes(q.subtotal)}</span></div>
          <div class="tot-row"><span>VAT</span><span>${formatKes(q.vatTotal)}</span></div>
          <div class="tot-grand"><span>Total</span><span>${formatKes(q.total)}</span></div>
        </div>
      </div>
      ${q.notes ? `<div class="notes"><div class="lbl">Notes / Terms</div>${q.notes}</div>` : ''}
      <div class="footer">${CO.name} · ${CO.address}<br>${CO.phone} · ${CO.email} · ${CO.website}<br>Thank you for your business.</div>
    `;

    open(shell(`Quotation ${q.id} — ${CO.name}`, body));
  },

  printInvoice(inv: Invoice, customer: Customer | undefined): void {
    const rows = inv.items
      .map((item, i) => {
        const amt = item.quantity * item.unitPrice * (1 - item.discount / 100);
        return `<tr>
          <td>${i + 1}</td>
          <td>${item.name}</td>
          <td class="r">${item.quantity.toLocaleString()}</td>
          <td class="r">${formatKes(item.unitPrice)}</td>
          <td class="r">${item.discount > 0 ? item.discount + '%' : '—'}</td>
          <td class="r bold">${formatKes(amt)}</td>
        </tr>`;
      })
      .join('');

    const isOverdue = new Date(inv.dueDate) < new Date() && inv.status === 'sent';
    const displayStatus = isOverdue ? 'overdue' : inv.status;

    const body = `
      <div class="hdr">
        <div>
          <div class="logo">${CO.name}</div>
          <div class="co-sub">${CO.tagline}<br>${CO.phone} · ${CO.email}<br>${CO.address}</div>
        </div>
        <div>
          <div class="doc-label">INVOICE</div>
          <div class="doc-id">${inv.id}</div>
          <div class="doc-meta">Issue Date: ${inv.createdAt.slice(0, 10)}</div>
          <div class="doc-meta">Due Date: ${inv.dueDate.slice(0, 10)}</div>
          <div><span class="badge ${statusClass(displayStatus)}">${displayStatus}</span></div>
        </div>
      </div>
      <div class="grid2">
        <div>
          <div class="lbl">Bill To</div>
          <div class="val"><strong>${customer?.name ?? inv.customerId}</strong><br>${customer?.phone ?? ''}${customer?.email ? '<br>' + customer.email : ''}</div>
        </div>
        <div>
          <div class="lbl">Payment Details</div>
          <div class="val">Invoice: <strong>${inv.id}</strong><br>Due: <strong>${inv.dueDate.slice(0, 10)}</strong><br>Bank: Equity Bank · 0123456789</div>
        </div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th class="r">Qty</th><th class="r">Unit Price</th><th class="r">Disc%</th><th class="r">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="tot">
        <div class="tot-box">
          <div class="tot-row"><span>Subtotal</span><span>${formatKes(inv.subtotal)}</span></div>
          ${(inv.discountTotal ?? 0) > 0 ? `<div class="tot-row disc"><span>Discount</span><span>− ${formatKes(inv.discountTotal ?? 0)}</span></div>` : ''}
          <div class="tot-row"><span>VAT</span><span>${formatKes(inv.vatTotal)}</span></div>
          <div class="tot-grand"><span>Total Due</span><span>${formatKes(inv.total)}</span></div>
        </div>
      </div>
      ${inv.notes ? `<div class="notes"><div class="lbl">Notes</div>${inv.notes}</div>` : ''}
      <div class="footer">${CO.name} · ${CO.address}<br>${CO.phone} · ${CO.email} · ${CO.website}<br>Please pay by ${inv.dueDate.slice(0, 10)} · Thank you for your business.</div>
    `;

    open(shell(`Invoice ${inv.id} — ${CO.name}`, body));
  },
};

function open(html: string) {
  const win = window.open('', '_blank', 'width=900,height=720');
  if (!win) { alert('Allow pop-ups to export PDF'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 700);
}
