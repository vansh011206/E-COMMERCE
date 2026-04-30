import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      toggle: (product) => {
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) {
            return { items: state.items.filter((item) => item.id !== product.id) };
          }
          return { items: [...state.items, product] };
        });
      },

      isWishlisted: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'luxecart-wishlist-storage',
    }
  )
);
