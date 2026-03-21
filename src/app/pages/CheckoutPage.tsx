import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';

type Step = 'details' | 'confirm' | 'done';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('details');

  const DELIVERY_FEE = totalPrice >= 10000 ? 0 : 500;
  const grandTotal   = totalPrice + DELIVERY_FEE;

  const [form, setForm] = useState({
    name: '', phone: '', email: '', delivery: 'pickup', address: '', notes: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleConfirm = () => {
    // TODO: send order to Supabase / email / WhatsApp API
    clearCart();
    setStep('done');
  };

  // ── Order placed ─────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Received!</h1>
          <p className="text-gray-500 mb-2">
            Thank you, <span className="font-semibold text-gray-800">{form.name}</span>. We've received your order.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Our team will contact you on <span className="font-semibold">{form.phone}</span> within 30 minutes to confirm details and share your artwork brief.
          </p>
          <a
            href={`https://wa.me/254746174084?text=Hi, I just placed an order on BureauGraphics.com. My name is ${encodeURIComponent(form.name)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold mb-3 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            Chat with us on WhatsApp
          </a>
          <Link
            to="/"
            className="block w-full py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Confirm step ──────────────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <button onClick={() => setStep('details')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#EF233C] mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to details
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <h2 className="font-bold text-lg mb-4">Confirm Your Order</h2>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{form.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium">{form.phone}</span></div>
              {form.email && <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{form.email}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="font-medium capitalize">{form.delivery === 'pickup' ? 'Pickup from shop' : `Delivery to ${form.address}`}</span></div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">{item.productName} ×{item.quantity}</span>
                  <span className="font-medium">KES {Math.round(item.totalPrice).toLocaleString()}</span>
                </div>
              ))}
              {DELIVERY_FEE > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Delivery fee</span><span>KES {DELIVERY_FEE}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#EF233C]">KES {Math.round(grandTotal).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-[#EF233C] hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Place Order
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            By placing this order you agree to our terms. We'll confirm via WhatsApp or call.
          </p>
        </div>
      </div>
    );
  }

  // ── Details form ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/categories" className="text-[#EF233C] hover:underline">Browse products →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link to="/cart" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#EF233C] mb-1">
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold mb-5">Your Details</h2>
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Jane Wanjiru"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone Number *</span>
                  </label>
                  <input required value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email (optional)</span>
                  </label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold mb-5">Delivery Method</h2>
              <div className="space-y-3">
                {[
                  { k: 'pickup',   l: 'Pickup from shop',    d: 'Free · Ready in 2–3 business days · Wilson, Nairobi' },
                  { k: 'delivery', l: 'Deliver to my address', d: `KES ${DELIVERY_FEE > 0 ? DELIVERY_FEE : '0 (free — you qualify!)'} · Nairobi & environs` },
                ].map(opt => (
                  <label key={opt.k}
                    className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form.delivery === opt.k ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="radio" name="delivery" value={opt.k} checked={form.delivery === opt.k}
                      onChange={() => set('delivery', opt.k)} className="mt-0.5 accent-[#EF233C]" />
                    <div>
                      <p className="font-medium text-sm">{opt.l}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.d}</p>
                    </div>
                  </label>
                ))}
              </div>

              {form.delivery === 'delivery' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Delivery Address *</span>
                  </label>
                  <input required={form.delivery === 'delivery'} value={form.address}
                    onChange={e => set('address', e.target.value)}
                    placeholder="Street, building, area — e.g. Westlands, Mpaka Road"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C]" />
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Notes (optional)</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                placeholder="Artwork instructions, special requests, preferred finish..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C] resize-none" />
            </div>

            <button type="submit"
              className="w-full bg-[#EF233C] hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-colors">
              Review Order →
            </button>
          </form>

          {/* Order summary sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.productImage} alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-gray-400">×{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-[#EF233C] flex-shrink-0">
                      KES {Math.round(item.totalPrice).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>KES {Math.round(totalPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span className={DELIVERY_FEE === 0 ? 'text-green-600 font-medium' : ''}>
                    {DELIVERY_FEE === 0 ? 'FREE' : `KES ${DELIVERY_FEE}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#EF233C]">KES {Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}