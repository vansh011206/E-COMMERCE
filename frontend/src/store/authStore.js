import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      orders: [],
      addresses: [],
      wishlist: [],
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({
            user: { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin, avatar: data.name.charAt(0).toUpperCase() },
            token: data.token,
            addresses: data.addresses || [],
            wishlist: data.wishlist || [],
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return data;
        } catch (error) {
          const msg = error.response?.data?.message || 'Login failed';
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone
          });
          set({
            user: { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin, avatar: data.name.charAt(0).toUpperCase() },
            token: data.token,
            addresses: data.addresses || [],
            wishlist: data.wishlist || [],
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return data;
        } catch (error) {
          const msg = error.response?.data?.message || 'Signup failed';
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout API error', error);
        }
        set({ user: null, token: null, isAuthenticated: false, orders: [], addresses: [], wishlist: [], error: null });
      },

      fetchMyOrders: async () => {
        try {
          const { data } = await api.get('/orders/myorders');
          set({ orders: data });
        } catch (error) {
          console.error('Failed to fetch orders', error);
        }
      },

      addOrder: async (orderPayload) => {
        try {
          const { data } = await api.post('/orders', orderPayload);
          set((state) => ({ orders: [data, ...state.orders] }));
          return data;
        } catch (error) {
          console.error('Failed to place order', error);
          throw error;
        }
      },

      addAddress: async (address) => {
        try {
          const { data } = await api.post('/auth/addresses', address);
          set({ addresses: data });
          return data[data.length - 1]._id; // Return the new ID
        } catch (error) {
          console.error('Failed to add address', error);
          throw error;
        }
      },

      updateAddress: async (id, addressData) => {
        try {
          const { data } = await api.put(`/auth/addresses/${id}`, addressData);
          set({ addresses: data });
        } catch (error) {
          console.error('Failed to update address', error);
          throw error;
        }
      },

      removeAddress: async (id) => {
        try {
          const { data } = await api.delete(`/auth/addresses/${id}`);
          set({ addresses: data });
        } catch (error) {
          console.error('Failed to remove address', error);
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'luxecart-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        addresses: state.addresses,
        wishlist: state.wishlist
      })
    }
  )
);
