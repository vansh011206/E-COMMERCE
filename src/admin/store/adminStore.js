import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../api';
import { products as allProducts } from '../../data/products';
import {
  format, subDays, subMonths, isSameDay, isSameMonth,
  startOfWeek, endOfWeek, isWithinInterval
} from 'date-fns';

// ─── MOCK DATA GENERATORS ────────────────────────
const NAMES = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh',
  'Vikram Gupta', 'Ananya Reddy', 'Rohan Mehta', 'Kavya Nair',
  'Arjun Verma', 'Deepa Iyer', 'Sanjay Joshi', 'Neha Kapoor',
  'Karan Malhotra', 'Pooja Desai', 'Nikhil Rao', 'Divya Pillai',
  'Manish Tiwari', 'Ritu Agarwal', 'Aditya Bose', 'Shreya Das'
];

const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { city: 'Delhi', state: 'Delhi', pincode: '110001' },
  { city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
  { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
  { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
  { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  { city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
  { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
];

const STATUSES = ['pending', 'confirmed', 'packed', 'dispatched', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
const STATUS_WEIGHTS = [20, 10, 8, 4, 15, 10, 30, 2, 1];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const pickWeightedStatus = () => {
  const total = STATUS_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < STATUSES.length; i++) {
    r -= STATUS_WEIGHTS[i];
    if (r <= 0) return STATUSES[i];
  }
  return 'pending';
};

const generateMockOrders = () => {
  const orders = [];
  const now = new Date();
  const prods = allProducts.length > 0 ? allProducts : [];

  for (let i = 0; i < 50; i++) {
    const name = randomFrom(NAMES);
    const email = name.toLowerCase().replace(' ', '.') + '@gmail.com';
    const cityInfo = randomFrom(CITIES);
    const daysAgo = randomBetween(0, 30);
    const hoursAgo = randomBetween(0, 23);
    const createdAt = new Date(now.getTime() - daysAgo * 86400000 - hoursAgo * 3600000);
    const status = pickWeightedStatus();
    const paymentMethod = Math.random() < 0.4 ? 'cod' : randomFrom(['upi', 'card', 'wallet', 'netbanking']);

    const itemCount = randomBetween(1, 3);
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      const p = prods.length > 0 ? randomFrom(prods) : null;
      if (p) {
        items.push({
          product: {
            id: p.id, name: p.name, price: p.price, mrp: p.mrp,
            image: p.images?.[0] || '', category: p.category, brand: p.brand
          },
          quantity: randomBetween(1, 3),
          selectedSize: randomFrom(['S', 'M', 'L', 'XL']),
          selectedColor: 'Standard'
        });
      }
    }

    const total = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0) || randomBetween(499, 8999);
    const mrp = items.reduce((sum, it) => sum + it.product.mrp * it.quantity, 0) || Math.round(total * 1.3);

    const statusHistory = [{ status: 'pending', timestamp: createdAt.toISOString(), note: 'Order placed successfully' }];
    const statusIdx = STATUSES.indexOf(status);
    if (statusIdx > 0 && status !== 'cancelled' && status !== 'returned') {
      for (let s = 1; s <= statusIdx; s++) {
        statusHistory.push({
          status: STATUSES[s],
          timestamp: new Date(createdAt.getTime() + s * 3600000 * randomBetween(2, 12)).toISOString(),
          note: `Status updated to ${STATUSES[s]}`
        });
      }
    }
    if (status === 'cancelled') {
      statusHistory.push({ status: 'cancelled', timestamp: new Date(createdAt.getTime() + 7200000).toISOString(), note: 'Order cancelled by customer' });
    }
    if (status === 'returned') {
      for (let s = 1; s <= 6; s++) {
        statusHistory.push({ status: STATUSES[s], timestamp: new Date(createdAt.getTime() + s * 3600000 * 4).toISOString(), note: `Status updated to ${STATUSES[s]}` });
      }
      statusHistory.push({ status: 'returned', timestamp: new Date(createdAt.getTime() + 30 * 3600000).toISOString(), note: 'Product returned by customer' });
    }

    orders.push({
      orderId: 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      userId: 'user_' + (i + 1),
      userName: name,
      userEmail: email,
      items,
      total,
      mrp,
      savings: mrp - total,
      paymentMethod,
      status,
      address: {
        fullName: name,
        phone: '98' + randomBetween(10000000, 99999999),
        addressLine1: 'House No. ' + randomBetween(1, 500) + ', Sector ' + randomBetween(1, 50),
        city: cityInfo.city,
        state: cityInfo.state,
        pincode: cityInfo.pincode,
        type: Math.random() > 0.5 ? 'home' : 'office'
      },
      statusHistory,
      adminNotes: [],
      deliveryFee: total > 999 ? 0 : 49,
      createdAt: createdAt.toISOString(),
      estimatedDelivery: new Date(createdAt.getTime() + 5 * 86400000).toISOString()
    });
  }

  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const generateMockUsers = () => {
  const users = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const name = NAMES[i % NAMES.length];
    const daysAgo = randomBetween(0, 30);
    const registeredAt = new Date(now.getTime() - daysAgo * 86400000);
    const ordersCount = randomBetween(0, 8);

    users.push({
      id: 'user_' + (i + 1),
      name,
      email: name.toLowerCase().replace(' ', '.') + '@gmail.com',
      phone: '98' + randomBetween(10000000, 99999999),
      avatar: name.charAt(0).toUpperCase(),
      registeredAt: registeredAt.toISOString(),
      lastActive: new Date(registeredAt.getTime() + randomBetween(0, daysAgo) * 86400000).toISOString(),
      ordersCount,
      totalSpent: ordersCount * randomBetween(500, 3000),
      provider: Math.random() > 0.3 ? 'email' : 'google'
    });
  }

  return users.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
};

// ─── ADMIN STORE ─────────────────────────────────
export const useAdminStore = create(
  persist(
    (set, get) => ({
      // Auth
      isAdminAuthenticated: false,
      adminUser: null,

      // Data
      products: [],
      orders: [],
      users: [],

      // Dashboard Stats
      dashboardStats: {
        totalRevenue: 0, revenueToday: 0, revenueThisWeek: 0,
        revenueThisMonth: 0, revenueLastMonth: 0, revenueGrowth: 0,
        totalOrders: 0, ordersToday: 0, ordersThisWeek: 0, ordersThisMonth: 0,
        pendingOrders: 0, confirmedOrders: 0, packedOrders: 0, dispatchedOrders: 0,
        shippedOrders: 0, outForDeliveryOrders: 0, deliveredOrders: 0,
        cancelledOrders: 0, returnedOrders: 0, orderGrowth: 0,
        totalPaymentReceived: 0, pendingPayment: 0, pendingPaymentOrders: 0,
        onlinePaymentTotal: 0, codTotal: 0, averageOrderValue: 0,
        totalProducts: 0, activeProducts: 0, outOfStockProducts: 0,
        lowStockProducts: 0, trendingProducts: 0,
        totalUsers: 0, newUsersToday: 0, newUsersThisWeek: 0,
        newUsersThisMonth: 0, userGrowth: 0,
        revenueChartData: [], orderStatusData: [], categoryData: [],
        topProducts: [], paymentMethodData: [], hourlyOrderData: [], weeklyData: []
      },

      // ─── AUTH ────────────────────────────────
      adminLogin: async (email, password) => {
        try {
          const { data } = await api.post('/auth/login', { email, password });
          if (data.isAdmin) {
            set({
              isAdminAuthenticated: true,
              adminUser: {
                email: data.email, name: data.name, role: 'Super Admin',
                lastLogin: new Date().toISOString(), avatar: data.name.charAt(0).toUpperCase()
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
        try {
          await api.post('/auth/logout');
        } catch (error) {}
        set({ isAdminAuthenticated: false, adminUser: null });
      },

      // ─── DATA LOADING ───────────────────────
      initializeData: async () => {
        try {
          // Fetch from backend
          const [productsRes, ordersRes, usersRes] = await Promise.all([
            api.get('/products'),
            api.get('/orders', { withCredentials: true }),
            api.get('/users', { withCredentials: true })
          ]);

          const formattedProducts = productsRes.data.map(p => ({ ...p, id: p.customId || p._id }));
          
          set({
            products: formattedProducts,
            orders: ordersRes.data,
            users: usersRes.data.map(u => ({
              ...u,
              id: u._id,
              joinedAt: u.createdAt,
              avatar: u.name.charAt(0).toUpperCase(),
              totalOrders: u.ordersCount || 0,
              totalSpent: u.totalSpent || 0
            }))
          });

          get().calculateDashboardStats();
        } catch (error) {
          console.error("Failed to load admin data", error);
        }
      },

      // ─── STATS CALCULATION ──────────────────
      calculateDashboardStats: () => {
        const { orders, users, products } = get();
        const now = new Date();

        const isToday = (dateStr) => {
          try { return isSameDay(new Date(dateStr), now); } catch { return false; }
        };
        const isThisWeek = (dateStr) => {
          try {
            return isWithinInterval(new Date(dateStr), { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) });
          } catch { return false; }
        };
        const isThisMonth = (dateStr) => {
          try { return isSameMonth(new Date(dateStr), now); } catch { return false; }
        };
        const isLastMonth = (dateStr) => {
          try { return isSameMonth(new Date(dateStr), subMonths(now, 1)); } catch { return false; }
        };

        // Revenue
        const deliveredOrders = orders.filter(o => o.status === 'delivered');
        const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const revenueToday = deliveredOrders.filter(o => isToday(o.createdAt)).reduce((sum, o) => sum + (o.total || 0), 0);
        const revenueThisWeek = deliveredOrders.filter(o => isThisWeek(o.createdAt)).reduce((sum, o) => sum + (o.total || 0), 0);
        const revenueThisMonth = deliveredOrders.filter(o => isThisMonth(o.createdAt)).reduce((sum, o) => sum + (o.total || 0), 0);
        const revenueLastMonth = deliveredOrders.filter(o => isLastMonth(o.createdAt)).reduce((sum, o) => sum + (o.total || 0), 0);
        const revenueGrowth = revenueLastMonth === 0 ? 100 : Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100);

        // Order counts
        const countByStatus = (status) => orders.filter(o => o.status === status).length;
        const ordersToday = orders.filter(o => isToday(o.createdAt)).length;
        const ordersThisWeek = orders.filter(o => isThisWeek(o.createdAt)).length;
        const ordersThisMonth = orders.filter(o => isThisMonth(o.createdAt)).length;
        const ordersLastMonth = orders.filter(o => isLastMonth(o.createdAt)).length;
        const orderGrowth = ordersLastMonth === 0 ? 100 : Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100);

        // Payments
        const pendingPaymentOrders = orders.filter(o => o.paymentMethod === 'cod' && !['delivered', 'cancelled', 'returned'].includes(o.status));
        const pendingPayment = pendingPaymentOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const onlineOrders = deliveredOrders.filter(o => o.paymentMethod !== 'cod');
        const codDelivered = deliveredOrders.filter(o => o.paymentMethod === 'cod');
        const onlinePaymentTotal = onlineOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const codTotal = codDelivered.reduce((sum, o) => sum + (o.total || 0), 0);
        const averageOrderValue = deliveredOrders.length > 0 ? Math.round(totalRevenue / deliveredOrders.length) : 0;

        // Revenue chart (30 days)
        const revenueChartData = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(now, 29 - i);
          const dayOrders = orders.filter(o => { try { return isSameDay(new Date(o.createdAt), date); } catch { return false; } });
          const dayDelivered = dayOrders.filter(o => o.status === 'delivered');
          return {
            date: format(date, 'MMM dd'),
            fullDate: date.toISOString(),
            revenue: dayDelivered.reduce((sum, o) => sum + (o.total || 0), 0),
            orders: dayOrders.length,
            delivered: dayDelivered.length
          };
        });

        // Order status pie
        const orderStatusData = [
          { name: 'Pending', value: countByStatus('pending'), color: '#D29922' },
          { name: 'Confirmed', value: countByStatus('confirmed'), color: '#58A6FF' },
          { name: 'Packed', value: countByStatus('packed'), color: '#7B61FF' },
          { name: 'Dispatched', value: countByStatus('dispatched'), color: '#F0883E' },
          { name: 'Shipped', value: countByStatus('shipped'), color: '#58A6FF' },
          { name: 'Out for Delivery', value: countByStatus('out_for_delivery'), color: '#3FB950' },
          { name: 'Delivered', value: countByStatus('delivered'), color: '#3FB950' },
          { name: 'Cancelled', value: countByStatus('cancelled'), color: '#F85149' },
          { name: 'Returned', value: countByStatus('returned'), color: '#F85149' },
        ].filter(d => d.value > 0);

        // Category sales
        const categoryMap = {};
        orders.forEach(order => {
          (order.items || []).forEach(item => {
            const cat = item.product?.category || 'Other';
            if (!categoryMap[cat]) categoryMap[cat] = { sales: 0, revenue: 0 };
            categoryMap[cat].sales += item.quantity || 0;
            categoryMap[cat].revenue += (item.product?.price || 0) * (item.quantity || 0);
          });
        });
        const categoryData = Object.entries(categoryMap).map(([category, data]) => ({ category, ...data }));

        // Payment methods
        const paymentMap = {};
        orders.forEach(o => {
          const method = o.paymentMethod || 'unknown';
          if (!paymentMap[method]) paymentMap[method] = { count: 0, amount: 0 };
          paymentMap[method].count++;
          paymentMap[method].amount += o.total || 0;
        });
        const paymentMethodData = Object.entries(paymentMap).map(([method, data]) => ({ method: method.toUpperCase(), ...data }));

        // Top products
        const productOrderMap = {};
        orders.forEach(order => {
          (order.items || []).forEach(item => {
            const pid = item.product?.id;
            if (!pid) return;
            if (!productOrderMap[pid]) {
              productOrderMap[pid] = { product: item.product, orderCount: 0, totalRevenue: 0, totalQuantity: 0 };
            }
            productOrderMap[pid].orderCount++;
            productOrderMap[pid].totalQuantity += item.quantity || 0;
            productOrderMap[pid].totalRevenue += (item.product.price || 0) * (item.quantity || 0);
          });
        });
        const topProducts = Object.values(productOrderMap).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

        // Hourly data
        const hourlyOrderData = Array.from({ length: 24 }, (_, hour) => {
          const count = orders.filter(o => {
            try {
              const d = new Date(o.createdAt);
              return isToday(o.createdAt) && d.getHours() === hour;
            } catch { return false; }
          }).length;
          return { hour: `${hour}:00`, orders: count };
        });

        // Weekly comparison
        const weeklyData = Array.from({ length: 7 }, (_, i) => {
          const thisDay = subDays(now, 6 - i);
          const lastDay = subDays(now, 13 - i);
          const thisRevenue = orders.filter(o => { try { return isSameDay(new Date(o.createdAt), thisDay) && o.status === 'delivered'; } catch { return false; } }).reduce((sum, o) => sum + (o.total || 0), 0);
          const lastRevenue = orders.filter(o => { try { return isSameDay(new Date(o.createdAt), lastDay) && o.status === 'delivered'; } catch { return false; } }).reduce((sum, o) => sum + (o.total || 0), 0);
          return { day: format(thisDay, 'EEE'), thisWeek: thisRevenue, lastWeek: lastRevenue };
        });

        // User stats
        const newUsersToday = users.filter(u => isToday(u.registeredAt)).length;
        const newUsersThisWeek = users.filter(u => isThisWeek(u.registeredAt)).length;
        const newUsersThisMonth = users.filter(u => isThisMonth(u.registeredAt)).length;
        const newUsersLastMonth = users.filter(u => isLastMonth(u.registeredAt)).length;
        const userGrowth = newUsersLastMonth === 0 ? 100 : Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100);

        // Product stats
        const outOfStockProducts = products.filter(p => p.stock === 0).length;
        const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length;

        set({
          dashboardStats: {
            totalRevenue, revenueToday, revenueThisWeek, revenueThisMonth, revenueLastMonth, revenueGrowth,
            totalOrders: orders.length, ordersToday, ordersThisWeek, ordersThisMonth,
            pendingOrders: countByStatus('pending'), confirmedOrders: countByStatus('confirmed'),
            packedOrders: countByStatus('packed'), dispatchedOrders: countByStatus('dispatched'),
            shippedOrders: countByStatus('shipped'), outForDeliveryOrders: countByStatus('out_for_delivery'),
            deliveredOrders: countByStatus('delivered'), cancelledOrders: countByStatus('cancelled'),
            returnedOrders: countByStatus('returned'), orderGrowth,
            totalPaymentReceived: totalRevenue, pendingPayment, pendingPaymentOrders: pendingPaymentOrders.length,
            onlinePaymentTotal, codTotal, averageOrderValue,
            totalProducts: products.length, activeProducts: products.filter(p => p.stock > 0).length,
            outOfStockProducts, lowStockProducts, trendingProducts: products.filter(p => p.isTrending).length,
            totalUsers: users.length, newUsersToday, newUsersThisWeek, newUsersThisMonth, userGrowth,
            revenueChartData, orderStatusData, categoryData, topProducts, paymentMethodData, hourlyOrderData, weeklyData
          }
        });
      },

      // ─── PRODUCT ACTIONS ────────────────────
      addProduct: async (productData) => {
        try {
          const { data } = await api.post('/products', productData, { withCredentials: true });
          const newProduct = { ...data, id: data.customId || data._id };
          set(state => ({ products: [newProduct, ...state.products] }));
          get().calculateDashboardStats();
        } catch (error) {
          console.error("Failed to add product", error);
        }
      },

      updateProduct: async (id, updatedData) => {
        try {
          const { data } = await api.put(`/products/${id}`, updatedData, { withCredentials: true });
          set(state => ({
            products: state.products.map(p => p.id === id ? { ...p, ...data, id: data.customId || data._id } : p)
          }));
          get().calculateDashboardStats();
        } catch (error) {
          console.error("Failed to update product", error);
        }
      },

      deleteProduct: async (id) => {
        try {
          await api.delete(`/products/${id}`, { withCredentials: true });
          set(state => ({ products: state.products.filter(p => p.id !== id) }));
          get().calculateDashboardStats();
        } catch (error) {
          console.error("Failed to delete product", error);
        }
      },

      toggleProductStatus: async (id) => {
        const product = get().products.find(p => p.id === id);
        if (product) {
          get().updateProduct(id, { isActive: !product.isActive });
        }
      },

      // ─── ORDER ACTIONS ──────────────────────
      updateOrderStatus: async (orderId, newStatus, note = '') => {
        try {
          const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus, note }, { withCredentials: true });
          const updatedOrders = get().orders.map(order => order.orderId === orderId ? data : order);
          set({ orders: updatedOrders });
          get().calculateDashboardStats();
        } catch (error) {
          console.error("Failed to update order status", error);
        }
      },

      addAdminNote: async (orderId, note) => {
        // Mocking note for now since we didn't implement admin note API
        set(state => ({
          orders: state.orders.map(o =>
            o.orderId === orderId ? { ...o, adminNotes: [...(o.adminNotes || []), { note, timestamp: new Date().toISOString() }] } : o
          )
        }));
      },

      // ─── USER ACTIONS ──────────────────────
      deleteUser: async (userId) => {
        try {
          await api.delete(`/users/${userId}`, { withCredentials: true });
          const updatedUsers = get().users.filter(u => u.id !== userId);
          set({ users: updatedUsers });
          get().calculateDashboardStats();
        } catch (error) {
          console.error("Failed to delete user", error);
        }
      },

      clearAllData: () => {
        // Can't clear all DB from frontend easily without API, skipping for now
      },

      refreshData: () => {
        get().initializeData();
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser,
        products: state.products
      })
    }
  )
);
