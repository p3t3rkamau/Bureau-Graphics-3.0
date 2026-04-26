import { Link } from 'react-router';
import { HeroCarousel } from '../components/HeroCarousel';
import { categories, products } from '../data/products';
import { Button } from '../components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';

const serviceGroups = [
  { title: 'Campaign Materials', category: 'election-printing' },
  { title: 'Digital Printing', category: 'digital-printing' },
  { title: 'Large Format Printing', category: 'banners' },
  { title: 'Branded Apparel Printing', category: 'branded-apparel' },
];

const faqItems = [
  { q: 'Do you offer free delivery?', a: 'Yes. Orders above KES 2,500 get free delivery in supported zones.' },
  { q: 'Can I request express or rush jobs?', a: 'Yes. You can choose standard, express, or rush turnaround at checkout.' },
  { q: 'Can I upload my own artwork?', a: 'Absolutely. You can upload print-ready files or request design assistance.' },
  { q: 'Do you support business bulk orders?', a: 'Yes, we support enterprise and recurring procurement workflows.' },
];

export function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-white">
      <HeroCarousel />

      <section className="py-14 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#2B59C3] mb-6">Explore Print Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <Link key={category.id} to={`/products/${category.id}`} className="border border-blue-100 rounded-xl p-4 hover:shadow-md transition">
                <p className="font-medium text-sm text-gray-900">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Popular Products</h2>
            <Link to="/categories"><Button variant="outline" className="border-[#EF233C] text-[#EF233C]">Browse All <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.slice(0, 8).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#2B59C3]">
                <div className="aspect-[4/3] bg-gray-100">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-[#EF233C] font-bold mt-1">KES {product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Solutions for Every Print Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceGroups.map((group) => (
              <Link key={group.title} to={`/products/${group.category}`} className="p-5 rounded-xl border bg-white border-blue-100 hover:border-[#EF233C]">
                <p className="font-semibold text-[#2B59C3]">{group.title}</p>
                <p className="text-sm text-gray-500 mt-1">Curated products and pricing tiers</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#2B59C3] text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold">Built for speed. Designed for Kenyan brands.</h2>
          <p className="mt-3 text-blue-100">Blue + red visual refresh with a product-first pricing experience.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Printing Services FAQ</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={item.q} className="border rounded-xl">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="font-medium">{item.q}</span>
                  <Plus className={`w-4 h-4 transition ${openFaq === i ? 'rotate-45 text-[#EF233C]' : ''}`} />
                </button>
                {openFaq === i && <p className="px-4 pb-4 text-sm text-gray-600">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
