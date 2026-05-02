import { create } from 'zustand';
import api from '../api';
import { useAuthStore } from './authStore';

export const useWishlistStore = create(
  (set, get) => ({
    // Note: Items are now primarily managed via authStore.wishlist
    // but we'll keep a local cache here for UI reactivity if needed.
    // However, it's better to just point to authStore.
    
    toggle: async (product) => {
      const authStore = useAuthStore.getState();
      if (!authStore.isAuthenticated) {
        throw new Error('Please login to manage wishlist');
      }

      try {
        const { data } = await api.post('/auth/wishlist/toggle', { 
          productId: product._id || product.id 
        });
        // Update authStore wishlist
        useAuthStore.setState({ wishlist: data });
        return data;
      } catch (error) {
        console.error('Wishlist toggle error:', error);
        throw error;
      }
    },

    isWishlisted: (productId) => {
      const wishlist = useAuthStore.getState().wishlist || [];
      return wishlist.some((item) => (item._id || item.id) === productId);
    },

    clear: async () => {
      // In a real app, you might have a clear API, 
      // but for now we'll just empty the array in DB if we had an endpoint.
      // Since we don't have a clear endpoint yet, we'll just log a warning or handle individually.
      console.warn('Clear wishlist not implemented on backend');
    },
  })
);
