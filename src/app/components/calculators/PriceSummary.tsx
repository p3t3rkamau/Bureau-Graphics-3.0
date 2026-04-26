import { useState } from 'react';
import { ShoppingCart, MessageSquare, Check } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

interface LineItem {
  label: string;
  value: string;
}

interface PriceSummaryProps {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  lineItems: LineItem[];
  total: number;
  totalLabel?: string;
  discountAmount?: number;
  discountLabel?: string;
  cartConfig: Record<string, string | number | boolean | undefined>;
  cartQty: number;
}

export function PriceSummary({
  productId,
  productName,
  productImage,
  price,
  originalPrice,
  lineItems,
  total,
  totalLabel = 'Total',
  discountAmount,
  discountLabel,
  cartConfig,
  cartQty,
}: PriceSummaryProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId,
      productName,
      productImage,
      config: cartConfig,
      quantity: cartQty,
      unitPrice: Math.round(total / cartQty),
      totalPrice: Math.round(total),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-2">{productName}</h1>
      <div className="mb-6">
        <span className="text-3xl font-bold text-[#EF233C]">
          KES {price.toLocaleString()}
        </span>
        {originalPrice && (
          <span className="text-gray-400 line-through ml-3 text-lg">
            KES {originalPrice.toLocaleString()}
          </span>
        )}
        <span className="text-gray-500 ml-2 text-sm">starting price</span>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
        {lineItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
        {discountAmount !== undefined && discountAmount > 0 && discountLabel && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>{discountLabel}</span>
            <span>− KES {discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold text-[#EF233C] pt-3 border-t border-gray-200 mt-2">
          <span>{totalLabel}:</span>
          <span>KES {Math.round(total).toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
            added
              ? 'bg-green-500 text-white scale-[0.99]'
              : 'bg-[#EF233C] hover:bg-red-700 text-white active:scale-[0.99]'
          }`}
        >
          {added ? (
            <><Check className="h-5 w-5" />Added to Cart!</>
          ) : (
            <><ShoppingCart className="h-5 w-5" />Add to Cart</>
          )}
        </button>

        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-[#2B59C3] text-[#2B59C3] font-semibold text-base hover:bg-blue-50 transition-colors">
          <MessageSquare className="h-5 w-5" />
          Get a Quote
        </button>
      </div>
    </div>
  );
}
