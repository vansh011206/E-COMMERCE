import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useUiStore } from '../store/uiStore';
import FilterPanel from '../components/Shop/FilterPanel';
import SortDropdown from '../components/Shop/SortDropdown';
import ActiveFilters from '../components/Shop/ActiveFilters';
import ProductGrid from '../components/Product/ProductGrid';
import Footer from '../components/Layout/Footer';

const PAGE_SIZE = 20;

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { filteredProducts, filters, setFilter, setSearch, clearFilters } = useProductStore();
  const { toggleFilter } = useUiStore();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sync URL params to store on mount
  useEffect(() => {
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory') || searchParams.get('type');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort') || searchParams.get('sortBy');
    const discount = searchParams.get('discount');

    if (category) setFilter('category', [category]);
    if (subCategory) setFilter('subCategory', [subCategory]);
    if (q) setSearch(q);
    if (sort) setFilter('sortBy', sort);
    if (discount) setFilter('discount', parseInt(discount));
  }, []); // Run once on mount

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredProducts.length]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Infinite scroll
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 400);
  }, [loadingMore, hasMore]);

  // Scroll sentinel
  useEffect(() => {
    const sentinel = document.getElementById('load-more-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleLoadMore();
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  // Generate heading from filters
  const getHeading = () => {
    const cats = filters.category;
    const subs = filters.subCategory;
    if (cats.length === 1 && subs.length === 1) return `${cats[0]}'s ${subs[0]}`;
    if (cats.length === 1) return `${cats[0]}'s Fashion`;
    return 'All Products';
  };

  const handleSortChange = (val) => setFilter('sortBy', val);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="py-4 font-body text-[12px] text-[#999] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#555] transition-colors duration-150">Home</Link>
          <span>/</span>
          {filters.category.length === 1 ? (
            <>
              <span className="hover:text-[#555]">{filters.category[0]}</span>
              {filters.subCategory.length === 1 && (
                <>
                  <span>/</span>
                  <span className="text-[#0A0A0A]">{filters.subCategory[0]}</span>
                </>
              )}
            </>
          ) : (
            <span className="text-[#0A0A0A]">All Products</span>
          )}
        </div>

        {/* Heading + Result Count + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <div className="flex items-baseline gap-3">
            <h1 className="font-heading text-2xl uppercase text-[#0A0A0A] tracking-[0.04em] font-bold">
              {getHeading()}
            </h1>
            <span className="font-mono text-[13px] text-[#999]">
              {filteredProducts.length} Results
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter trigger */}
            <button
              onClick={toggleFilter}
              className="md:hidden flex items-center gap-2 bg-white border border-[#E8E8E8] rounded-lg px-3.5 py-2 font-body text-[13px] text-[#555]"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <SortDropdown value={filters.sortBy} onChange={handleSortChange} />
          </div>
        </div>

        {/* Active Filters */}
        <div className="pb-4">
          <ActiveFilters />
        </div>

        {/* Main Layout */}
        <div className="flex gap-6 pb-16">
          {/* Filter Sidebar */}
          <FilterPanel />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={visibleProducts}
              isLoading={false}
              loadingMore={loadingMore}
            />

            {/* Sentinel for infinite scroll */}
            {hasMore && <div id="load-more-sentinel" className="h-4" />}

            {/* End message */}
            {!hasMore && filteredProducts.length > 0 && (
              <p className="text-center font-body text-[13px] text-[#999] py-8">
                You've seen all {filteredProducts.length} products
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default memo(Shop);
