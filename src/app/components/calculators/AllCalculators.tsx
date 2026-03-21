// ─── BannerCalculator.tsx ────────────────────────────────────────────────────
import { useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }

const BANNER_SIZES: Record<string, { label: string; price: number }> = {
  '60x160': { label: '60cm × 160cm (Standard)', price: 3500 },
  '80x200': { label: '80cm × 200cm (Tall)', price: 4500 },
  '100x200': { label: '100cm × 200cm (Wide)', price: 5500 },
  'custom': { label: 'Custom Size', price: 0 },
};

export function BannerCalculator({ product }: Props) {
  const [size, setSize] = useState('60x160');
  const [finishing, setFinishing] = useState<'none' | 'eyelets' | 'pole-pockets'>('eyelets');
  const [qty, setQty] = useState(1);

  const basePrice = size === 'custom' ? product.price : BANNER_SIZES[size].price;
  const finishingExtra = finishing === 'eyelets' ? 0 : finishing === 'pole-pockets' ? 200 : 0;
  const priceEach = basePrice + finishingExtra;
  const discount = qty >= 10 ? 0.1 : qty >= 5 ? 0.05 : 0;
  const subtotal = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  const lineItems = [
    { label: `${BANNER_SIZES[size]?.label ?? 'Custom size'} × ${qty}`, value: `KES ${priceEach.toLocaleString()} each` },
    ...(finishingExtra > 0 ? [{ label: 'Pole pockets', value: `+ KES ${finishingExtra}` }] : []),
    { label: 'Subtotal', value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm"></div>
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
              { key: 'eyelets', label: 'Eyelets (Included)', desc: 'Metal rings for hanging — included' },
              { key: 'pole-pockets', label: 'Pole Pockets', desc: 'Top & bottom sleeve for poles — +KES 200' },
              { key: 'none', label: 'No Finishing', desc: 'Raw print only' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setFinishing(opt.key as any)}
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
        productName={product.name}
        price={product.price}
        originalPrice={product.originalPrice}
        lineItems={lineItems}
        total={total}
        discountAmount={discountAmount}
        discountLabel={discount > 0 ? `Bulk discount (${discount * 100}%)` : undefined}
      />
    </div>
  );
}


// ─── FlyerCalculator.tsx ─────────────────────────────────────────────────────
const FLYER_SIZES: Record<string, { label: string; priceEach: number }> = {
  a6: { label: 'A6 (148×105mm)', priceEach: 5 },
  a5: { label: 'A5 (210×148mm)', priceEach: 8 },
  a4: { label: 'A4 (297×210mm)', priceEach: 15 },
  dl: { label: 'DL (99×210mm)', priceEach: 6 },
};

const FLYER_QTY = [100, 250, 500, 1000, 2000, 5000];

export function FlyerCalculator({ product }: Props) {
  const [size, setSize] = useState('a5');
  const [sides, setSides] = useState<'single' | 'double'>('single');
  const [qty, setQty] = useState(500);
  const [paper, setPaper] = useState('artpaper-150gsm');

  const priceEach = FLYER_SIZES[size].priceEach * (sides === 'double' ? 1.5 : 1);
  const discount = qty >= 2000 ? 0.15 : qty >= 1000 ? 0.1 : qty >= 500 ? 0.05 : 0;
  const subtotal = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  const lineItems = [
    { label: `${qty} × ${FLYER_SIZES[size].label} (${sides}-sided)`, value: `KES ${priceEach.toFixed(2)}/pc` },
    { label: 'Subtotal', value: `KES ${Math.round(subtotal).toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm"></div>
          <span className="font-semibold">Flyer Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Flyer Size</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(FLYER_SIZES).map(([key, val]) => (
              <button key={key} onClick={() => setSize(key)}
                className={`p-3 border-2 rounded-lg text-left transition-all ${size === key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{val.label}</div>
                <div className="text-xs text-[#EF233C]">from KES {val.priceEach}/pc</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Print Sides</label>
          <div className="grid grid-cols-2 gap-3">
            {(['single', 'double'] as const).map(s => (
              <button key={s} onClick={() => setSides(s)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${sides === s ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-semibold text-sm capitalize">{s}-sided</div>
                <div className="text-xs text-gray-500">{s === 'double' ? '+50%' : 'Standard'}</div>
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
        productName={product.name}
        price={product.price}
        originalPrice={product.originalPrice}
        lineItems={lineItems}
        total={total}
        discountAmount={discountAmount}
        discountLabel={discount > 0 ? `Bulk discount (${discount * 100}%)` : undefined}
      />
    </div>
  );
}


// ─── StickerCalculator.tsx ───────────────────────────────────────────────────
export function StickerCalculator({ product }: Props) {
  const [shape, setShape] = useState<'circle' | 'square' | 'custom'>('circle');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [qty, setQty] = useState(100);
  const [finish, setFinish] = useState<'gloss' | 'matt' | 'reflective'>('gloss');

  const basePrices = { small: 20, medium: 35, large: 60 };
  const finishExtra = finish === 'reflective' ? 20 : 0;
  const shapeExtra = shape === 'custom' ? 10 : 0;
  const priceEach = basePrices[size] + finishExtra + shapeExtra;
  const discount = qty >= 500 ? 0.15 : qty >= 200 ? 0.1 : qty >= 100 ? 0.05 : 0;
  const subtotal = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  const lineItems = [
    { label: `${qty} × ${size} ${shape} stickers (${finish})`, value: `KES ${priceEach}/pc` },
    { label: 'Subtotal', value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm"></div>
          <span className="font-semibold">Sticker Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Shape</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'circle', label: '⭕ Circle' },
              { key: 'square', label: '⬛ Square / Rect' },
              { key: 'custom', label: '✂️ Die-Cut (+KES 10/pc)' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setShape(opt.key as any)}
                className={`p-3 border-2 rounded-lg text-center transition-all text-xs ${shape === opt.key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Size</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'small', label: 'Small', desc: 'up to 5cm' },
              { key: 'medium', label: 'Medium', desc: '5–10cm' },
              { key: 'large', label: 'Large', desc: '10–20cm' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setSize(opt.key as any)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${size === opt.key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Finish</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'gloss', label: 'Gloss', desc: 'Shiny & vivid' },
              { key: 'matt', label: 'Matt', desc: 'Clean & subtle' },
              { key: 'reflective', label: 'Reflective', desc: '+KES 20/pc' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setFinish(opt.key as any)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${finish === opt.key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 200, 500].map(q => (
              <button key={q} onClick={() => setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty === q ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
                <div className="text-xs text-gray-500">pcs</div>
              </button>
            ))}
          </div>
          {discount > 0 && <p className="text-green-600 text-xs mt-2">🎉 {discount * 100}% bulk discount applied!</p>}
        </div>
      </div>

      <PriceSummary
        productName={product.name}
        price={product.price}
        originalPrice={product.originalPrice}
        lineItems={lineItems}
        total={total}
        discountAmount={discountAmount}
        discountLabel={discount > 0 ? `Bulk discount (${discount * 100}%)` : undefined}
      />
    </div>
  );
}


// ─── TshirtCalculator.tsx ────────────────────────────────────────────────────
const TSHIRT_BASE = 800;

export function TshirtCalculator({ product }: Props) {
  const [printMethod, setPrintMethod] = useState<'dtf' | 'screen' | 'embroidery'>('dtf');
  const [printArea, setPrintArea] = useState<'front' | 'back' | 'both'>('front');
  const [qty, setQty] = useState(10);
  const [color, setColor] = useState<'white' | 'color'>('white');

  const shirtCost = color === 'white' ? 0 : 100;
  const methodCost = printMethod === 'embroidery' ? 400 : printMethod === 'screen' ? 150 : 200;
  const areaCost = printArea === 'both' ? methodCost : 0;
  const priceEach = TSHIRT_BASE + shirtCost + methodCost + areaCost;
  const discount = qty >= 50 ? 0.2 : qty >= 20 ? 0.1 : qty >= 10 ? 0.05 : 0;
  const subtotal = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  const lineItems = [
    { label: 'Base shirt', value: `KES ${TSHIRT_BASE + shirtCost}` },
    { label: `${printMethod.toUpperCase()} print (${printArea})`, value: `KES ${methodCost + areaCost}` },
    { label: `× ${qty} shirts`, value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm"></div>
          <span className="font-semibold">T-shirt Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">T-shirt Color</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ k: 'white', l: 'White', d: 'Standard price' }, { k: 'color', l: 'Colored', d: '+KES 100/shirt' }].map(opt => (
              <button key={opt.k} onClick={() => setColor(opt.k as any)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${color === opt.k ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500">{opt.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Print Method</label>
          <div className="space-y-2">
            {[
              { k: 'dtf', l: 'DTF (Direct to Film)', d: 'Full color, photographic quality • +KES 200' },
              { k: 'screen', l: 'Screen Printing', d: 'Best for bulk solid colors • +KES 150' },
              { k: 'embroidery', l: 'Embroidery', d: 'Premium stitched look • +KES 400' },
            ].map(opt => (
              <button key={opt.k} onClick={() => setPrintMethod(opt.k as any)}
                className={`w-full p-3 border-2 rounded-lg text-left transition-all ${printMethod === opt.k ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500">{opt.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Print Area</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: 'front', l: 'Front only' },
              { k: 'back', l: 'Back only' },
              { k: 'both', l: 'Front + Back' },
            ].map(opt => (
              <button key={opt.k} onClick={() => setPrintArea(opt.k as any)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${printArea === opt.k ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="text-xs font-medium">{opt.l}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity (shirts)</label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 20, 50].map(q => (
              <button key={q} onClick={() => setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty === q ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
                <div className="text-xs text-gray-500">shirts</div>
              </button>
            ))}
          </div>
          {discount > 0 && <p className="text-green-600 text-xs mt-2">🎉 {discount * 100}% bulk discount applied!</p>}
        </div>
      </div>

      <PriceSummary
        productName={product.name}
        price={product.price}
        originalPrice={product.originalPrice}
        lineItems={lineItems}
        total={total}
        discountAmount={discountAmount}
        discountLabel={discount > 0 ? `Bulk discount (${discount * 100}%)` : undefined}
      />
    </div>
  );
}


// ─── PosterCalculator.tsx ────────────────────────────────────────────────────
export function PosterCalculator({ product }: Props) {
  const [size, setSize] = useState<'a3' | 'a2' | 'a1' | 'a0'>('a3');
  const [paper, setPaper] = useState<'matte' | 'gloss' | 'canvas'>('gloss');
  const [qty, setQty] = useState(1);

  const basePrices = { a3: 300, a2: 600, a1: 1200, a0: 2400 };
  const paperExtra = paper === 'canvas' ? 400 : paper === 'matte' ? 0 : 0;
  const priceEach = basePrices[size] + paperExtra;
  const discount = qty >= 20 ? 0.1 : qty >= 10 ? 0.05 : 0;
  const subtotal = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  const lineItems = [
    { label: `${size.toUpperCase()} poster (${paper}) × ${qty}`, value: `KES ${priceEach.toLocaleString()}/pc` },
    { label: 'Subtotal', value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm"></div>
          <span className="font-semibold">Poster Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Poster Size</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: 'a3', l: 'A3', d: '297×420mm' },
              { k: 'a2', l: 'A2', d: '420×594mm' },
              { k: 'a1', l: 'A1', d: '594×841mm' },
              { k: 'a0', l: 'A0', d: '841×1189mm' },
            ].map(opt => (
              <button key={opt.k} onClick={() => setSize(opt.k as any)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${size === opt.k ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold">{opt.l}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.d}</div>
                <div className="text-xs font-medium mt-1">KES {basePrices[opt.k as keyof typeof basePrices].toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Paper / Finish</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: 'gloss', l: 'Gloss Paper', d: 'Vivid & shiny' },
              { k: 'matte', l: 'Matte Paper', d: 'No glare' },
              { k: 'canvas', l: 'Canvas Print', d: '+KES 400' },
            ].map(opt => (
              <button key={opt.k} onClick={() => setPaper(opt.k as any)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${paper === opt.k ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500">{opt.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 5, 10, 20].map(q => (
              <button key={q} onClick={() => setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty === q ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
              </button>
            ))}
          </div>
          {discount > 0 && <p className="text-green-600 text-xs mt-2">🎉 {discount * 100}% bulk discount applied!</p>}
        </div>
      </div>

      <PriceSummary
        productName={product.name}
        price={product.price}
        originalPrice={product.originalPrice}
        lineItems={lineItems}
        total={total}
        discountAmount={discountAmount}
        discountLabel={discount > 0 ? `Bulk discount (${discount * 100}%)` : undefined}
      />
    </div>
  );
}


// ─── SimpleCalculator.tsx — fallback for products without a custom calc ──────
export function SimpleCalculator({ product }: Props) {
  const [qty, setQty] = useState(1);
  const total = product.price * qty;

  const lineItems = [
    { label: `KES ${product.price.toLocaleString()} × ${qty}`, value: `KES ${total.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm"></div>
          <span className="font-semibold">Order Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 5, 10, 20].map(q => (
              <button key={q} onClick={() => setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty === q ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <PriceSummary
        productName={product.name}
        price={product.price}
        originalPrice={product.originalPrice}
        lineItems={lineItems}
        total={total}
      />
    </div>
  );
}
