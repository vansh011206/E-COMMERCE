import React, { useState, useMemo, memo } from 'react';
import { Plus, Minus, Search, X } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useUiStore } from '../../store/uiStore';

const PRICE_RANGES = [
  { label: 'Under ₹500', range: [0, 500] },
  { label: '₹500 – ₹1000', range: [500, 1000] },
  { label: '₹1000 – ₹2000', range: [1000, 2000] },
  { label: '₹2000 – ₹5000', range: [2000, 5000] },
  { label: 'Above ₹5000', range: [5000, 20000] },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const RATINGS = [
  { label: '4 & above', value: 4, stars: '★★★★★' },
  { label: '3 & above', value: 3, stars: '★★★★' },
  { label: '2 & above', value: 2, stars: '★★★' },
  { label: '1 & above', value: 1, stars: '★★' },
];

const DISCOUNTS = [
  { label: '10% and above', value: 10 },
  { label: '20% and above', value: 20 },
  { label: '30% and above', value: 30 },
  { label: '50% and above', value: 50 },
];

// ── Collapsible Section ──
const FilterSection = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8E8E8] py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between mb-0"
      >
        <span className="font-heading text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A] font-semibold">{title}</span>
        {open ? <Minus size={14} className="text-[#999]" /> : <Plus size={14} className="text-[#999]" />}
      </button>
      {open && <div className="pt-3">{children}</div>}
    </div>
  );
};

// ── Checkbox ──
const Checkbox = ({ checked, onChange, label, count }) => (
  <button
    onClick={onChange}
    className="w-full flex items-center gap-2.5 py-[5px] group"
  >
    <div className={`w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
      checked ? 'bg-[#0A0A0A] border-[#0A0A0A]' : 'border-[#CCC] group-hover:border-[#999]'
    }`}>
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </div>
    <span className={`font-body text-[13px] flex-1 text-left transition-colors duration-150 ${checked ? 'text-[#0A0A0A]' : 'text-[#555] group-hover:text-[#0A0A0A]'}`}>
      {label}
    </span>
    {count !== undefined && (
      <span className="font-body text-[12px] text-[#999]">({count})</span>
    )}
  </button>
);

// ── Main Filter Panel ──
const FilterPanel = () => {
  const { filters, setFilter, clearFilters, allProducts } = useProductStore();
  const { isFilterOpen, toggleFilter } = useUiStore();
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Derive available sub-categories and brands from current products
  const allBrands = useMemo(() => {
    const brands = {};
    allProducts.forEach((p) => { brands[p.brand] = (brands[p.brand] || 0) + 1; });
    return Object.entries(brands).sort((a, b) => b[1] - a[1]);
  }, [allProducts]);

  const allSubCategories = useMemo(() => {
    const subs = {};
    const catFilter = filters.category;
    allProducts
      .filter((p) => catFilter.length === 0 || catFilter.includes(p.category))
      .forEach((p) => { subs[p.subCategory] = (subs[p.subCategory] || 0) + 1; });
    return Object.entries(subs).sort((a, b) => b[1] - a[1]);
  }, [allProducts, filters.category]);

  const filteredBrands = useMemo(() => {
    const q = brandSearch.toLowerCase();
    const list = q ? allBrands.filter(([name]) => name.toLowerCase().includes(q)) : allBrands;
    return showAllBrands ? list : list.slice(0, 6);
  }, [allBrands, brandSearch, showAllBrands]);

  const toggleArrayFilter = (filterName, value) => {
    const current = filters[filterName];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setFilter(filterName, next);
  };

  const handleCustomPrice = () => {
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || 20000;
    setFilter('priceRange', [min, max]);
  };

  const categoryCountMap = useMemo(() => {
    const map = {};
    allProducts.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [allProducts]);

  const content = (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E8E8E8]">
        <span className="font-heading text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] font-semibold">Filters</span>
        <button onClick={clearFilters} className="font-body text-[12px] text-[#999] hover:text-black transition-colors duration-150">Clear All</button>
      </div>

      {/* A) Categories */}
      <FilterSection title="Category">
        {['Men', 'Women', 'Kids'].map((cat) => (
          <Checkbox
            key={cat}
            checked={filters.category.includes(cat)}
            onChange={() => toggleArrayFilter('category', cat)}
            label={cat}
            count={categoryCountMap[cat] || 0}
          />
        ))}
      </FilterSection>

      {/* B) Sub-Category */}
      {allSubCategories.length > 0 && (
        <FilterSection title="Sub-Category" defaultOpen={filters.subCategory.length > 0}>
          {allSubCategories.map(([sub, count]) => (
            <Checkbox
              key={sub}
              checked={filters.subCategory.includes(sub)}
              onChange={() => toggleArrayFilter('subCategory', sub)}
              label={sub}
              count={count}
            />
          ))}
        </FilterSection>
      )}

      {/* C) Brand */}
      <FilterSection title="Brand" defaultOpen={false}>
        <div className="mb-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999]" />
            <input
              type="text"
              placeholder="Search brands"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full h-8 bg-[#F8F8F8] border border-[#E8E8E8] rounded-md pl-8 pr-3 font-body text-[12px] text-[#333] outline-none focus:border-[#CCC] transition-colors duration-150"
            />
          </div>
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {filteredBrands.map(([brand, count]) => (
            <Checkbox
              key={brand}
              checked={filters.brand.includes(brand)}
              onChange={() => toggleArrayFilter('brand', brand)}
              label={brand}
              count={count}
            />
          ))}
        </div>
        {!showAllBrands && allBrands.length > 6 && (
          <button onClick={() => setShowAllBrands(true)} className="font-body text-[12px] text-[#999] hover:text-black mt-1 transition-colors duration-150">
            + {allBrands.length - 6} more
          </button>
        )}
      </FilterSection>

      {/* D) Price Range */}
      <FilterSection title="Price" defaultOpen={false}>
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map(({ label, range }) => {
            const isSelected = filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1];
            return (
              <button
                key={label}
                onClick={() => setFilter('priceRange', range)}
                className="flex items-center gap-2.5 py-[5px] group"
              >
                <div className={`w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                  isSelected ? 'border-[#0A0A0A]' : 'border-[#CCC] group-hover:border-[#999]'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#0A0A0A]" />}
                </div>
                <span className={`font-body text-[13px] transition-colors duration-150 ${isSelected ? 'text-[#0A0A0A]' : 'text-[#555]'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
          <p className="font-body text-[11px] text-[#999] uppercase tracking-wider mb-2">Or enter range</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1 h-8 bg-[#F8F8F8] border border-[#E8E8E8] rounded-md px-2.5 font-mono text-[12px] text-[#333] outline-none focus:border-[#CCC]"
            />
            <span className="text-[#CCC] text-[12px]">—</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1 h-8 bg-[#F8F8F8] border border-[#E8E8E8] rounded-md px-2.5 font-mono text-[12px] text-[#333] outline-none focus:border-[#CCC]"
            />
            <button onClick={handleCustomPrice} className="h-8 px-3 bg-[#0A0A0A] text-white rounded-md font-body text-[11px] hover:bg-[#333] transition-colors duration-150">Go</button>
          </div>
        </div>
      </FilterSection>

      {/* E) Size */}
      <FilterSection title="Size" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const selected = filters.size.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleArrayFilter('size', size)}
                className={`w-[38px] h-[38px] rounded-md border text-[13px] font-body transition-all duration-150 ${
                  selected
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#555] border-[#E8E8E8] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* F) Rating */}
      <FilterSection title="Customer Rating" defaultOpen={false}>
        {RATINGS.map(({ label, value, stars }) => {
          const selected = filters.rating === value;
          return (
            <button
              key={value}
              onClick={() => setFilter('rating', selected ? 0 : value)}
              className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded transition-colors duration-150 ${
                selected ? 'bg-[#FFF8E1] border-l-[3px] border-[#F59E0B]' : 'hover:bg-[#FAFAFA]'
              }`}
            >
              <span className="text-[#F59E0B] text-[12px]">{stars}</span>
              <span className="font-body text-[13px] text-[#555]">{label}</span>
            </button>
          );
        })}
      </FilterSection>

      {/* G) Discount */}
      <FilterSection title="Discount" defaultOpen={false}>
        {DISCOUNTS.map(({ label, value }) => (
          <Checkbox
            key={value}
            checked={filters.discount >= value}
            onChange={() => setFilter('discount', filters.discount === value ? 0 : value)}
            label={label}
          />
        ))}
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[260px] flex-shrink-0 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto pr-6 border-r border-[#E8E8E8]">
        {content}
      </aside>

      {/* Mobile Bottom Sheet */}
      {isFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={toggleFilter} />
          <div className="absolute bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-2xl overflow-hidden flex flex-col animate-slideUp">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
              <span className="font-heading text-[14px] uppercase tracking-[0.1em] font-semibold">Filters</span>
              <button onClick={toggleFilter}><X size={20} className="text-[#999]" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {content}
            </div>
            <div className="flex items-center gap-3 px-5 py-4 border-t border-[#E8E8E8]">
              <button onClick={() => { clearFilters(); toggleFilter(); }} className="flex-1 h-11 border border-[#E0E0E0] rounded-lg font-body text-[13px] text-[#555] hover:border-[#999] transition-colors duration-150">
                Clear All
              </button>
              <button onClick={toggleFilter} className="flex-1 h-11 bg-[#0A0A0A] text-white rounded-lg font-body text-[13px] font-medium hover:bg-[#333] transition-colors duration-150">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(FilterPanel);
