import React, { memo } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProductStore } from '../../store/productStore';

const ActiveFilters = () => {
  const { filters, setFilter, clearFilters } = useProductStore();

  const chips = [];

  filters.category.forEach((c) => chips.push({ key: `cat-${c}`, label: `Category: ${c}`, remove: () => setFilter('category', filters.category.filter((v) => v !== c)) }));
  filters.subCategory.forEach((s) => chips.push({ key: `sub-${s}`, label: s, remove: () => setFilter('subCategory', filters.subCategory.filter((v) => v !== s)) }));
  filters.brand.forEach((b) => chips.push({ key: `br-${b}`, label: b, remove: () => setFilter('brand', filters.brand.filter((v) => v !== b)) }));
  filters.size.forEach((s) => chips.push({ key: `sz-${s}`, label: `Size: ${s}`, remove: () => setFilter('size', filters.size.filter((v) => v !== s)) }));
  if (filters.rating > 0) chips.push({ key: 'rating', label: `★ ${filters.rating}+`, remove: () => setFilter('rating', 0) });
  if (filters.discount > 0) chips.push({ key: 'discount', label: `${filters.discount}%+ Off`, remove: () => setFilter('discount', 0) });
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000) {
    chips.push({ key: 'price', label: `₹${filters.priceRange[0]} – ₹${filters.priceRange[1]}`, remove: () => setFilter('priceRange', [0, 20000]) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
      <AnimatePresence mode="popLayout">
        {chips.map(({ key, label, remove }) => (
          <motion.button
            key={key}
            onClick={remove}
            className="flex items-center gap-1.5 flex-shrink-0 bg-[#EFEFED] border border-[#E0E0E0] rounded-full px-3 py-1.5 font-body text-[12px] text-[#555] hover:border-[#CCC] transition-colors duration-150"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            layout
          >
            {label}
            <X size={12} className="text-[#999]" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button
        onClick={clearFilters}
        className="flex-shrink-0 font-body text-[12px] text-[#999] hover:text-black hover:underline transition-colors duration-150 ml-1"
      >
        Clear All
      </button>
    </div>
  );
};

export default memo(ActiveFilters);
