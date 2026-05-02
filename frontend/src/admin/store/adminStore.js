import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../../api';

// ─── ADMIN STORE (FULLY API-DRIVEN) ─────────────────────────────────
export const useAdminStore = create(
  persist(
    (set, get) => ({
      // Auth
      isAdminAuthenticated: false,
      adminUser: null,

      // Data (all from API)
      products: [],
      orders: [],
      users: [],
      notifications: [],
      unreadCount: 0,

      // Dashboard Stats (from /api/dashboard/stats)
      dashboardStats: null,
      isLoading: false,

      // ─── AUTH ────────────────────────────────
      adminLogin: async (email, password) => {
        try {
          const { data } = await api.post('/auth/login', { email, password });
          if (data.isAdmin) {
            set({
              isAdminAuthenticated: true,
              adminUser: {
                _id: data._id,
                email: data.email,
                name: data.name,
                role: 'Super Admin',
                lastLogin: new Date().toISOString(),
                avatar: data.name.charAt(0).toUpperCase()
              }
            });
            return { success: true };
          } else {
            await api.post('/auth/logout');
            return { success: false, error: 'Not authorized as admin' };
          }
        } catch (error) {
          return { success: false, error: error.response?.data?.message || 'Invalid credentials' };
        }
      },

      adminLogout: async () => {
        try { await api.post('/auth/logout'); } catch (e) {}
        set({ isAdminAuthenticated: false, adminUser: null, products: [], orders: [], users: [], notifications: [], dashboardStats: null });
      },

      // ─── DATA LOADING (ALL FROM API) ─────────
      initializeData: async () => {
        set({ isLoading: true });
        try {
          const [productsRes, ordersRes, usersRes, statsRes, notifsRes] = await Promise.all([
            api.get('/products'),
            api.get('/orders'),
            api.get('/users'),
            api.get('/dashboard/stats'),
            api.get('/notifications')
          ]);

          set({
            products: productsRes.data.map(p => ({ ...p, id: p.customId || p._id })),
            orders: ordersRes.data,
            users: usersRes.data.map(u => ({
              ...u,
              id: u._id,
              avatar: u.name?.charAt(0)?.toUpperCase() || 'U'
            })),
            dashboardStats: statsRes.data,
            notifications: notifsRes.data,
            unreadCount: notifsRes.data.filter(n => !n.isRead).length,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to load admin data:', error.response?.data?.message || error.message);
          set({ isLoading: false });
        }
      },

      refreshStats: async () => {
        try {
          const { data } = await api.get('/dashboard/stats');
          set({ dashboardStats: data });
        } catch (error) {
          console.error('Failed to refresh stats');
        }
      },

      refreshData: () => get().initializeData(),

      // ─── PRODUCT ACTIONS ────────────────────
      addProduct: async (productData) => {
        try {
          const { data } = await api.post('/products', productData);
          set(state => ({ products: [{ ...data, id: data.customId || data._id }, ...state.products] }));
          get().refreshStats();
          return data;
        } catch (error) {
          console.error('Failed to add product:', error);
          throw error;
        }
      },

      updateProduct: async (id, updatedData) => {
        try {
          const { data } = await api.put(`/products/${id}`, updatedData);
          set(state => ({
            products: state.products.map(p => p.id === id ? { ...p, ...data, id: data.customId || data._id } : p)
          }));
          get().refreshStats();
          return data;
        } catch (error) {
          console.error('Failed to update product:', error);
          throw error;
        }
      },

      deleteProduct: async (id) => {
        try {
          await api.delete(`/products/${id}`);
          set(state => ({ products: state.products.filter(p => p.id !== id) }));
          get().refreshStats();
        } catch (error) {
          console.error('Failed to delete product:', error);
          throw error;
        }
      },

      toggleProductStatus: async (id) => {
        const product = get().products.find(p => p.id === id);
        if (product) {
          await get().updateProduct(id, { isActive: !product.isActive });
        }
      },

      // ─── ORDER ACTIONS ──────────────────────
      updateOrderStatus: async (orderId, newStatus, note = '') => {
        try {
          const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus, note });
          set(state => ({
            orders: state.orders.map(order => order.orderId === orderId ? data : order)
          }));
          get().refreshStats();
          return data;
        } catch (error) {
          console.error('Failed to update order status:', error);
          throw error;
        }
      },

      // ─── USER ACTIONS ──────────────────────
      createUser: async (userData) => {
        try {
          const { data } = await api.post('/users', userData);
          set(state => ({ users: [{ ...data, id: data._id, avatar: data.name.charAt(0).toUpperCase() }, ...state.users] }));
          get().refreshStats();
          return data;
        } catch (error) {
          console.error('Failed to create user:', error);
          throw error;
        }
      },

      deleteUser: async (userId) => {
        try {
          await api.delete(`/users/${userId}`);
          set(state => ({ users: state.users.filter(u => u.id !== userId && u._id !== userId) }));
          get().refreshStats();
        } catch (error) {
          console.error('Failed to delete user:', error);
          throw error;
        }
      },

      updateUser: async (userId, userData) => {
        try {
          const { data } = await api.put(`/users/${userId}`, userData);
          set(state => ({
            users: state.users.map(u => (u.id === userId || u._id === userId) ? { ...u, ...data, id: data._id, avatar: data.name.charAt(0).toUpperCase() } : u)
          }));
          return data;
        } catch (error) {
          console.error('Failed to update user:', error);
          throw error;
        }
      },

      // ─── NOTIFICATION ACTIONS ───────────────
      fetchNotifications: async () => {
        try {
          const { data } = await api.get('/notifications');
          set({ notifications: data, unreadCount: data.filter(n => !n.isRead).length });
        } catch (error) {
          console.error('Failed to fetch notifications');
        }
      },

      markNotificationRead: async (id) => {
        try {
          await api.put(`/notifications/${id}/read`);
          set(state => ({
            notifications: state.notifications.map(n => n._id === id ? { ...n, isRead: true } : n),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }));
        } catch (error) {
          console.error('Failed to mark notification read');
        }
      },

      markAllRead: async () => {
        try {
          await api.put('/notifications/read-all');
          set(state => ({
            notifications: state.notifications.map(n => ({ ...n, isRead: true })),
            unreadCount: 0
          }));
        } catch (error) {
          console.error('Failed to mark all as read');
        }
      },

      addNotification: (notification) => {
        set(state => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },

      clearAllData: () => {
        // No-op: database clearing should be done via admin API or CLI
      }
    }),
    {
      name: 'admin-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser
      })
    }
  )
);
