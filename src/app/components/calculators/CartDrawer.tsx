import { useEffect } from 'react';
import { Link } from 'react-router';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, ShoppingCart, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const DELIVERY_THRESHOLD = 10000;

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [closeCart]);

  const remaining = Math.max(0, DELIVERY_THRESHOLD - totalPrice);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-5 w-5 text-[#EF233C]" />
            <h2 className="font-bold text-base">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-[#EF233C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Free delivery progress ── */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            {remaining > 0 ? (
              <>
                <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-[#2B59C3]" />
                  Add <span className="font-semibold text-[#2B59C3] mx-0.5">KES {remaining.toLocaleString()}</span> for free delivery
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2B59C3] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalPrice / DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" /> 🎉 You qualify for free delivery!
              </p>
            )}
          </div>
        )}

        {/* ── Empty state ── */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-9 w-9 text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">Your cart is empty</h3>
            <p className="text-sm text-gray-400 mb-6">Browse our products and add items to get started.</p>
            <button
              onClick={closeCart}
              className="px-6 py-2.5 rounded-xl bg-[#EF233C] text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* ── Items list ── */}
        {items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3.5">
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} onClick={closeCart} className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        to={`/product/${item.productId}`}
                        onClick={closeCart}
                        className="font-medium text-sm leading-snug hover:text-[#2B59C3] transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Config tags — show max 3 to keep drawer tight */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {Object.entries(item.config).slice(0, 3).map(([k, v]) => (
                        <span key={k} className="text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-500 capitalize">
                          {String(v)}
                        </span>
                      ))}
                    </div>

                    {/* Qty + price */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1 py-0.5">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center hover:text-[#EF233C] disabled:opacity-30 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:text-[#EF233C] transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-[#EF233C]">
                        KES {Math.round(item.totalPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})
                </span>
                <span className="font-bold text-lg">KES {Math.round(totalPrice).toLocaleString()}</span>
              </div>

              {/* View full cart */}
              <Link
                to="/cart"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                View Full Cart
              </Link>

              {/* Checkout */}
              <Link
                to="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full bg-[#EF233C] hover:bg-red-700 text-white py-3.5 rounded-xl font-bold transition-colors"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="text-xs text-gray-400 text-center">
                We'll confirm your order details via WhatsApp
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
