import { useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }
type Shape = 'circle'|'square'|'custom';
type Size  = 'small'|'medium'|'large';
type Finish= 'gloss'|'matt'|'reflective';

export function StickerCalculator({ product }: Props) {
  const [shape, setShape]   = useState<Shape>('circle');
  const [size, setSize]     = useState<Size>('medium');
  const [qty, setQty]       = useState(100);
  const [finish, setFinish] = useState<Finish>('gloss');

  const basePrices: Record<Size,number> = { small:20, medium:35, large:60 };
  const finishExtra = finish === 'reflective' ? 20 : 0;
  const shapeExtra  = shape === 'custom' ? 10 : 0;
  const priceEach   = basePrices[size] + finishExtra + shapeExtra;
  const discount    = qty >= 500 ? 0.15 : qty >= 200 ? 0.1 : qty >= 100 ? 0.05 : 0;
  const subtotal    = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total       = subtotal - discountAmount;

  const lineItems = [
    { label: `${qty} × ${size} ${shape} stickers (${finish})`, value: `KES ${priceEach}/pc` },
    { label: 'Subtotal', value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm" />
          <span className="font-semibold">Sticker Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Shape</label>
          <div className="grid grid-cols-3 gap-2">
            {[{k:'circle',l:'⭕ Circle'},{k:'square',l:'⬛ Square'},{k:'custom',l:'✂️ Die-Cut (+KES 10/pc)'}].map(opt=>(
              <button key={opt.k} onClick={()=>setShape(opt.k as Shape)}
                className={`p-3 border-2 rounded-lg text-center text-xs transition-all ${shape===opt.k?'border-[#EF233C] bg-red-50':'border-gray-200 hover:border-gray-400'}`}>
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Size</label>
          <div className="grid grid-cols-3 gap-2">
            {[{k:'small',l:'Small',d:'up to 5cm',p:'KES 20/pc'},{k:'medium',l:'Medium',d:'5–10cm',p:'KES 35/pc'},{k:'large',l:'Large',d:'10–20cm',p:'KES 60/pc'}].map(opt=>(
              <button key={opt.k} onClick={()=>setSize(opt.k as Size)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${size===opt.k?'border-[#EF233C] bg-red-50 text-[#EF233C]':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500">{opt.d}</div>
                <div className="text-xs font-medium mt-1">{opt.p}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Finish</label>
          <div className="grid grid-cols-3 gap-2">
            {[{k:'gloss',l:'Gloss',d:'Shiny'},{k:'matt',l:'Matt',d:'Subtle'},{k:'reflective',l:'Reflective',d:'+KES 20/pc'}].map(opt=>(
              <button key={opt.k} onClick={()=>setFinish(opt.k as Finish)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${finish===opt.k?'border-[#EF233C] bg-red-50':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500">{opt.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-4 gap-2">
            {[50,100,200,500].map(q=>(
              <button key={q} onClick={()=>setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty===q?'border-[#EF233C] bg-red-50 text-[#EF233C]':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
                <div className="text-xs text-gray-500">pcs</div>
              </button>
            ))}
          </div>
          {discount > 0 && <p className="text-green-600 text-xs mt-2">🎉 {discount*100}% bulk discount!</p>}
        </div>
      </div>

      <PriceSummary
        productId={product.id} productName={product.name} productImage={product.image}
        price={product.price} originalPrice={product.originalPrice}
        lineItems={lineItems} total={total}
        discountAmount={discountAmount} discountLabel={discount>0?`Bulk discount (${discount*100}%)`:undefined}
        cartConfig={{ shape, size, finish, qty }}
        cartQty={qty}
      />
    </div>
  );
}
