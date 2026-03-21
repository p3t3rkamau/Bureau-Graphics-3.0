import { useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }

const FLYER_SIZES: Record<string, { label: string; priceEach: number }> = {
  a6: { label: 'A6 (148×105mm)', priceEach: 5 },
  a5: { label: 'A5 (210×148mm)', priceEach: 8 },
  a4: { label: 'A4 (297×210mm)', priceEach: 15 },
  dl: { label: 'DL (99×210mm)',  priceEach: 6 },
};
const FLYER_QTY = [100, 250, 500, 1000, 2000, 5000];

export function FlyerCalculator({ product }: Props) {
  const [size, setSize]   = useState('a5');
  const [sides, setSides] = useState<'single'|'double'>('single');
  const [qty, setQty]     = useState(500);
  const [paper, setPaper] = useState('artpaper-150gsm');

  const priceEach      = FLYER_SIZES[size].priceEach * (sides === 'double' ? 1.5 : 1);
  const discount       = qty >= 2000 ? 0.15 : qty >= 1000 ? 0.1 : qty >= 500 ? 0.05 : 0;
  const subtotal       = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total          = subtotal - discountAmount;

  const lineItems = [
    { label: `${qty.toLocaleString()} × ${FLYER_SIZES[size].label} (${sides}-sided)`, value: `KES ${priceEach.toFixed(2)}/pc` },
    { label: 'Subtotal', value: `KES ${Math.round(subtotal).toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm" />
          <span className="font-semibold">Flyer Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Flyer Size</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(FLYER_SIZES).map(([key, val]) => (
              <button key={key} onClick={() => setSize(key)}
                className={`p-3 border-2 rounded-lg text-left transition-all ${size === key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{val.label}</div>
                <div className="text-xs text-[#EF233C] mt-0.5">from KES {val.priceEach}/pc</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Print Sides</label>
          <div className="grid grid-cols-2 gap-3">
            {(['single','double'] as const).map(s => (
              <button key={s} onClick={() => setSides(s)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${sides === s ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-semibold text-sm capitalize">{s}-sided</div>
                <div className="text-xs text-gray-500">{s === 'double' ? '+50%' : 'Standard'}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Paper Type</label>
          <div className="space-y-2">
            {[
              { k: 'bond-80gsm',      l: 'Bond Paper 80gsm',  d: 'Lightweight, economical' },
              { k: 'artpaper-150gsm', l: 'Artpaper 150gsm',   d: 'Glossy, recommended' },
              { k: 'artpaper-200gsm', l: 'Artpaper 200gsm',   d: 'Premium thick feel' },
            ].map(opt => (
              <button key={opt.k} onClick={() => setPaper(opt.k)}
                className={`w-full p-3 border-2 rounded-lg text-left transition-all ${paper === opt.k ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500">{opt.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-3 gap-2">
            {FLYER_QTY.map(q => (
              <button key={q} onClick={() => setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty === q ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q.toLocaleString()}</div>
                <div className="text-xs text-gray-500">pcs</div>
              </button>
            ))}
          </div>
          {discount > 0 && <p className="text-green-600 text-xs mt-2">🎉 {discount * 100}% bulk discount applied!</p>}
        </div>
      </div>

      <PriceSummary
        productId={product.id} productName={product.name} productImage={product.image}
        price={product.price} originalPrice={product.originalPrice}
        lineItems={lineItems} total={total}
        discountAmount={discountAmount} discountLabel={discount > 0 ? `Bulk discount (${discount * 100}%)` : undefined}
        cartConfig={{ size: FLYER_SIZES[size].label, sides, paper, qty }}
        cartQty={qty}
      />
    </div>
  );
}
