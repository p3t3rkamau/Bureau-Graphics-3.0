import { Link } from 'react-router';
import { Check, Phone, MessageSquare, ArrowRight, Star, Zap, Building2 } from 'lucide-react';

const packages = [
  {
    id: 'starter',
    name: 'Starter Pack',
    subtitle: 'Perfect for new businesses',
    price: 15000,
    icon: Zap,
    color: 'border-gray-200',
    badge: null,
    items: [
      '250 Standard Business Cards (matt lamination)',
      '500 A5 Flyers (single-sided)',
      '1 Roll-up Banner (85×200cm)',
      'Logo design (3 concepts)',
      'Free delivery within Nairobi',
    ],
    cta: 'Get Starter Pack',
    ctaStyle: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-50',
  },
  {
    id: 'growth',
    name: 'Growth Pack',
    subtitle: 'For growing SMEs',
    price: 35000,
    icon: Star,
    color: 'border-[#EF233C]',
    badge: 'Most Popular',
    items: [
      '500 Premium Business Cards (soft-touch)',
      '1,000 A5 Flyers (double-sided)',
      '2 Roll-up Banners',
      '1 Adjustable Backdrop (2×2m)',
      'Full brand identity (logo + letterhead + email sig)',
      '10 Branded T-shirts',
      'Priority 48-hour turnaround',
      'Free delivery within Nairobi',
    ],
    cta: 'Get Growth Pack',
    ctaStyle: 'bg-[#EF233C] text-white hover:bg-red-700',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    subtitle: 'For established businesses & events',
    price: 80000,
    icon: Building2,
    color: 'border-[#2B59C3]',
    badge: 'Best Value',
    items: [
      '1,000 Premium Business Cards',
      '2,000 A5 Flyers + 500 A4 Posters',
      '3 Roll-up Banners + 1 Backdrop',
      'Full brand identity kit',
      '50 Branded T-shirts',
      '5 Event table cloths',
      'Branded stickers (500pcs)',
      'Dedicated account manager',
      'Express 24-hour turnaround',
      'Free delivery anywhere in Kenya',
    ],
    cta: 'Get Enterprise Pack',
    ctaStyle: 'bg-[#2B59C3] text-white hover:bg-blue-700',
  },
];

const faqs = [
  { q: 'Can I customise a package?',         a: 'Absolutely. Every package is a starting point — we can swap, add or remove items to match your exact needs and budget.' },
  { q: 'How do I pay?',                       a: 'M-Pesa, bank transfer or cash on pickup. We require 50% deposit before production starts.' },
  { q: 'How long does a package take?',       a: 'Starter packs are ready in 3–5 business days. Growth and Enterprise packs in 5–7 days. Express available.' },
  { q: 'Do you work with NGOs and churches?', a: 'Yes — we offer special rates for registered NGOs, churches and schools. Call us to discuss.' },
];

export function BusinessPackages() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <span className="inline-block bg-red-50 text-[#EF233C] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Business Packages
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Everything your business needs to look professional — in one package.
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg mb-8">
            Launching a new business or refreshing your brand? Our bundles combine the
            most-ordered items at a discounted rate, with a dedicated designer included.
          </p>
          <a
            href="tel:0746174084"
            className="inline-flex items-center gap-2 bg-[#EF233C] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            <Phone className="h-5 w-5" />
            Talk to us — 0746 174 084
          </a>
        </div>
      </div>

      {/* Packages grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {packages.map(pkg => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl border-2 ${pkg.color} shadow-sm overflow-hidden flex flex-col`}
              >
                {/* Badge */}
                {pkg.badge ? (
                  <div className="bg-[#EF233C] text-white text-xs font-bold text-center py-1.5 tracking-wide uppercase">
                    {pkg.badge}
                  </div>
                ) : (
                  <div className="h-7" />
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{pkg.name}</h3>
                      <p className="text-xs text-gray-400">{pkg.subtitle}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 mb-5">
                    <span className="text-3xl font-bold text-[#EF233C]">
                      KES {pkg.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">/ package</span>
                  </div>

                  {/* Items */}
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {pkg.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={`https://wa.me/254746174084?text=Hi, I'm interested in the ${encodeURIComponent(pkg.name)} (KES ${pkg.price.toLocaleString()}). Please send me more details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-colors ${pkg.ctaStyle}`}
                  >
                    {pkg.cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom quote CTA */}
        <div className="mt-8 bg-gray-900 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="font-bold text-xl mb-1">Need something custom?</h3>
            <p className="text-gray-400 text-sm">
              Large event? Corporate rollout? Government tender? We'll build a package to your exact spec and budget.
            </p>
          </div>
          <a
            href="https://wa.me/254746174084?text=Hi, I need a custom printing package quote."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <MessageSquare className="h-5 w-5 text-green-500" />
            Request Custom Quote
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="font-semibold text-gray-900 mb-1.5">{item.q}</p>
              <p className="text-sm text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}