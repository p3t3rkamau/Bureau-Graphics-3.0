export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  featured?: boolean;
  calculatorType: CalculatorType;
  faq?: { q: string; a: string }[];
  templateUrl?: string;
}

export type CalculatorType =
  | 'business-cards'
  | 'booklet'
  | 'banner'
  | 'flyer'
  | 'sticker'
  | 'tshirt'
  | 'poster'
  | 'simple';

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const categories: Category[] = [
  { id: 'banners', name: 'Banners', image: 'outdoor banner printing' },
  { id: 'booklet-magazines', name: 'Booklet Magazines', image: 'booklet magazine printing' },
  { id: 'branded-apparel', name: 'Branded Apparel', image: 'branded tshirt printing' },
  { id: 'business-cards', name: 'Business Cards', image: 'business cards printing' },
  { id: 'digital-printing', name: 'Digital printing', image: 'digital printing service' },
  { id: 'election-printing', name: 'Election Printing', image: 'election campaign printing' },
  { id: 'events-display', name: 'Events Display', image: 'event display stands' },
  { id: 'flyers', name: 'Flyers', image: 'flyer printing service' },
  { id: 'graphic-design', name: 'Graphic Design', image: 'graphic design service' },
  { id: 'mug-drinkware', name: 'Mug Printing & Branded Drinkware', image: 'branded mug printing' },
  { id: 'packaging', name: 'Packaging', image: 'product packaging printing' },
  { id: 'photo-printing', name: 'Photo Printing and Framing', image: 'photo printing framing' },
  { id: 'posters', name: 'Posters', image: 'poster printing service' },
  { id: 'promotional-items', name: 'Promotional Items', image: 'promotional items printing' },
  { id: 'signages', name: 'Signages', image: 'signage printing' },
  { id: 'stationary', name: 'Stationary', image: 'stationary printing' },
  { id: 'stickers', name: 'Stickers', image: 'sticker printing rolls' },
  { id: 't-shirts', name: 'T-shirts', image: 'custom tshirt printing' },
];

export const products: Product[] = [
  // Banners
  {
    id: 'table-rollup',
    name: 'Table Rollup Printing',
    category: 'banners',
    price: 3500,
    originalPrice: 4000,
    image: 'https://images.unsplash.com/photo-1618472166504-e026a93dad9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsdXAlMjBiYW5uZXIlMjBzdGFuZHxlbnwxfHx8fDE3NzQwMDQ2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional table rollup banners perfect for trade shows and presentations',
    featured: true,
    calculatorType: 'banner',
    faq: [
      { q: 'What file format should I send?', a: 'We accept PDF, AI, PSD, and high-res PNG/JPG files at 150dpi or above.' },
      { q: 'What is the standard size?', a: 'Table rollup banners are typically 60cm × 160cm. Custom sizes available on request.' },
      { q: 'How long does production take?', a: '2–3 business days after artwork approval.' },
    ],
  },
  {
    id: 'adjustable-backdrop',
    name: 'Adjustable Backdrop Banner Printing',
    category: 'banners',
    price: 27000,
    originalPrice: 30000,
    image: 'https://images.unsplash.com/photo-1711825050242-aa0b7a379775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGp1c3RhYmxlJTIwYmFja2Ryb3AlMjBiYW5uZXJ8ZW58MXx8fHwxNzc0MDA0NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Large format adjustable backdrop banners for events and exhibitions',
    featured: true,
    calculatorType: 'banner',
    faq: [
      { q: 'What sizes are available?', a: 'Backdrop banners come in 2m × 2m, 3m × 2m, and 4m × 2m. Custom sizes available.' },
      { q: 'Is the frame included?', a: 'Yes, the adjustable aluminium frame is included in the price.' },
    ],
  },
  {
    id: 'rollup-banner',
    name: 'Roll up Banner Printing',
    category: 'banners',
    price: 8500,
    originalPrice: 9500,
    image: 'https://images.unsplash.com/photo-1618472166504-e026a93dad9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsdXAlMjBiYW5uZXIlMjBzdGFuZHxlbnwxfHx8fDE3NzQwMDQ2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Standard rollup banners with carrying case',
    calculatorType: 'banner',
  },

  // Business Cards
  {
    id: 'standard-business-cards',
    name: 'Standard Business Cards',
    category: 'business-cards',
    price: 1500,
    originalPrice: 2000,
    image: 'https://images.unsplash.com/photo-1561015314-6bd8c1e875ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNhcmRzJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzczOTM5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional business cards with various finishes. Standard size 85mm × 55mm.',
    featured: true,
    calculatorType: 'business-cards',
    templateUrl: '/templates/business-card-template.zip',
    faq: [
      { q: 'What is the bleed size?', a: 'Please add 3mm bleed on all sides. Final size is 85mm × 55mm.' },
      { q: 'Can I have different designs in one order?', a: 'Yes, each 100pcs counts as a separate run. Minimum 100pcs per design.' },
      { q: 'What lamination do you recommend?', a: 'Matt lamination gives a premium feel. Gloss is brighter and more vivid for photo-heavy designs.' },
      { q: 'Do you do rounded corners?', a: 'Yes, rounded corners (3.5mm radius) are available at a small extra charge.' },
    ],
  },
  {
    id: 'premium-business-cards',
    name: 'Premium Business Cards',
    category: 'business-cards',
    price: 2500,
    originalPrice: 3000,
    image: 'https://images.unsplash.com/photo-1561015314-6bd8c1e875ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNhcmRzJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzczOTM5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium thick business cards on 400gsm stock with special finishes.',
    calculatorType: 'business-cards',
    templateUrl: '/templates/business-card-template.zip',
    faq: [
      { q: 'What stock is used?', a: '400gsm premium art board — noticeably thicker and more impressive than standard cards.' },
      { q: 'What special finishes are available?', a: 'Spot UV, soft-touch lamination, foil stamping available on premium cards.' },
    ],
  },

  // Stickers
  {
    id: 'reflective-stickers',
    name: 'Reflective Sticker Printing',
    category: 'stickers',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1758354928937-1b5b59244cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZsZWN0aXZlJTIwc3RpY2tlcnN8ZW58MXx8fHwxNzc0MDA0NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'High-visibility reflective stickers for branding and safety applications.',
    featured: true,
    calculatorType: 'sticker',
    faq: [
      { q: 'Are these weatherproof?', a: 'Yes, reflective stickers are fully weatherproof and UV-resistant.' },
      { q: 'What surfaces do they adhere to?', a: 'Suitable for vehicles, helmets, equipment, and most smooth surfaces.' },
    ],
  },
  {
    id: 'vinyl-stickers',
    name: 'Vinyl Sticker Printing',
    category: 'stickers',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1693031630177-b897fb9d7154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHN0aWNrZXIlMjBwcmludGluZ3xlbnwxfHx8fDE3NzQwMDQ2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Durable vinyl stickers for indoor and outdoor use.',
    calculatorType: 'sticker',
  },

  // Booklet Magazines
  {
    id: 'booklet-magazines',
    name: 'Booklet Magazines Printing',
    category: 'booklet-magazines',
    price: 150,
    image: 'https://images.unsplash.com/photo-1661523892046-c7ae3b169e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rbGV0JTIwbWFnYXppbmUlMjBwcmludGluZ3xlbnwxfHx8fDE3NzQwMDQyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional booklet and magazine printing services.',
    calculatorType: 'booklet',
    faq: [
      { q: 'What is the minimum page count?', a: 'Minimum is 8 pages (including cover). Page count must be in multiples of 4.' },
      { q: 'Can I mix color and black & white pages?', a: 'Yes, you can have a color cover and black & white inner pages to reduce cost.' },
    ],
  },

  // Flyers
  {
    id: 'flyers-printing',
    name: 'Flyers Printing',
    category: 'flyers',
    price: 5,
    image: 'https://images.unsplash.com/photo-1630327722923-5ebd594ddda9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHllciUyMHByaW50aW5nJTIwc2VydmljZXxlbnwxfHx8fDE3NzQwMDQyOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Full color flyer printing in various sizes. Perfect for events, promotions, and marketing.',
    calculatorType: 'flyer',
    faq: [
      { q: 'What sizes are available?', a: 'A4, A5, A6, and DL (99mm × 210mm) sizes are standard. Custom sizes available.' },
      { q: 'What is the minimum order?', a: 'Minimum order is 100 flyers.' },
    ],
  },

  // Posters
  {
    id: 'posters-printing',
    name: 'Posters Printing',
    category: 'posters',
    price: 300,
    image: 'https://images.unsplash.com/photo-1735665114740-b1fe03b51b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3N0ZXIlMjBwcmludGluZyUyMHNlcnZpY2V8ZW58MXx8fHwxNzc0MDA0Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Large format poster printing on premium paper stock.',
    calculatorType: 'poster',
  },

  // T-shirts
  {
    id: 'branded-tshirts',
    name: 'Branded T-shirts',
    category: 't-shirts',
    price: 800,
    image: 'https://images.unsplash.com/photo-1678872844677-d650b788709b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVkJTIwdHNoaXJ0JTIwY29sb3JmdWx8ZW58MXx8fHwxNzc0MDA0MzA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Custom branded t-shirts with your design. Available in all sizes.',
    calculatorType: 'tshirt',
    faq: [
      { q: 'What printing method do you use?', a: 'We use DTF (Direct to Film) for full-color designs and screen printing for bulk orders.' },
      { q: 'What T-shirt brands are available?', a: 'We stock Gildan, Fruit of the Loom, and local premium brands.' },
      { q: 'Can I supply my own shirts?', a: 'Yes, you can supply your own garments. Just bring them in and we will print your design.' },
    ],
  },
];

export const getProductsByCategory = (category: string) => {
  return products.filter(p => p.category === category);
};

export const getFeaturedProducts = () => {
  return products.filter(p => p.featured);
};

export const getProductById = (id: string) => {
  return products.find(p => p.id === id);
};
