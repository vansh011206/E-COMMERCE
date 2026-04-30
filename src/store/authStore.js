import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      orders: [],
      addresses: [],

      login: (email, password) => {
        // Mock implementation
        set({
          user: { name: 'Demo User', email, avatar: '', phone: '+91 9876543210' },
          isAuthenticated: true
        });
      },

      signup: (data) => {
        // Mock implementation
        set({
          user: { name: data.name, email: data.email, avatar: '', phone: data.phone || '' },
          isAuthenticated: true
        });
      },

      loginWithGoogle: () => {
        // Mock implementation
        set({
          user: { name: 'Google User', email: 'google@example.com', avatar: '', phone: '' },
          isAuthenticated: true
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      addOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }));
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
    }),
    {
      name: 'luxecart-auth-storage',
    }
  )
);
