import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { Phone, Mail, ShoppingCart, User, Search, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { categories } from '../data/products';
import { useSearch } from '../../hooks/useSearch';
import { SearchDropdown } from './search/SearchDropdown';

import { useCart } from '../../context/CartContext';

export function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const search = useSearch();
  const { totalItems, openCart } = useCart();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      search.handleSubmit();
    }
    if (e.key === 'Escape') {
      search.close();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:0746174084" className="flex items-center gap-2 hover:text-[#EF233C]">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">0746174084</span>
              </a>
              <a href="mailto:orders@bureaugraphics.com" className="flex items-center gap-2 hover:text-[#EF233C]">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">orders@bureaugraphics.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-[#2B59C3]">
              <span className="hidden sm:inline">Free delivery above</span>
              <span className="font-semibold">KES 10,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="text-2xl font-bold">
                <span className="text-[#2B59C3]">Bureau</span>
                <span className="text-[#EF233C]">Graphics</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
              <Link to="/" className="hover:text-[#EF233C] transition-colors text-sm">
                Home
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-[#EF233C] transition-colors text-sm">
                  Products <ChevronDown className="h-4 w-4" />
                </button>
                {isProductsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-screen max-w-[800px] bg-white shadow-lg border border-gray-200 rounded-lg p-6 grid grid-cols-3 gap-4">
                    {categories.map(category => (
                      <Link
                        key={category.id}
                        to={`/products/${category.id}`}
                        className="text-sm hover:text-[#EF233C] transition-colors"
                        onClick={() => setIsProductsOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      to="/categories"
                      className="col-span-3 text-sm text-[#EF233C] font-medium hover:underline mt-2"
                      onClick={() => setIsProductsOpen(false)}
                    >
                      View All →
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/contact" className="hover:text-[#EF233C] transition-colors text-sm">
                Contact
              </Link>
              <Link to="/business-packages">
                <Button className="bg-black text-white hover:bg-gray-800 text-sm">
                  Business Packages
                </Button>
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-md ml-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search business cards, banners, flyers…"
                  value={search.inputValue}
                  onChange={e => search.handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => search.inputValue.length >= 1 && search.handleChange(search.inputValue)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C] focus:bg-white transition-all"
                />
              </div>
              <SearchDropdown
                query={search.debouncedQuery}
                results={search.results}
                isOpen={search.isOpen}
                onSelect={search.handleSelect}
                onClose={search.close}
                onSubmit={search.handleSubmit}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button className="hidden lg:flex items-center gap-2 hover:text-[#EF233C] transition-colors text-sm">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </button>
              <button onClick={openCart} className="relative hover:text-[#EF233C] transition-colors">
                <ShoppingCart className="h-6 w-6" />
                <span className={`absolute -top-2 -right-2 bg-[#EF233C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all ${totalItems > 0 ? 'scale-100' : 'scale-0'}`}>
                  {totalItems}
                </span>
              </button>
              <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="lg:hidden pb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products…"
              value={search.inputValue}
              onChange={e => search.handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C] focus:bg-white transition-all"
            />
            <SearchDropdown
              query={search.debouncedQuery}
              results={search.results}
              isOpen={search.isOpen}
              onSelect={search.handleSelect}
              onClose={search.close}
              onSubmit={search.handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="hover:text-[#EF233C] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/categories" className="hover:text-[#EF233C] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link to="/contact" className="hover:text-[#EF233C] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              <button className="flex items-center gap-2 hover:text-[#EF233C] transition-colors text-left">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </button>
              <Button className="bg-black text-white hover:bg-gray-800 w-full">Business Packages</Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}