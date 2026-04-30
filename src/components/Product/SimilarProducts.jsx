import React, { useRef, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const SimilarProducts = ({ products, title = "Similar Products" }) => {
  const scrollRef = useRef(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 border-t border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-xl uppercase tracking-[0.06em] text-[#0A0A0A] font-bold">
            {title}
          </h2>
          <div className="flex items-center gap-4">
            <Link to="/shop" className="hidden sm:block font-body text-[13px] text-[#999] hover:text-black underline transition-colors">
              View All
            </Link>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-[#E8E8E8] flex items-center justify-center text-[#555] hover:border-black hover:text-black transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-[#E8E8E8] flex items-center justify-center text-[#555] hover:border-black hover:text-black transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-5 hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth snap-x"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[180px] md:w-[230px] flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(SimilarProducts);
