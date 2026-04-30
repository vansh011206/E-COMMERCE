import React, { useState, useRef, useEffect, memo } from 'react';
import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Discount', value: 'discount' },
  { label: 'Newest First', value: 'newest' },
];

const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentLabel = SORT_OPTIONS.find((o) => o.value === value)?.label || 'Recommended';

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white border border-[#E8E8E8] rounded-lg px-3.5 py-2 font-body text-[13px] text-[#555] hover:border-[#CCC] transition-colors duration-200"
      >
        <span>Sort: <span className="text-[#0A0A0A] font-medium">{currentLabel}</span></span>
        <ChevronDown size={14} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#E8E8E8] rounded-lg shadow-xl z-50 py-1 animate-fadeIn">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 font-body text-[13px] transition-colors duration-150 ${
                value === option.value
                  ? 'text-black font-medium bg-[#F8F8F6]'
                  : 'text-[#555] hover:bg-[#FAFAFA] hover:text-[#0A0A0A]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(SortDropdown);
