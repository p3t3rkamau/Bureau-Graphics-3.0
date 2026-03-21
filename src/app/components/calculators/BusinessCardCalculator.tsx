import { useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }

const QTY_OPTIONS = [100, 200, 500, 1000] as const;
type Qty = typeof QTY_OPTIONS[number];

const BASE_PRICES: Record<Qty, number> = { 100: 1500, 200: 2600, 500: 5500, 1000: 9000 };
const LAMINATION_PRICES: Record<string, number> = { none: 0, matt: 300, gloss: 300, 'soft-touch': 600 };

export function BusinessCardCalculator({ product }: Props) {
  const [sides, setSides]         = useState<'single' | 'double'>('double');
  const [qty, setQty]             = useState<Qty>(100);
  const [lamination, setLamination] = useState('matt');
  const [corners, setCorners]     = useState<'square' | 'rounded'>('square');

  const base           = BASE_PRICES[qty];
  const sidesExtra     = sides === 'double' ? Math.round(base * 0.3) : 0;
  const laminationExtra = LAMINATION_PRICES[lamination] ?? 0;
  const cornersExtra   = corners === 'rounded' ? 200 : 0;
  const total          = base + sidesExtra + laminationExtra + cornersExtra;

  const lineItems = [
    { label: `${qty} pcs base price`, value: `KES ${base.toLocaleString()}` },
    ...(sidesExtra > 0    ? [{ label: 'Double-sided',              value: `+ KES ${sidesExtra.toLocaleString()}` }] : []),
    ...(laminationExtra > 0 ? [{ label: `${lamination} lamination`, value: `+ KES ${laminationExtra.toLocaleString()}` }] : []),
    ...(cornersExtra > 0  ? [{ label: 'Rounded corners',           value: `+ KES ${cornersExtra.toLocaleString()}` }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm" />
          <span className="font-semibold">Business Card Calculator</span>
        </div>

        {/* Sides */}
        <div>
          <label className="block mb-3 font-medium text-sm">Print Sides</label>
          <div className="grid grid-cols-2 gap-3">
            {(['single', 'double'] as const).map(s => (
              <button key={s} onClick={() => setSides(s)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${sides === s ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-semibold text-sm capitalize">{s}-sided</div>
                <div className="text-xs text-gray-500 mt-0.5">{s === 'single' ? 'Front only' : 'Front + Back (+30%)'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-4 gap-2">
            {QTY_OPTIONS.map(q => (
              <button key={q} onClick={() => setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty === q ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
                <div className="text-xs text-gray-500">pcs</div>
              </button>
            ))}
          </div>
        </div>

        {/* Lamination */}
        <div>
          <label className="block mb-3 font-medium text-sm">Lamination</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'none',       label: 'No Lamination',   desc: 'Uncoated stock',        price: 'Free' },
              { key: 'matt',       label: 'Matt Lamination', desc: 'Soft, premium feel',    price: '+KES 300' },
              { key: 'gloss',      label: 'Gloss Lamination',desc: 'Vibrant & shiny',       price: '+KES 300' },
              { key: 'soft-touch', label: 'Soft Touch',      desc: 'Ultra velvety feel',    price: '+KES 600' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setLamination(opt.key)}
                className={`p-3 border-2 rounded-lg text-left transition-all ${lamination === opt.key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                <div className="text-xs text-[#EF233C] font-medium mt-1">{opt.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Corners */}
        <div>
          <label className="block mb-3 font-medium text-sm">Corners</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'square',  label: 'Square Corners',  desc: 'Standard',     price: 'Free' },
              { key: 'rounded', label: 'Rounded Corners', desc: '3.5mm radius', price: '+KES 200' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setCorners(opt.key as 'square' | 'rounded')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${corners === opt.key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                <div className="text-xs text-[#EF233C] font-medium mt-1">{opt.price}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <PriceSummary
        productId={product.id}
        productName={product.name}
        productImage={product.image}
        price={product.price}
        originalPrice={product.originalPrice}
        lineItems={lineItems}
        total={total}
        cartConfig={{ sides, qty, lamination, corners }}
        cartQty={1}
      />
    </div>
  );
}
