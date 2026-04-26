export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  featured?: boolean;
}

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
  { id: 'mug-drinkware', name: 'Mug Printing &amp; Branded Drinkware', image: 'branded mug printing' },
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
  },
  {
    id: 'table-cloth',
    name: 'Table Cloth Printing',
    category: 'banners',
    price: 3600,
    originalPrice: 4000,
    image: 'https://images.unsplash.com/photo-1711355249709-1733df63e028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGVkJTIwdGFibGUlMjBjbG90aHxlbnwxfHx8fDE3NzQwMDQ2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Custom printed table cloths for professional events',
  },
  {
    id: 's-banner',
    name: 'S-Banner Printing',
    category: 'banners',
    price: 34500,
    originalPrice: 38000,
    image: 'https://images.unsplash.com/photo-1643264732739-8a800d53ecec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzJTIwYmFubmVyJTIwc3RhbmR8ZW58MXx8fHwxNzc0MDA0NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Curved S-banner stands for maximum visibility',
  },
  {
    id: 'pvc-wheel-cover',
    name: 'PVC Wheel Cover',
    category: 'banners',
    price: 9500,
    originalPrice: 11000,
    image: 'https://images.unsplash.com/photo-1635713044894-af06f4056804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYmFubmVyJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Branded PVC wheel covers for vehicle branding',
  },
  {
    id: 'popup-banner',
    name: 'Popup Banner Printing',
    category: 'banners',
    price: 25862,
    originalPrice: 28000,
    image: 'https://images.unsplash.com/photo-1711825050242-aa0b7a379775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGp1c3RhYmxlJTIwYmFja2Ryb3AlMjBiYW5uZXJ8ZW58MXx8fHwxNzc0MDA0NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Quick setup popup banners for events',
  },
  {
    id: 'rollup-banner',
    name: 'Roll up Banner Printing',
    category: 'banners',
    price: 8500,
    originalPrice: 9500,
    image: 'https://images.unsplash.com/photo-1618472166504-e026a93dad9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsdXAlMjBiYW5uZXIlMjBzdGFuZHxlbnwxfHx8fDE3NzQwMDQ2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Standard rollup banners with carrying case',
  },
  {
    id: 'telescopic-banners',
    name: 'Telescopic Banners',
    category: 'banners',
    price: 15418,
    originalPrice: 17000,
    image: 'https://images.unsplash.com/photo-1618472166504-e026a93dad9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsdXAlMjBiYW5uZXIlMjBzdGFuZHxlbnwxfHx8fDE3NzQwMDQ2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Adjustable height telescopic banner stands',
  },
  {
    id: 'door-frame-banner',
    name: 'Door Frame Banner Printing',
    category: 'banners',
    price: 9500,
    originalPrice: 10500,
    image: 'https://images.unsplash.com/photo-1635713044894-af06f4056804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYmFubmVyJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzc0MDA0Mjk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Eye-catching door frame banners',
  },
  {
    id: 'x-banner',
    name: 'X-Banner Stands Printing',
    category: 'banners',
    price: 7500,
    originalPrice: 8500,
    image: 'https://images.unsplash.com/photo-1618472166504-e026a93dad9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsdXAlMjBiYW5uZXIlMjBzdGFuZHxlbnwxfHx8fDE3NzQwMDQ2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Lightweight X-banner stands for easy transport',
  },

  // Business Cards
  {
    id: 'standard-business-cards',
    name: 'Standard Business Cards',
    category: 'business-cards',
    price: 1500,
    originalPrice: 2000,
    image: 'https://images.unsplash.com/photo-1561015314-6bd8c1e875ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNhcmRzJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzczOTM5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional business cards with various finishes',
    featured: true,
  },
  {
    id: 'premium-business-cards',
    name: 'Premium Business Cards',
    category: 'business-cards',
    price: 2500,
    originalPrice: 3000,
    image: 'https://images.unsplash.com/photo-1561015314-6bd8c1e875ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNhcmRzJTIwcHJpbnRpbmd8ZW58MXx8fHwxNzczOTM5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium business cards with special finishes',
  },

  // Stickers
  {
    id: 'reflective-stickers',
    name: 'Reflective Sticker Printing',
    category: 'stickers',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1758354928937-1b5b59244cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZsZWN0aXZlJTIwc3RpY2tlcnN8ZW58MXx8fHwxNzc0MDA0NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'High-visibility reflective stickers for branding',
    featured: true,
  },
  {
    id: 'vinyl-stickers',
    name: 'Vinyl Sticker Printing',
    category: 'stickers',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1693031630177-b897fb9d7154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHN0aWNrZXIlMjBwcmludGluZ3xlbnwxfHx8fDE3NzQwMDQ2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Durable vinyl stickers for indoor and outdoor use',
  },

  // Booklet Magazines
  {
    id: 'booklet-magazines',
    name: 'Booklet Magazines Printing',
    category: 'booklet-magazines',
    price: 150,
    image: 'https://images.unsplash.com/photo-1661523892046-c7ae3b169e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rbGV0JTIwbWFnYXppbmUlMjBwcmludGluZ3xlbnwxfHx8fDE3NzQwMDQyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional booklet and magazine printing services',
  },

  // Flyers
  {
    id: 'flyers-printing',
    name: 'Flyers Printing',
    category: 'flyers',
    price: 5,
    image: 'https://images.unsplash.com/photo-1630327722923-5ebd594ddda9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHllciUyMHByaW50aW5nJTIwc2VydmljZXxlbnwxfHx8fDE3NzQwMDQyOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Full color flyer printing in various sizes',
  },

  // Posters
  {
    id: 'posters-printing',
    name: 'Posters Printing',
    category: 'posters',
    price: 300,
    image: 'https://images.unsplash.com/photo-1735665114740-b1fe03b51b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3N0ZXIlMjBwcmludGluZyUyMHNlcnZpY2V8ZW58MXx8fHwxNzc0MDA0Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Large format poster printing',
  },

  // T-shirts
  {
    id: 'branded-tshirts',
    name: 'Branded T-shirts',
    category: 't-shirts',
    price: 800,
    image: 'https://images.unsplash.com/photo-1678872844677-d650b788709b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVkJTIwdHNoaXJ0JTIwY29sb3JmdWx8ZW58MXx8fHwxNzc0MDA0MzA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Custom branded t-shirts with your design',
  },
  {
    id: 'branded-hoodies',
    name: 'Branded Hoodies',
    category: 'branded-apparel',
    price: 2700,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    description: 'Premium hoodies with logo and campaign branding for teams and organizations.',
  },
  {
    id: 'door-plates',
    name: 'Door Plates',
    category: 'signages',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    description: 'Professional office and directional door plates in acrylic, PVC, and brushed metal finishes.',
  },
  {
    id: 'mounted-photos',
    name: 'Mounted Photos Printing',
    category: 'photo-printing',
    price: 796,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    description: 'Photo mounting and framing options for studios, homes, and event galleries.',
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
