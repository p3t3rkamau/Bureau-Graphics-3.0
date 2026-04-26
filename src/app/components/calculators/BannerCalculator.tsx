import { useMemo, useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';
import { usePricing } from '../../../hooks/usePricing';
import { deliveryZones } from '../../pricing/config';

interface Props { product: Product; }

export function BannerCalculator({ product }: Props) {
  const [size, setSize] = useState<'narrow' | 'broad'>('narrow');
  const [material, setMaterial] = useState<'pvc' | 'premium' | 'mesh'>('pvc');
  const [finishing, setFinishing] = useState<'eyelets' | 'pole-pockets' | 'none'>('eyelets');
  const [quantity, setQuantity] = useState(1);
  const [turnaround, setTurnaround] = useState<'standard' | 'express' | 'rush'>('standard');
  const [deliveryZone, setDeliveryZone] = useState('cbd');
  const [designNeeded, setDesignNeeded] = useState(false);

  const input = useMemo(() => ({
    productType: 'banner' as const,
    quantity,
    turnaround,
    deliveryZone,
    options: { size, material, finishing, designNeeded },
  }), [quantity, turnaround, deliveryZone, size, material, finishing, designNeeded]);

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
        <h3 className="font-semibold">Banner Pricing</h3>

        <div className="grid grid-cols-2 gap-2">
          {(['narrow', 'broad'] as const).map((option) => (
            <button key={option} onClick={() => setSize(option)} className={`p-2 border rounded ${size === option ? 'border-[#EF233C] bg-red-50' : 'border-gray-200'}`}>{option}</button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['pvc', 'premium', 'mesh'] as const).map((option) => (
            <button key={option} onClick={() => setMaterial(option)} className={`p-2 border rounded ${material === option ? 'border-[#EF233C] bg-red-50' : 'border-gray-200'}`}>{option}</button>
          ))}
        </div>

        <select className="w-full border rounded p-2" value={finishing} onChange={(e) => setFinishing(e.target.value as typeof finishing)}>
          <option value="eyelets">Eyelets (included)</option>
          <option value="pole-pockets">Pole pockets (+KES 200)</option>
          <option value="none">No finishing</option>
        </select>

        <input className="w-full border rounded p-2" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
        {breakdown.selectedTier && <p className="text-xs text-green-700">Selected pricing tier: {breakdown.selectedTier.qty}+ units</p>}

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
          Need banner design (+KES 2,000)
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
