import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Search, ArrowRight, Tag } from 'lucide-react';
import { Product, categories } from '../../data/products';

interface Props {
  query: string;
  results: Product[];
  isOpen: boolean;
  onSelect: (productId: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-red-100 text-[#EF233C] font-semibold rounded-sm px-0.5">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

function getCategoryName(catId: string) {
  return categories.find(c => c.id === catId)?.name ?? catId;
}

export function SearchDropdown({ query, results, isOpen, onSelect, onClose, onSubmit }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  const isEmpty  = query.trim().length >= 2 && results.length === 0;
  const isTooShort = query.trim().length === 1;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
      style={{ maxHeight: '480px', overflowY: 'auto' }}
    >
      {/* Too short */}
      {isTooShort && (
        <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Keep typing to search…
        </div>
      )}

      {/* No results */}
      {isEmpty && (
        <div className="px-5 py-8 text-center">
          <div className="text-3xl mb-2">🔍</div>
          <p className="font-medium text-gray-700">No results for "<span className="text-[#EF233C]">{query}</span>"</p>
          <p className="text-sm text-gray-400 mt-1">Try "business cards", "banners", or "flyers"</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
            <button
              onMouseDown={onSubmit}
              className="text-xs text-[#2B59C3] hover:underline font-medium flex items-center gap-1"
            >
              See all <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <ul className="pb-2">
            {results.slice(0, 7).map(product => (
              <li key={product.id}>
                <button
                  onMouseDown={() => onSelect(product.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  {/* Thumbnail */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {highlight(product.name, query)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Tag className="h-3 w-3" />
                        {getCategoryName(product.category)}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-[#EF233C]">
                      KES {product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        KES {product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {results.length > 7 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <button
                onMouseDown={onSubmit}
                className="w-full text-sm text-center text-[#2B59C3] font-medium hover:underline flex items-center justify-center gap-1"
              >
                View all {results.length} results for "{query}"
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}