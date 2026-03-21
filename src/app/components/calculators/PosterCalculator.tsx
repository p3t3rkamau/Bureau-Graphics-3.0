import { useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }
type PosterSize  = 'a3'|'a2'|'a1'|'a0';
type PaperFinish = 'gloss'|'matte'|'canvas';

const BASE_PRICES: Record<PosterSize,number> = { a3:300, a2:600, a1:1200, a0:2400 };
const SIZE_DIMS:  Record<PosterSize,string>  = { a3:'297×420mm', a2:'420×594mm', a1:'594×841mm', a0:'841×1189mm' };

export function PosterCalculator({ product }: Props) {
  const [size, setSize]     = useState<PosterSize>('a3');
  const [paper, setPaper]   = useState<PaperFinish>('gloss');
  const [qty, setQty]       = useState(1);
  const [framing, setFraming] = useState(false);

  const canvasExtra    = paper === 'canvas' ? 400 : 0;
  const framingExtra   = framing ? 800 : 0;
  const priceEach      = BASE_PRICES[size] + canvasExtra + framingExtra;
  const discount       = qty >= 20 ? 0.1 : qty >= 10 ? 0.05 : 0;
  const subtotal       = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total          = subtotal - discountAmount;

  const lineItems = [
    { label: `${size.toUpperCase()} poster (${paper})`,        value: `KES ${BASE_PRICES[size].toLocaleString()}` },
    ...(canvasExtra  > 0 ? [{label:'Canvas upgrade',           value:`+ KES ${canvasExtra}`}]  : []),
    ...(framingExtra > 0 ? [{label:'Frame & mount',            value:`+ KES ${framingExtra}`}] : []),
    { label: `× ${qty} piece${qty>1?'s':''}`,                  value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm" />
          <span className="font-semibold">Poster Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Poster Size</label>
          <div className="grid grid-cols-2 gap-3">
            {(['a3','a2','a1','a0'] as PosterSize[]).map(s=>(
              <button key={s} onClick={()=>setSize(s)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${size===s?'border-[#EF233C] bg-red-50 text-[#EF233C]':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-lg">{s.toUpperCase()}</div>
                <div className="text-xs text-gray-500 mt-0.5">{SIZE_DIMS[s]}</div>
                <div className="text-sm font-semibold mt-1">KES {BASE_PRICES[s].toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Paper / Finish</label>
          <div className="grid grid-cols-3 gap-2">
            {[{k:'gloss',l:'Gloss',d:'Vivid & shiny'},{k:'matte',l:'Matte',d:'No glare'},{k:'canvas',l:'Canvas',d:'+KES 400'}].map(opt=>(
              <button key={opt.k} onClick={()=>setPaper(opt.k as PaperFinish)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${paper===opt.k?'border-[#EF233C] bg-red-50':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500">{opt.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Add-ons</label>
          <button onClick={()=>setFraming(f=>!f)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${framing?'border-[#EF233C] bg-red-50':'border-gray-200 hover:border-gray-400'}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">Frame & Mount</div>
                <div className="text-xs text-gray-500">Aluminium frame, ready to hang</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#EF233C] text-sm font-medium">+KES 800</span>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${framing?'bg-[#EF233C] border-[#EF233C]':'border-gray-300'}`}>
                  {framing && <span className="text-white text-xs font-bold">✓</span>}
                </div>
              </div>
            </div>
          </button>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-5 gap-2">
            {[1,2,5,10,20].map(q=>(
              <button key={q} onClick={()=>setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty===q?'border-[#EF233C] bg-red-50 text-[#EF233C]':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
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
        cartConfig={{ size: size.toUpperCase(), paper, framing: framing?'With frame':'No frame', qty }}
        cartQty={qty}
      />
    </div>
  );
}
