import { useState } from 'react';
import { mpesaService } from '../../services/mpesaService';

export function MpesaPage() {
  const [reference, setReference] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(0);

  const save = () => {
    mpesaService.addManual({ reference, phoneNumber, amount, status: 'confirmed' });
    setReference(''); setPhoneNumber(''); setAmount(0);
  };

  const rows = mpesaService.getAll();

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3">
      <h2 className="text-xl font-semibold">M-Pesa Tracking (API-ready)</h2>
      <p className="text-xs text-gray-500">Daraja API integration hook point: replace `mpesaService.addManual` with backend endpoint.</p>
      <div className="grid md:grid-cols-4 gap-2">
        <input className="border rounded p-2" placeholder="Transaction ref" value={reference} onChange={(e) => setReference(e.target.value)} />
        <input className="border rounded p-2" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <input className="border rounded p-2" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} />
        <button className="bg-[#2B59C3] text-white rounded" onClick={save}>Save payment</button>
      </div>
      <table className="w-full text-sm"><thead><tr><th className="text-left">Ref</th><th>Phone</th><th>Amount</th><th>Status</th><th>Time</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.reference}</td><td>{row.phoneNumber}</td><td>{row.amount}</td><td>{row.status}</td><td>{row.createdAt.slice(0,19)}</td></tr>)}</tbody></table>
    </div>
  );
}
