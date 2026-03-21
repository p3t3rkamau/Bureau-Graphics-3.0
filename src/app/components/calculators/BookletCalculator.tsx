import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Product } from '../../data/products';
import { PriceSummary } from './PriceSummary';

interface Props { product: Product; }

const BINDING_PRICES: Record<string, number> = {
  'saddle-stitch': 50,
  'perfect-binding': 120,
  'spiral-binding': 90,
};

export function BookletCalculator({ product }: Props) {
  const [pageSize, setPageSize] = useState<'a4' | 'a5'>('a4');
  const [innerPrint, setInnerPrint] = useState<'bw' | 'color'>('bw');
  const [coverPrint, setCoverPrint] = useState<'color' | 'bw'>('color');
  const [pages, setPages] = useState(20);
  const [paperType, setPaperType] = useState('artpaper-150gsm');
  const [cover, setCover] = useState('artpaper-200gsm');
  const [binding, setBinding] = useState('saddle-stitch');
  const [copies, setCopies] = useState(1);

  const pageSizePrices = { a4: 45, a5: 35 };
  const innerPrintExtra = innerPrint === 'color' ? 30 : 0;
  const coverPrintExtra = coverPrint === 'color' ? 60 : 0;
  const bindingPrice = BINDING_PRICES[binding] ?? 50;

  const pricePerCopy =
    pageSizePrices[pageSize] * pages +
    innerPrintExtra * pages +
    coverPrintExtra +
    bindingPrice;

  const baseTotal = pricePerCopy * copies;
  const discount = copies >= 51 ? 0.1 : copies >= 11 ? 0.05 : 0;
  const discountAmount = Math.round(baseTotal * discount);
  const total = baseTotal - discountAmount;

  const lineItems = [
    { label: `${pages} pages × KES ${pageSizePrices[pageSize] + innerPrintExtra} (${pageSize.toUpperCase()}, ${innerPrint === 'bw' ? 'B&W' : 'Color'})`, value: `KES ${((pageSizePrices[pageSize] + innerPrintExtra) * pages).toLocaleString()}` },
    { label: `Cover (${coverPrint === 'color' ? 'Full Color' : 'B&W'})`, value: `KES ${coverPrintExtra}` },
    { label: `Binding (${binding.replace('-', ' ')})`, value: `KES ${bindingPrice}` },
    { label: `× ${copies} ${copies === 1 ? 'copy' : 'copies'}`, value: `KES ${baseTotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <div className="w-4 h-4 bg-[#EF233C] rounded-sm"></div>
          <span className="font-semibold">Booklet / Magazine Calculator</span>
        </div>

        {/* Page Size */}
        <div>
          <label className="block mb-3 font-medium text-sm">Page Size</label>
          <div className="grid grid-cols-2 gap-3">
            {(['a4', 'a5'] as const).map(s => (
              <button key={s} onClick={() => setPageSize(s)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${pageSize === s ? 'border-[#EF233C] bg-red-50 text-[#EF233C]' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-semibold">{s.toUpperCase()} Size</div>
                <div className="text-xs text-gray-500 mt-0.5">{s === 'a4' ? '210×297mm' : '148×210mm'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inner Pages Print */}
        <div>
          <label className="block mb-3 font-medium text-sm">Inner Pages Print</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ k: 'bw', l: 'Black & White', s: 'Most economical' }, { k: 'color', l: 'Full Color', s: '+KES 30/page' }].map(opt => (
              <button key={opt.k} onClick={() => setInnerPrint(opt.k as 'bw' | 'color')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${innerPrint === opt.k ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.s}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cover Print */}
        <div>
          <label className="block mb-3 font-medium text-sm">Cover Print</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ k: 'color', l: 'Full Color Cover', s: '+KES 60' }, { k: 'bw', l: 'B&W Cover', s: 'No extra charge' }].map(opt => (
              <button key={opt.k} onClick={() => setCoverPrint(opt.k as 'color' | 'bw')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${coverPrint === opt.k ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.l}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.s}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Number of Pages */}
        <div>
          <label className="block mb-3 font-medium text-sm">Number of Inner Pages</label>
          <p className="text-xs text-gray-400 mb-2">Must be in multiples of 4 (e.g. 8, 12, 16…)</p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => setPages(p => Math.max(8, p - 4))} className="h-10 w-10">
              <Minus className="h-4 w-4" />
            </Button>
            <Input type="number" value={pages}
              onChange={e => setPages(Math.max(8, Math.round((parseInt(e.target.value) || 8) / 4) * 4))}
              className="text-center flex-1" />
            <Button variant="outline" size="icon" onClick={() => setPages(p => p + 4)} className="h-10 w-10">
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-gray-500 text-sm">pages</span>
          </div>
        </div>

        {/* Paper Type */}
        <div>
          <label className="block mb-3 font-medium text-sm">Inner Paper</label>
          <Select value={paperType} onValueChange={setPaperType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bond-80gsm">Bond Paper 80gsm (standard)</SelectItem>
              <SelectItem value="artpaper-150gsm">Artpaper 150gsm (glossy)</SelectItem>
              <SelectItem value="artpaper-200gsm">Artpaper 200gsm (premium)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cover Stock */}
        <div>
          <label className="block mb-3 font-medium text-sm">Cover Stock</label>
          <Select value={cover} onValueChange={setCover}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="artpaper-200gsm">Artpaper 200gsm</SelectItem>
              <SelectItem value="artpaper-250gsm">Artpaper 250gsm</SelectItem>
              <SelectItem value="artpaper-300gsm">Artpaper 300gsm (premium)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Binding */}
        <div>
          <label className="block mb-3 font-medium text-sm">Binding</label>
          <div className="space-y-2">
            {[
              { key: 'saddle-stitch', label: 'Saddle Stitch (Staples)', desc: 'Up to 64 pages • +KES 50' },
              { key: 'perfect-binding', label: 'Perfect Binding (Glued Spine)', desc: 'For thicker books • +KES 120' },
              { key: 'spiral-binding', label: 'Spiral / Coil Binding', desc: 'Lies flat when open • +KES 90' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setBinding(opt.key)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${binding === opt.key ? 'border-[#EF233C] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Copies */}
        <div>
          <label className="block mb-3 font-medium text-sm">Number of Copies</label>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => setCopies(c => Math.max(1, c - 1))} className="h-10 w-10">
              <Minus className="h-4 w-4" />
            </Button>
            <Input type="number" value={copies}
              onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-center flex-1" />
            <Button variant="outline" size="icon" onClick={() => setCopies(c => c + 1)} className="h-10 w-10">
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-gray-500 text-sm">copies</span>
          </div>
          {copies >= 11 && (
            <p className="text-green-600 text-xs mt-2">
              🎉 {copies >= 51 ? '10% bulk discount applied!' : '5% discount applied for 11+ copies!'}
            </p>
          )}
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
