import { useState } from 'react';
import { Link } from 'react-router';
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft,
  Tag, Truck, Phone, ChevronRight, BadgePercent, AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const DELIVERY_THRESHOLD = 10000;
const DELIVERY_FEE       = 500;

export function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();

  const [promoCode, setPromoCode]   = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Valid promo codes
  const PROMO_CODES: Record<string, number> = {
    'BUREAU10': 0.10,
    'NEWCLIENT': 0.15,
  };

  const promoDiscount = promoApplied && PROMO_CODES[promoCode.toUpperCase()]
    ? Math.round(totalPrice * PROMO_CODES[promoCode.toUpperCase()])
    : 0;

  const deliveryFee      = (totalPrice - promoDiscount) >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal       = totalPrice - promoDiscount + deliveryFee;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Invalid promo code. Try BUREAU10 or NEWCLIENT.');
    }
  };

  // ── Empty state ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any products yet. Browse our printing catalogue to get started.
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 bg-[#EF233C] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ── Cart with items ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/categories"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#EF233C] transition-colors mb-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">
                Your Cart
                <span className="text-gray-400 font-normal text-lg ml-3">
                  ({totalItems} item{totalItems !== 1 ? 's' : ''})
                </span>
              </h1>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: Items list ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Free delivery progress bar */}
            {totalPrice < DELIVERY_THRESHOLD && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-[#2B59C3]" />
                  <span className="text-sm font-medium text-[#2B59C3]">
                    Add KES {(DELIVERY_THRESHOLD - totalPrice).toLocaleString()} more for free delivery!
                  </span>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2B59C3] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalPrice / DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {totalPrice >= DELIVERY_THRESHOLD && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">🎉 You qualify for free delivery!</span>
              </div>
            )}

            {/* Items */}
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex gap-4 p-5">
                  {/* Thumbnail */}
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-semibold text-gray-900 hover:text-[#2B59C3] transition-colors leading-snug"
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1 -mt-1 -mr-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Config chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries(item.config).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
                        >
                          <Tag className="h-3 w-3 text-gray-400" />
                          <span className="capitalize">{k}:</span>
                          <span className="font-medium">{String(v)}</span>
                        </span>
                      ))}
                    </div>

                    {/* Price row */}
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#EF233C]">
                          KES {Math.round(item.totalPrice).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">
                            KES {Math.round(item.unitPrice).toLocaleString()} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Need help banner */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-[#EF233C]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Need help with your order?</p>
                <a href="tel:0746174084" className="text-sm text-[#EF233C] font-semibold hover:underline">
                  Call 0746 174 084
                </a>
                <span className="text-sm text-gray-400"> — Mon–Sat, 8am to 6pm</span>
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ──────────────────────────────────────── */}
          <div className="space-y-4 sticky top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-lg">Order Summary</h2>
              </div>

              <div className="px-6 py-4 space-y-3">
                {/* Line items */}
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[60%]">
                        {item.productName}
                        <span className="text-gray-400 ml-1">×{item.quantity}</span>
                      </span>
                      <span className="font-medium">KES {Math.round(item.totalPrice).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">KES {Math.round(totalPrice).toLocaleString()}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <BadgePercent className="h-3.5 w-3.5" />
                        Promo ({promoCode.toUpperCase()})
                      </span>
                      <span className="font-medium">− KES {promoDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      Delivery
                    </span>
                    <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-[#EF233C]">
                      KES {Math.round(grandTotal).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo code */}
              <div className="px-6 pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoApplied(false); setPromoError(''); }}
                    placeholder="e.g. BUREAU10"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C] uppercase placeholder:normal-case"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {promoError}
                  </p>
                )}
                {promoApplied && (
                  <p className="text-xs text-green-600 mt-1.5 font-medium">
                    ✓ {Math.round(PROMO_CODES[promoCode.toUpperCase()] * 100)}% discount applied!
                  </p>
                )}
              </div>

              {/* Checkout button */}
              <div className="px-6 pb-6">
                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-[#EF233C] hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-colors"
                >
                  Proceed to Checkout
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Secure order · We'll confirm details via WhatsApp
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 space-y-3">
              {[
                { icon: '🔒', label: 'Secure & Confidential', desc: 'Your artwork is kept private' },
                { icon: '🚚', label: 'Fast Delivery',          desc: 'Nairobi CBD same-day available' },
                { icon: '✅', label: 'Quality Guaranteed',     desc: 'We reprint if not satisfied' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{b.label}</p>
                    <p className="text-xs text-gray-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}