import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }

export function SimpleCalculator({ product }: Props) {
  const [qty, setQty] = useState(1);

  const discount       = qty >= 51 ? 0.1 : qty >= 11 ? 0.05 : 0;
  const subtotal       = product.price * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total          = subtotal - discountAmount;

  const lineItems = [
    { label: `KES ${product.price.toLocaleString()} × ${qty}`, value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm" />
          <span className="font-semibold">Order Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {[1,2,5,10,20].map(q=>(
              <button key={q} onClick={()=>setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty===q?'border-[#EF233C] bg-red-50 text-[#EF233C]':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="h-10 w-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Minus className="h-4 w-4" />
            </button>
            <input type="number" value={qty} min={1}
              onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))}
              className="flex-1 text-center border border-gray-200 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30" />
            <button onClick={()=>setQty(q=>q+1)} className="h-10 w-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {qty >= 11 && <p className="text-green-600 text-xs mt-2">🎉 {qty>=51?'10%':'5%'} bulk discount!</p>}
        </div>
      </div>

      <PriceSummary
        productId={product.id} productName={product.name} productImage={product.image}
        price={product.price} originalPrice={product.originalPrice}
        lineItems={lineItems} total={total}
        discountAmount={discountAmount} discountLabel={discount>0?`Bulk discount (${discount*100}%)`:undefined}
        cartConfig={{ qty }}
        cartQty={qty}
      />
    </div>
  );
}
