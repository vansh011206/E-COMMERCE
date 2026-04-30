import { create } from 'zustand';
import { products } from '../data/products';

const initialFilters = {
  category: [],
  subCategory: [],
  brand: [],
  priceRange: [0, 20000],
  rating: 0,
  discount: 0,
  size: [],
  color: [],
  sortBy: 'popularity' // price-low, price-high, newest, rating, discount
};

export const useProductStore = create((set, get) => ({
  allProducts: products,
  filteredProducts: products,
  searchQuery: '',
  filters: { ...initialFilters },
  viewHistory: [],

  setFilter: (filterName, value) => {
    set((state) => {
      const newFilters = { ...state.filters, [filterName]: value };
      return { filters: newFilters, filteredProducts: get().applyFilters(state.allProducts, newFilters, state.searchQuery) };
    });
  },

  clearFilters: () => {
    set((state) => ({ 
      filters: { ...initialFilters }, 
      filteredProducts: get().applyFilters(state.allProducts, initialFilters, state.searchQuery) 
    }));
  },

  setSearch: (query) => {
    set((state) => ({ 
      searchQuery: query, 
      filteredProducts: get().applyFilters(state.allProducts, state.filters, query) 
    }));
  },

  getProduct: (id) => {
    return get().allProducts.find(p => p.id === id);
  },

  getRelated: (productId) => {
    const product = get().getProduct(productId);
    if (!product) return [];
    return get().allProducts
      .filter(p => p.id !== productId && p.category === product.category && p.subCategory === product.subCategory)
      .slice(0, 10);
  },

  getRecommended: () => {
    const state = get();
    if (state.viewHistory.length === 0) {
      return state.allProducts.filter(p => p.isTrending).slice(0, 10);
    }
    const lastViewed = state.getProduct(state.viewHistory[0]);
    if (!lastViewed) return state.allProducts.slice(0, 10);
    
    return state.allProducts
      .filter(p => p.category === lastViewed.category && p.id !== lastViewed.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  },

  addToViewHistory: (id) => {
    set((state) => {
      const newHistory = [id, ...state.viewHistory.filter(viewId => viewId !== id)].slice(0, 20);
      return { viewHistory: newHistory };
    });
  },

  getRecentlyViewed: () => {
    const state = get();
    return state.viewHistory.map(id => state.getProduct(id)).filter(Boolean);
  },

  applyFilters: (products, filters, query) => {
    let result = [...products];

    // Search Query
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category.length > 0) {
      result = result.filter(p => filters.category.includes(p.category));
    }

    // SubCategory
    if (filters.subCategory.length > 0) {
      result = result.filter(p => filters.subCategory.includes(p.subCategory));
    }

    // Brand
    if (filters.brand.length > 0) {
      result = result.filter(p => filters.brand.includes(p.brand));
    }

    // Price Range
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Rating
    if (filters.rating > 0) {
      result = result.filter(p => p.rating >= filters.rating);
    }

    // Discount
    if (filters.discount > 0) {
      result = result.filter(p => p.discount >= filters.discount);
    }

    // Size
    if (filters.size.length > 0) {
      result = result.filter(p => filters.size.some(s => p.sizesAvailable[s]));
    }

    // Color
    if (filters.color.length > 0) {
      result = result.filter(p => p.colors.some(c => filters.color.includes(c.name)));
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }
}));
