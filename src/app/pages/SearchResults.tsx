import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { searchProducts } from '../../hooks/useSearch';
import { Product, categories } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [results, setResults]           = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setResults(searchProducts(query));
    setActiveCategory(null);
  }, [query]);

  const filtered = activeCategory
    ? results.filter(p => p.category === activeCategory)
    : results;

  // Which categories appear in results
  const resultCategories = [...new Set(results.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-500 mb-1">Search results for</p>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <span className="text-[#EF233C]">"{query}"</span>
                <span className="text-gray-400 text-lg font-normal">
                  — {results.length} {results.length === 1 ? 'result' : 'results'}
                </span>
              </h1>
            </div>

            {/* Inline re-search */}
            <form
              onSubmit={e => {
                e.preventDefault();
                const val = (e.currentTarget.querySelector('input') as HTMLInputElement).value;
                if (val.trim()) setSearchParams({ q: val.trim() });
              }}
              className="flex items-center gap-2 flex-1 max-w-sm"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  defaultValue={query}
                  key={query}
                  type="text"
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C]"
                  placeholder="Search again…"
                />
              </div>
              <Button type="submit" className="bg-[#EF233C] hover:bg-red-700 text-white px-4">Go</Button>
            </form>
          </div>

          {/* Category filter pills */}
          {resultCategories.length > 1 && (
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter:
              </span>
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  activeCategory === null
                    ? 'bg-[#EF233C] text-white border-[#EF233C]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                All ({results.length})
              </button>
              {resultCategories.map(catId => {
                const cat = categories.find(c => c.id === catId);
                const count = results.filter(p => p.category === catId).length;
                return (
                  <button
                    key={catId}
                    onClick={() => setActiveCategory(catId === activeCategory ? null : catId)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${
                      activeCategory === catId
                        ? 'bg-[#EF233C] text-white border-[#EF233C]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {cat?.name ?? catId}
                    <span className={`rounded-full px-1 ${activeCategory === catId ? 'bg-red-700' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                    {activeCategory === catId && <X className="h-3 w-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* No results */}
        {results.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No products found for "{query}"</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Try searching for "business cards", "roll up banners", "flyers", or "t-shirts".
            </p>
            <Link to="/categories">
              <Button variant="outline" className="border-[#EF233C] text-[#EF233C] hover:bg-red-50">
                Browse All Categories
              </Button>
            </Link>
          </div>
        )}

        {/* Results grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => {
              const cat = categories.find(c => c.id === product.category);
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium z-10 text-gray-700">
                      {cat?.name ?? product.category}
                    </span>
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    {/* Highlighted product name */}
                    <h3 className="font-medium text-gray-900 mb-2 group-hover:text-[#2B59C3] transition-colors leading-snug">
                      {highlightText(product.name, query)}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-[#EF233C] font-bold text-lg">
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
              );
            })}
          </div>
        )}

        {/* Filtered to zero */}
        {results.length > 0 && filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No results in this category.</p>
            <button onClick={() => setActiveCategory(null)} className="text-[#EF233C] underline mt-2 text-sm">
              Show all {results.length} results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Highlight matching text in product name
function highlightText(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-yellow-100 text-yellow-800 font-semibold rounded-sm px-0.5">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}