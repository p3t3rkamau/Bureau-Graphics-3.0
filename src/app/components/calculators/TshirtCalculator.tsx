import { useMemo, useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';
import { usePricing } from '../../../hooks/usePricing';
import { deliveryZones } from '../../pricing/config';

interface Props { product: Product; }

export function TshirtCalculator({ product }: Props) {
  const [fit, setFit] = useState<'kids' | 'adult'>('adult');
  const [size, setSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'>('M');
  const [color, setColor] = useState<'white' | 'color'>('color');
  const [method, setMethod] = useState<'text' | 'image' | 'dtf' | 'screen' | 'embroidery'>('image');
  const [area, setArea] = useState<'front' | 'back' | 'both'>('front');
  const [quantity, setQuantity] = useState(1);
  const [turnaround, setTurnaround] = useState<'standard' | 'express' | 'rush'>('standard');
  const [deliveryZone, setDeliveryZone] = useState('nairobi');
  const [designNeeded, setDesignNeeded] = useState(false);

  const input = useMemo(() => ({
    productType: 'tshirt' as const,
    quantity,
    turnaround,
    deliveryZone,
    options: { fit, size, color, method, area, designNeeded },
  }), [quantity, turnaround, deliveryZone, fit, size, color, method, area, designNeeded]);

  const { breakdown, total } = usePricing(input);

  const lineItems = [
    { label: 'Base price', value: `KES ${breakdown.basePrice.toLocaleString()}` },
    { label: 'Option adjustments', value: `KES ${breakdown.optionCosts.toLocaleString()}` },
    { label: 'Quantity discount', value: `− KES ${breakdown.quantityDiscount.toLocaleString()}` },
    { label: 'Add-ons', value: `KES ${breakdown.addonsCost.toLocaleString()}` },
    { label: 'Turnaround fee', value: `KES ${breakdown.turnaroundFee.toLocaleString()}` },
    { label: 'Delivery fee', value: `KES ${breakdown.deliveryFee.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h3 className="font-semibold">T-shirt Pricing</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['kids', 'adult'] as const).map((option) => (
            <button key={option} onClick={() => setFit(option)} className={`p-2 border rounded ${fit === option ? 'border-[#EF233C] bg-red-50' : 'border-gray-200'}`}>{option}</button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const).map((option) => (
            <button key={option} onClick={() => setSize(option)} className={`p-2 border rounded ${size === option ? 'border-[#2B59C3] bg-blue-50' : 'border-gray-200'}`}>{option}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(['white', 'color'] as const).map((option) => (
            <button key={option} onClick={() => setColor(option)} className={`p-2 border rounded ${color === option ? 'border-[#EF233C] bg-red-50' : 'border-gray-200'}`}>{option}</button>
          ))}
        </div>

        <select className="w-full border rounded p-2" value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
          <option value="text">Text only</option>
          <option value="image">Image print</option>
          <option value="dtf">DTF</option>
          <option value="screen">Screen print</option>
          <option value="embroidery">Embroidery</option>
        </select>

        <div className="grid grid-cols-3 gap-2">
          {(['front', 'back', 'both'] as const).map((option) => (
            <button key={option} onClick={() => setArea(option)} className={`p-2 border rounded ${area === option ? 'border-[#EF233C] bg-red-50' : 'border-gray-200'}`}>{option}</button>
          ))}
        </div>

        <input className="w-full border rounded p-2" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />

        <select value={deliveryZone} onChange={(e) => setDeliveryZone(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(deliveryZones).map((zone) => <option key={zone} value={zone}>{zone.toUpperCase()}</option>)}
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={designNeeded} onChange={(e) => setDesignNeeded(e.target.checked)} />
          Need design support (+KES 1,200)
        </label>
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
