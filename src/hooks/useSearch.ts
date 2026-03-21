import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { products, categories, Product } from '../app/data/products';

export interface SearchResult {
  products: Product[];
  query: string;
}

function scoreProduct(product: Product, query: string): number {
  const q = query.toLowerCase();
  const name = product.name.toLowerCase();
  const desc = product.description.toLowerCase();
  const cat  = product.category.toLowerCase();

  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (desc.includes(q)) return 40;
  if (cat.includes(q)) return 30;

  // Partial word match
  const words = q.split(' ').filter(Boolean);
  const matchCount = words.filter(w => name.includes(w) || desc.includes(w)).length;
  if (matchCount > 0) return 10 * matchCount;

  return 0;
}

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const scored = products
    .map(p => ({ product: p, score: scoreProduct(p, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map(({ product }) => product);
}

export function useSearch(debounceMs = 280) {
  const [inputValue, setInputValue]     = useState('');
  const [debouncedQuery, setDebounced]  = useState('');
  const [results, setResults]           = useState<Product[]>([]);
  const [isOpen, setIsOpen]             = useState(false);
  const navigate = useNavigate();

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(inputValue), debounceMs);
    return () => clearTimeout(timer);
  }, [inputValue, debounceMs]);

  // Run search when debounced value changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    setResults(searchProducts(debouncedQuery));
  }, [debouncedQuery]);

  const handleChange = useCallback((value: string) => {
    setInputValue(value);
    setIsOpen(value.length >= 1);
  }, []);

  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      setIsOpen(false);
    }
  }, [inputValue, navigate]);

  const handleSelect = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
    setIsOpen(false);
    setInputValue('');
  }, [navigate]);

  const close = useCallback(() => setIsOpen(false), []);

  return {
    inputValue,
    debouncedQuery,
    results,
    isOpen,
    handleChange,
    handleSubmit,
    handleSelect,
    close,
  };
}