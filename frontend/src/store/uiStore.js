import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isFilterOpen: false,

  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
}));
