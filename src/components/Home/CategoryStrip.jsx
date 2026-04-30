import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
  { label: 'Footwear', value: 'Footwear' },
  { label: 'Accessories', value: 'Accessories' },
  { label: 'Ethnic', value: 'Ethnic Wear' },
  { label: 'Activewear', value: 'Activewear' },
  { label: 'Sale', value: 'sale' },
  { label: 'New In', value: 'new' },
];

const CategoryStrip = () => {
  const navigate = useNavigate();
  const { filters, setFilter, clearFilters } = useProductStore();
  const activeCategory = filters.category.length === 1 ? filters.category[0] : '';

  const handleClick = (value) => {
    if (value === '') {
      clearFilters();
      navigate('/shop');
    } else if (value === 'sale') {
      clearFilters();
      setFilter('discount', 30);
      navigate('/shop?discount=30');
    } else if (value === 'new') {
      clearFilters();
      navigate('/shop?sort=newest');
    } else {
      clearFilters();
      setFilter('category', [value]);
      navigate(`/shop?category=${value}`);
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-[#E8E8E8] sticky top-[94px] z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto hide-scrollbar px-6">
          {CATEGORIES.map(({ label, value }) => {
            const isActive = value === activeCategory || (value === '' && activeCategory === '');
            return (
              <button
                key={label}
                onClick={() => handleClick(value)}
                className={`flex-shrink-0 h-10 px-5 font-body text-[13px] uppercase tracking-[0.06em] font-medium border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'text-black border-black'
                    : 'text-[#555] border-transparent hover:text-[#0A0A0A] hover:border-[#0A0A0A]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryStrip);
