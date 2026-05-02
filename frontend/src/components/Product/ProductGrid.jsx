import React, { memo } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

const ProductGrid = ({ products, isLoading, loadingMore }) => {
  // Initial loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Filter size={48} className="text-[#CCC] mb-4" strokeWidth={1} />
        <h3 className="font-heading text-xl text-[#0A0A0A] mb-2">No products found</h3>
        <p className="font-body text-[14px] text-[#999] mb-6 max-w-xs">
          Try adjusting or clearing your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading more skeletons */}
      {loadingMore && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`more-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ProductGrid);
