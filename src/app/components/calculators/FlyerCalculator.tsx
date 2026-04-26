import { useMemo, useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';
import { usePricing } from '../../../hooks/usePricing';
import { deliveryZones, freeDeliveryThreshold } from '../../pricing/config';

interface Props { product: Product; }

const FLYER_QTY = [50, 100, 200, 400, 500, 1000, 2000];

export function FlyerCalculator({ product }: Props) {
  const [size, setSize] = useState('A4');
  const [sides, setSides] = useState<'single' | 'double'>('double');
  const [paper, setPaper] = useState('artpaper-150gsm');
  const [quantity, setQuantity] = useState(50);
  const [deliveryZone, setDeliveryZone] = useState('nairobi');
  const [turnaround, setTurnaround] = useState<'standard' | 'express' | 'rush'>('standard');
  const [designNeeded, setDesignNeeded] = useState(false);

  const input = useMemo(() => ({
    productType: 'flyer' as const,
    quantity,
    deliveryZone,
    turnaround,
    options: { size, sides, paper, designNeeded },
  }), [quantity, deliveryZone, turnaround, size, sides, paper, designNeeded]);

  const { breakdown, total } = usePricing(input);

  const lineItems = [
    { label: 'Base price', value: `KES ${breakdown.basePrice.toLocaleString()}` },
    { label: 'Option adjustments', value: `KES ${breakdown.optionCosts.toLocaleString()}` },
    { label: 'Quantity discount', value: `− KES ${breakdown.quantityDiscount.toLocaleString()}` },
    { label: 'Add-ons', value: `KES ${breakdown.addonsCost.toLocaleString()}` },
    { label: `Turnaround (${turnaround})`, value: `KES ${breakdown.turnaroundFee.toLocaleString()}` },
    { label: `Delivery (${deliveryZone})`, value: `KES ${breakdown.deliveryFee.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-5">
        <h3 className="font-semibold">Flyer Pricing</h3>

        <div className="grid grid-cols-2 gap-2">
          {['A6', 'A5', 'A4', 'DL'].map((option) => (
            <button key={option} onClick={() => setSize(option)} className={`p-2 border rounded ${size === option ? 'border-[#EF233C] bg-red-50' : 'border-gray-200'}`}>
              {option}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(['single', 'double'] as const).map((option) => (
            <button key={option} onClick={() => setSides(option)} className={`p-2 border rounded capitalize ${sides === option ? 'border-[#EF233C] bg-red-50' : 'border-gray-200'}`}>
              {option}-sided
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {FLYER_QTY.map((qty) => (
            <button key={qty} onClick={() => setQuantity(qty)} className={`p-2 border rounded ${quantity === qty ? 'border-[#EF233C] bg-red-50' : 'border-gray-200'}`}>
              {qty}
            </button>
          ))}
        </div>
        {breakdown.selectedTier && <p className="text-xs text-green-700">Selected pricing tier: {breakdown.selectedTier.qty}+ pcs</p>}

        <select value={deliveryZone} onChange={(e) => setDeliveryZone(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(deliveryZones).map((zone) => <option key={zone} value={zone}>{zone.toUpperCase()}</option>)}
        </select>

        <div className="grid grid-cols-3 gap-2">
          {(['standard', 'express', 'rush'] as const).map((t) => (
            <button key={t} onClick={() => setTurnaround(t)} className={`p-2 border rounded capitalize ${turnaround === t ? 'border-[#2B59C3] bg-blue-50' : 'border-gray-200'}`}>{t}</button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={designNeeded} onChange={(e) => setDesignNeeded(e.target.checked)} />
          Need design service (+KES 1,500)
        </label>

        <p className="text-xs text-gray-500">Free delivery above KES {freeDeliveryThreshold.toLocaleString()}.</p>
      </div>

      <PriceSummary
        productId={product.id}
        productName={product.name}
        productImage={product.image}
        price={product.price}
        originalPrice={product.originalPrice}
        lineItems={lineItems}
        total={total}
        cartConfig={input.options}
        cartQty={quantity}
      />
    </div>
  );
}
