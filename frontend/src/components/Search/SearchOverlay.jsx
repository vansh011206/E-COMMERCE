import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useProductStore } from '../../store/productStore';
import { useDebounce } from '../../hooks/useDebounce';

const TRENDING = ['Oversized T-Shirts', 'Maxi Dresses', 'Cargo Pants', 'Bomber Jackets', 'Co-ord Sets', 'Linen Shirts', 'Sneakers'];

const POPULAR_CATEGORIES = [
  { label: 'Men', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&q=80' },
  { label: 'Women', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&q=80' },
  { label: 'Kids', img: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=300&q=80' },
  { label: 'Ethnic', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80' },
  { label: 'Undergarments', img: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=300&q=80' },
  { label: 'Accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
];

// Highlight matching query in text
const HighlightText = ({ text, query }) => {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong className="text-black font-semibold">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
};

const SearchOverlay = () => {
  const { isSearchOpen, toggleSearch } = useUiStore();
  const { allProducts } = useProductStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Animate in/out
  useEffect(() => {
    if (isSearchOpen) {
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setVisible(false);
      setTimeout(() => setQuery(''), 200);
    }
  }, [isSearchOpen]);

  // Search logic
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const q = debouncedQuery.toLowerCase();
    const matched = allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 12);
    setResults(matched);
  }, [debouncedQuery, allProducts]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') toggleSearch(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [toggleSearch]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isSearchOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen]);

  const handleProductClick = useCallback((id) => {
    toggleSearch();
    navigate(`/product/${id}`);
  }, [navigate, toggleSearch]);

  const handleTrendingClick = useCallback((term) => {
    setQuery(term);
    inputRef.current?.focus();
  }, []);

  if (!isSearchOpen && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-200 ${
        isSearchOpen && visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ background: 'rgba(255, 255, 255, 0.97)', backdropFilter: 'blur(8px)' }}
    >
      {/* ── Close Button ── */}
      <button
        onClick={toggleSearch}
        className="absolute top-6 right-6 text-[#666] hover:text-black transition-colors duration-200 p-2"
        aria-label="Close search"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      <div className="max-w-3xl mx-auto px-6 pt-16">
        {/* ── Search Input ── */}
        <div className="flex items-center gap-4 border-b border-[#E5E5E5] pb-3 mb-10">
          <Search size={22} className="text-[#555] flex-shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more..."
            className="flex-1 bg-transparent text-black font-heading text-xl md:text-2xl placeholder-[#999] outline-none tracking-heading"
            style={{ caretColor: '#000000' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#555] hover:text-black transition-colors duration-200"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── No Query: Trending + Categories ── */}
        {!debouncedQuery.trim() && (
          <div>
            {/* Trending */}
            <div className="mb-8">
              <h3 className="font-heading text-[11px] uppercase tracking-[0.2em] text-[#555] mb-4">
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="px-3.5 py-1.5 border border-[#E5E5E5] rounded-full font-body text-[13px] text-[#666] hover:text-black hover:border-[#999] transition-all duration-200 flex items-center gap-1.5"
                  >
                    <ArrowUpRight size={12} className="text-[#555]" />
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <h3 className="font-heading text-[11px] uppercase tracking-[0.2em] text-[#555] mb-4">
                Popular Categories
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {POPULAR_CATEGORIES.map(({ label, img }) => (
                  <button
                    key={label}
                    onClick={() => { toggleSearch(); navigate(`/shop?category=${label}`); }}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden relative">
                      <img
                        src={img}
                        alt={label}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <span className="font-body text-[12px] text-[#666] group-hover:text-black transition-colors duration-200">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Search Results ── */}
        {debouncedQuery.trim() && (
          <div>
            <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-[#555] mb-4">
              {results.length > 0 ? `${results.length} Results for "${debouncedQuery}"` : `No results for "${debouncedQuery}"`}
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[55vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors duration-200 text-left group"
                  >
                    <div className="w-14 h-16 rounded-md overflow-hidden flex-shrink-0 bg-[#F5F5F5]">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[12px] text-[#666] uppercase tracking-wider mb-0.5">{product.brand}</p>
                      <p className="font-body text-[13px] text-[#666] group-hover:text-black transition-colors truncate">
                        <HighlightText text={product.name} query={debouncedQuery} />
                      </p>
                      <p className="font-mono text-[13px] text-black mt-1">
                        {product.currency}{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-body text-[#555] text-sm">Try searching for something else</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(SearchOverlay);
