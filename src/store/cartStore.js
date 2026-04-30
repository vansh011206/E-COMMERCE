import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, size, color, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor?.name === color?.name
          );

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }

          return { 
            items: [...state.items, { 
              id: `${product.id}-${size}-${color?.name || 'default'}`,
              product, 
              quantity, 
              selectedSize: size, 
              selectedColor: color 
            }] 
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId)
        }));
      },

      updateQuantity: (itemId, qty) => {
        set((state) => ({
          items: state.items.map((item) => 
            item.id === itemId ? { ...item, quantity: Math.max(1, qty) } : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      getCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'luxecart-cart-storage',
    }
  )
);
