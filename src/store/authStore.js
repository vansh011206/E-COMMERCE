import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      orders: [],
      addresses: [],
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({
            user: { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin, avatar: data.name.charAt(0).toUpperCase() },
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
        set({ user: null, isAuthenticated: false, orders: [], error: null });
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

      addAddress: (address) => {
        const id = `addr_${Date.now()}`;
        set((state) => ({ addresses: [...state.addresses, { ...address, id }] }));
        return id;
      },

      updateAddress: (id, data) => {
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...data } : a))
        }));
      },

      removeAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id)
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'luxecart-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        addresses: state.addresses
      })
    }
  )
);
