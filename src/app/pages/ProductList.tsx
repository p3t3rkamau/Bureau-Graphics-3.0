import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { searchProducts } from '../../hooks/useSearch';
import { categories, products as allProducts, Product } from '../data/products';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// ─── NOTE: ProductList accepts an optional ?q= query param for in-page filtering.
// The full search results page is SearchResults.tsx (route /search?q=...)

export function ProductList() {
  const { category }                      = useParams<{ category: string }>();
  const [searchParams, setSearchParams]   = useSearchParams();
  const inlineQuery                       = searchParams.get('q') ?? '';

  const [localQuery, setLocalQuery]       = useState(inlineQuery);
  const [debouncedQuery, setDebounced]    = useState(inlineQuery);
  const debounceRef                       = useRef<ReturnType<typeof setTimeout>>();

  const categoryInfo = categories.find(c => c.id === category);
  const categoryProducts = category
    ? allProducts.filter(p => p.category === category)
    : allProducts;

  // Debounce local query → debouncedQuery
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(localQuery), 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [localQuery]);

  // Sync URL param back when debounced value changes
  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedQuery]);

  // Compute filtered products
  const displayProducts: Product[] = debouncedQuery.trim().length >= 2
    ? categoryProducts.filter(p => {
        const q = debouncedQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      })
    : categoryProducts;

  const isSearching = debouncedQuery.trim().length >= 2;

  if (category && !categoryInfo) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Link to="/categories" className="text-[#2B59C3] hover:underline mt-4 inline-block">
          Browse all categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {isSearching ? (
                <>
                  <p className="text-[#EF233C] font-medium text-sm mb-1 uppercase tracking-wide">
                    Search results
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    "{debouncedQuery}"
                    <span className="text-gray-400 text-lg font-normal ml-3">
                      {displayProducts.length} result{displayProducts.length !== 1 ? 's' : ''}
                    </span>
                  </h1>
                </>
              ) : (
                <>
                  <p className="text-[#EF233C] font-medium text-sm mb-1 uppercase tracking-wide">
                    {categoryInfo?.name ?? 'All Products'}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {categoryInfo ? `${categoryInfo.name} in Kenya` : 'All Products'}
                  </h1>
                </>
              )}
            </div>

            {/* In-page search bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                placeholder={`Filter ${categoryInfo?.name ?? 'products'}…`}
                className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C] focus:bg-white transition-all"
              />
              {localQuery && (
                <button
                  onClick={() => { setLocalQuery(''); setDebounced(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {!isSearching && (
            <p className="text-gray-600 max-w-3xl mt-3 text-sm leading-relaxed">
              Looking for professional {(categoryInfo?.name ?? 'printing').toLowerCase()} in Kenya?
              At Bureau Graphics, we are Nairobi's most trusted printing company offering complete branding
              solutions for businesses, events, churches, schools, and institutions across Kenya.
            </p>
          )}
        </div>
      </div>

      {/* Sidebar and Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-500">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/products"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !category ? 'bg-red-50 text-[#EF233C] font-medium' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link
                      to={`/products/${cat.id}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        cat.id === category
                          ? 'bg-red-50 text-[#EF233C] font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {displayProducts.length > 0 ? (
              <>
                {/* Result count strip */}
                {isSearching && (
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Showing <span className="font-semibold text-gray-800">{displayProducts.length}</span> results
                      {categoryInfo ? ` in ${categoryInfo.name}` : ''}
                    </p>
                    <button
                      onClick={() => { setLocalQuery(''); setDebounced(''); }}
                      className="text-xs text-[#EF233C] hover:underline flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Clear filter
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayProducts.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative">
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium z-10 text-gray-700">
                          {categoryInfo?.name ?? categories.find(c => c.id === product.category)?.name}
                        </span>
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-medium mb-2 group-hover:text-[#2B59C3] transition-colors leading-snug text-sm">
                          {isSearching
                            ? highlightText(product.name, debouncedQuery)
                            : product.name
                          }
                        </h3>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-[#EF233C] font-bold text-xl">
                            KES {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              KES {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button className="w-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 text-sm">
                          Order Now
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                {isSearching ? (
                  <>
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      No results for "{debouncedQuery}"
                      {categoryInfo ? ` in ${categoryInfo.name}` : ''}
                    </h3>
                    <p className="text-gray-400 text-sm mb-5">Try a different keyword or browse all categories.</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => { setLocalQuery(''); setDebounced(''); }}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                      >
                        Clear search
                      </button>
                      <Link to="/categories">
                        <Button variant="outline" className="border-[#EF233C] text-[#EF233C] hover:bg-red-50 text-sm">
                          Browse Categories
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">No products available in this category yet.</p>
                    <Link to="/categories">
                      <Button variant="outline" className="border-[#EF233C] text-[#EF233C] hover:bg-red-50">
                        Browse Other Categories
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Highlight matching words in product names
function highlightText(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-yellow-100 text-yellow-800 font-semibold rounded-sm px-0.5 not-italic">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}