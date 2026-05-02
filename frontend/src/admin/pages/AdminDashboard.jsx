import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, ShoppingBag, Clock, Users, RefreshCw, ChevronRight, AlertTriangle, Package, Loader2 } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import OrderStatusPie from '../components/OrderStatusPie';
import RecentOrders from '../components/RecentOrders';
import TopProducts from '../components/TopProducts';
import RecentUsers from '../components/RecentUsers';
import socket from '../../socket';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { initializeData, refreshData, dashboardStats: s, products, isLoading, addNotification } = useAdminStore();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [period, setPeriod] = useState('30 Days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    initializeData();

    // Socket.IO real-time
    socket.connect();
    socket.emit('join_admin');

    socket.on('new_order', (order) => {
      refreshData();
    });

    socket.on('new_notification', (notif) => {
      addNotification(notif);
    });

    socket.on('new_user', () => {
      refreshData();
    });

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => refreshData(), 30000);

    return () => {
      clearInterval(interval);
      socket.off('new_order');
      socket.off('new_notification');
      socket.off('new_user');
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Loading state
  if (isLoading && !s) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#999]" />
          <p className="font-body text-[14px] text-[#999]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Empty state - fresh start
  const isEmpty = !s || (s.totalOrders === 0 && s.totalUsers === 0 && s.totalProducts === 0);

  // Order Pipeline Stats
  const pipeline = [
    { id: 'Pending', label: 'Pending', count: s?.pendingOrders || 0, color: '#F59E0B' },
    { id: 'Confirmed', label: 'Confirmed', count: s?.confirmedOrders || 0, color: '#3B82F6' },
    { id: 'Packed', label: 'Packed', count: s?.packedOrders || 0, color: '#8B5CF6' },
    { id: 'Dispatched', label: 'Dispatched', count: s?.dispatchedOrders || 0, color: '#F97316' },
    { id: 'Shipped', label: 'Shipped', count: s?.shippedOrders || 0, color: '#06B6D4' },
    { id: 'Out for Delivery', label: 'OFD', count: s?.outForDeliveryOrders || 0, color: '#10B981' },
    { id: 'Delivered', label: 'Delivered', count: s?.deliveredOrders || 0, color: '#10B981' }
  ];
  const pipelineTotal = pipeline.reduce((sum, p) => sum + p.count, 0) || 1;

  // Stock Alerts
  const lowStockProducts = (products || []).filter(p => p.stock > 0 && p.stock < 10);
  const outOfStockProducts = (products || []).filter(p => p.stock === 0);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* ROW 1: WELCOME HEADER */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
        className="flex flex-col xl:flex-row xl:items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-heading text-[32px] text-[#0A0A0A] font-bold">Dashboard</h1>
          <p className="font-body text-[15px] text-[#999999] mt-1">
            {isEmpty ? 'Welcome! Your store is ready. Start adding products.' : "Here's what's happening with your store."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-mono text-[14px] text-[#999999]">
            {time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} · {time.toLocaleTimeString()}
          </p>
          <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E8E8E8] rounded-full p-1">
            {['Today', '7 Days', '30 Days', 'All'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`h-[36px] px-4 rounded-full font-body text-[13px] transition-all duration-150 ${period === p ? 'bg-[#0A0A0A] text-white' : 'text-[#555555] hover:bg-[#FAFAFA]'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button 
            onClick={handleRefresh}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-lg border border-[#E8E8E8] bg-white hover:bg-[#FAFAFA] transition-colors shrink-0"
          >
            <RefreshCw size={16} className={`text-[#555555] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* ROW 2: STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          index={0} title="Total Revenue" value={s?.totalRevenue || 0} isCurrency 
          change={0} changeType="up" icon={IndianRupee}
          bottomContent={
            <p className="font-mono text-[14px] text-[#0A0A0A]">
              ₹{(s?.revenueToday || 0).toLocaleString('en-IN')} today
              <span className="mx-2 text-[#E8E8E8]">•</span>
              <span className="text-[#555555]">₹{(s?.revenueThisMonth || 0).toLocaleString('en-IN')} this month</span>
            </p>
          }
        />
        <StatsCard 
          index={1} title="Total Orders" value={s?.totalOrders || 0} 
          change={0} changeType="up" icon={ShoppingBag}
          bottomContent={
            <p className="font-mono text-[14px] text-[#0A0A0A]">
              {s?.ordersToday || 0} today
              <span className="mx-2 text-[#E8E8E8]">•</span>
              <span className="text-[#555555]">{s?.ordersThisMonth || 0} this month</span>
            </p>
          }
        />
        <StatsCard 
          index={2} title="Total Products" value={s?.totalProducts || 0} 
          change={0} changeType="up" icon={Package}
          bottomContent={
            <p className="font-mono text-[14px] text-[#555555]">
              {lowStockProducts.length} low stock · {outOfStockProducts.length} out of stock
            </p>
          }
        />
        <StatsCard 
          index={3} title="Registered Users" value={s?.totalUsers || 0} 
          change={0} changeType="up" icon={Users}
          bottomContent={
            <p className="font-mono text-[14px] text-[#0A0A0A]">
              {s?.newUsersToday || 0} new today
              <span className="mx-2 text-[#E8E8E8]">•</span>
              <span className="text-[#555555]">{s?.newUsersThisMonth || 0} this month</span>
            </p>
          }
        />
      </div>

      {/* ROW 3: ORDER PIPELINE */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-white border border-[#E8E8E8] rounded-xl p-7"
      >
        <h3 className="font-heading text-[20px] text-[#0A0A0A] font-bold mb-6">Order Pipeline</h3>
        {s?.totalOrders === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <ShoppingBag size={32} className="text-[#E8E8E8] mb-3" />
            <p className="font-body text-[14px] text-[#999]">No orders yet. They'll appear here when customers start shopping.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between overflow-x-auto admin-scrollbar pb-2">
              {pipeline.map((p, i) => (
                <React.Fragment key={p.id}>
                  <div 
                    onClick={() => navigate(`/admin/orders?status=${p.id}`)}
                    className="flex flex-col items-center px-4 py-2 hover:bg-[#F8F8F6] rounded-lg cursor-pointer transition-colors"
                  >
                    <p className="font-mono text-[28px] text-[#0A0A0A] font-bold">{p.count}</p>
                    <p className="font-body text-[12px] text-[#999999] uppercase tracking-[0.08em] font-medium mt-1">{p.label}</p>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ background: p.color }} />
                  </div>
                  {i < pipeline.length - 1 && <ChevronRight size={16} className="text-[#CCCCCC] shrink-0" />}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
              <div className="w-full flex h-[6px] rounded-full overflow-hidden mb-3">
                {pipeline.map(p => p.count > 0 && (
                  <div key={p.id} style={{ width: `${(p.count / pipelineTotal) * 100}%`, background: p.color }} className="h-full border-r border-white last:border-0" />
                ))}
              </div>
              <p className="font-body text-[13px] text-[#999999]">
                Cancelled: {s?.cancelledOrders || 0} · Returned: {s?.returnedOrders || 0}
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* ROW 4: CHARTS */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-[3]">
          <SalesChart />
        </div>
        <div className="flex-[2]">
          <OrderStatusPie />
        </div>
      </div>

      {/* ROW 5: PAYMENT OVERVIEW */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white border border-[#E8E8E8] rounded-xl p-7">
        <h3 className="font-heading text-[20px] text-[#0A0A0A] font-bold mb-6">Payment Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-mono text-[32px] text-[#0A0A0A] font-bold">₹{(s?.totalRevenue || 0).toLocaleString('en-IN')}</p>
              <p className="font-body text-[14px] text-[#999999] mt-1">Total Collected</p>
              <p className="font-body text-[13px] text-[#555555] mt-1">From {s?.deliveredOrders || 0} delivered orders</p>
            </div>
          </div>
          <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#F0F0F0] pt-6 md:pt-0 md:pl-6">
            <div>
              <p className="font-mono text-[32px] text-[#F59E0B] font-bold">₹{(s?.pendingPayment || 0).toLocaleString('en-IN')}</p>
              <p className="font-body text-[14px] text-[#999999] mt-1">Pending (COD)</p>
              <p className="font-body text-[13px] text-[#555555] mt-1">{s?.pendingPaymentOrders || 0} orders awaiting delivery</p>
            </div>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-[#F0F0F0] pt-6 md:pt-0 md:pl-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="font-heading text-[12px] text-[#999999] uppercase text-left font-medium pb-2">Method</th>
                  <th className="font-heading text-[12px] text-[#999999] uppercase text-right font-medium pb-2">Orders</th>
                  <th className="font-heading text-[12px] text-[#999999] uppercase text-right font-medium pb-2">Amount</th>
                </tr>
              </thead>
              <tbody className="font-body text-[13px]">
                {(s?.paymentMethodData || []).length === 0 ? (
                  <tr><td colSpan={3} className="py-4 text-center text-[#999]">No payment data yet</td></tr>
                ) : (
                  s.paymentMethodData.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}>
                      <td className="py-2 px-2 text-[#0A0A0A]">{row.method}</td>
                      <td className="py-2 px-2 text-right text-[#555555] font-mono">{row.count}</td>
                      <td className="py-2 px-2 text-right text-[#0A0A0A] font-mono">₹{(row.amount || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ROW 6: RECENT ORDERS */}
      <RecentOrders />

      {/* ROW 7: TOP PRODUCTS & RECENT USERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopProducts />
        <RecentUsers />
      </div>

      {/* ROW 8: ALERTS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white border border-[#E8E8E8] rounded-xl p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-[20px] text-[#0A0A0A] font-bold">Inventory Alerts</h3>
            {(outOfStockProducts.length > 0 || lowStockProducts.length > 0) && (
              <p className="font-body text-[13px] text-[#F59E0B] mt-1 flex items-center gap-1">
                <AlertTriangle size={14} /> {outOfStockProducts.length + lowStockProducts.length} items need attention
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-4 max-h-[300px] overflow-y-auto admin-scrollbar pr-2">
          {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#D1FAE5] text-[#10B981] flex items-center justify-center mb-3">✓</div>
              <p className="font-body text-[14px] text-[#10B981] font-medium">
                {products.length === 0 ? 'No products added yet' : 'All products well stocked'}
              </p>
            </div>
          ) : (
            [...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((p, i) => (
              <div key={i} className="flex items-center justify-between border-b border-[#F0F0F0] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0] || p.image || ''} className="w-8 h-8 rounded bg-[#F5F5F3] object-cover" alt="" />
                  <p className="font-body text-[14px] text-[#0A0A0A] truncate max-w-[150px] sm:max-w-[200px]">{p.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  {p.stock === 0 ? (
                    <span className="bg-[#FEE2E2] text-[#991B1B] text-[10px] uppercase font-bold px-2 py-1 rounded">Out of Stock</span>
                  ) : (
                    <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] uppercase font-bold px-2 py-1 rounded">Only {p.stock} left</span>
                  )}
                  <button onClick={() => navigate(`/admin/products/edit/${p.id}`)} className="font-body text-[13px] text-[#58A6FF] hover:underline">
                    Update →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
