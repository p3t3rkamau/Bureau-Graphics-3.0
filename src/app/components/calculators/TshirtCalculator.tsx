import { useState } from 'react';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }
type Method = 'dtf'|'screen'|'embroidery';
type Area   = 'front'|'back'|'both';
type Color  = 'white'|'color';

const SHIRT_BASE = 800;

export function TshirtCalculator({ product }: Props) {
  const [color, setColor]   = useState<Color>('white');
  const [method, setMethod] = useState<Method>('dtf');
  const [area, setArea]     = useState<Area>('front');
  const [qty, setQty]       = useState(10);

  const shirtExtra  = color === 'color' ? 100 : 0;
  const methodCost: Record<Method,number> = { dtf:200, screen:150, embroidery:400 };
  const areaCost    = area === 'both' ? methodCost[method] : 0;
  const priceEach   = SHIRT_BASE + shirtExtra + methodCost[method] + areaCost;
  const discount    = qty >= 50 ? 0.2 : qty >= 20 ? 0.1 : qty >= 10 ? 0.05 : 0;
  const subtotal    = priceEach * qty;
  const discountAmount = Math.round(subtotal * discount);
  const total       = subtotal - discountAmount;

  const lineItems = [
    { label: `Base ${color} shirt`,                    value: `KES ${SHIRT_BASE + shirtExtra}` },
    { label: `${method.toUpperCase()} (${area} side${area==='both'?'s':''})`, value: `KES ${methodCost[method]+areaCost}` },
    { label: `× ${qty} shirt${qty>1?'s':''}`,          value: `KES ${subtotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm" />
          <span className="font-semibold">T-shirt Calculator</span>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Shirt Colour</label>
          <div className="grid grid-cols-2 gap-3">
            {[{k:'white',l:'White Shirt',d:'Standard price'},{k:'color',l:'Coloured Shirt',d:'+KES 100/shirt'}].map(opt=>(
              <button key={opt.k} onClick={()=>setColor(opt.k as Color)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${color===opt.k?'border-[#EF233C] bg-red-50':'border-gray-200 hover:border-gray-400'}`}>
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
              {k:'dtf',l:'DTF – Direct to Film',d:'Full colour, photographic quality • +KES 200/side'},
              {k:'screen',l:'Screen Printing',d:'Best for bulk solid colours • +KES 150/side'},
              {k:'embroidery',l:'Embroidery',d:'Premium stitched logo • +KES 400/side'},
            ].map(opt=>(
              <button key={opt.k} onClick={()=>setMethod(opt.k as Method)}
                className={`w-full p-3 border-2 rounded-lg text-left transition-all ${method===opt.k?'border-[#EF233C] bg-red-50':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500">{opt.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Print Area</label>
          <div className="grid grid-cols-3 gap-2">
            {[{k:'front',l:'Front only'},{k:'back',l:'Back only'},{k:'both',l:'Front + Back (×2)'}].map(opt=>(
              <button key={opt.k} onClick={()=>setArea(opt.k as Area)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${area===opt.k?'border-[#EF233C] bg-red-50':'border-gray-200 hover:border-gray-400'}`}>
                <div className="text-xs font-medium">{opt.l}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium text-sm">Quantity</label>
          <div className="grid grid-cols-4 gap-2">
            {[5,10,20,50].map(q=>(
              <button key={q} onClick={()=>setQty(q)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${qty===q?'border-[#EF233C] bg-red-50 text-[#EF233C]':'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-bold text-sm">{q}</div>
                <div className="text-xs text-gray-500">shirts</div>
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
        cartConfig={{ color, method, area, qty }}
        cartQty={qty}
      />
    </div>
  );
}
