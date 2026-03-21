import { useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }

const BANNER_SIZES: Record<string, { label: string; price: number }> = {
  '60x160': { label: '60cm × 160cm (Standard)', price: 3500 },
  '80x200': { label: '80cm × 200cm (Tall)',     price: 4500 },
  '100x200':{ label: '100cm × 200cm (Wide)',    price: 5500 },
  'custom': { label: 'Custom Size',              price: 0   },
};

export function BannerCalculator({ product }: Props) {
  const [size, setSize]         = useState('60x160');
  const [finishing, setFinishing] = useState<'none'|'eyelets'|'pole-pockets'>('eyelets');
  const [qty, setQty]           = useState(1);

  const basePrice      = size === 'custom' ? product.price : BANNER_SIZES[size].price;
  const finishingExtra = finishing === 'pole-pockets' ? 200 : 0;
  const priceEach      = basePrice + finishingExtra;
  const discount       = qty >= 10 ? 0.1 : qty >= 5 ? 0.05 : 0;
  const subtotal       = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total          = subtotal - discountAmount;

  const lineItems = [
    { label: `${BANNER_SIZES[size]?.label ?? 'Custom'} × ${qty}`, value: `KES ${priceEach.toLocaleString()} each` },
    ...(finishingExtra > 0 ? [{ label: 'Pole pockets', value: `+ KES ${finishingExtra}` }] : []),
    { label: 'Subtotal', value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm" />
          <span className="font-semibold">Banner Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Banner Size</label>
          <div className="space-y-2">
            {Object.entries(BANNER_SIZES).map(([key, val]) => (
              <button key={key} onClick={() => setSize(key)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${size === key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{val.label}</span>
                  <span className="text-[#EF233C] text-sm font-medium">{val.price > 0 ? `KES ${val.price.toLocaleString()}` : 'Contact us'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Finishing</label>
          <div className="space-y-2">
            {[
              { key: 'eyelets',      label: 'Eyelets (Included)',  desc: 'Metal rings for hanging' },
              { key: 'pole-pockets', label: 'Pole Pockets',        desc: '+KES 200' },
              { key: 'none',         label: 'No Finishing',         desc: 'Raw print only' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setFinishing(opt.key as typeof finishing)}
                className={`w-full p-3 border-2 rounded-lg text-left transition-all ${finishing === opt.key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 5, 10].map(q => (
              <button key={q} onClick={() => setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty === q ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
              </button>
            ))}
          </div>
          {qty >= 5 && <p className="text-green-600 text-xs mt-2">🎉 {qty >= 10 ? '10%' : '5%'} bulk discount applied!</p>}
        </div>
      </div>

      <PriceSummary
        productId={product.id} productName={product.name} productImage={product.image}
        price={product.price} originalPrice={product.originalPrice}
        lineItems={lineItems} total={total}
        discountAmount={discountAmount} discountLabel={discount > 0 ? `Bulk discount (${discount * 100}%)` : undefined}
        cartConfig={{ size: BANNER_SIZES[size]?.label ?? 'Custom', finishing, qty }}
        cartQty={qty}
      />
    </div>
  );
}
