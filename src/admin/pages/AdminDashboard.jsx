import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, ShoppingBag, Clock, Users, RefreshCw, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import OrderStatusPie from '../components/OrderStatusPie';
import RecentOrders from '../components/RecentOrders';
import TopProducts from '../components/TopProducts';
import RecentUsers from '../components/RecentUsers';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { initializeData, refreshData, dashboardStats: s, products } = useAdminStore();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [period, setPeriod] = useState('30 Days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    initializeData();
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 sec auto refresh
    return () => clearInterval(interval);
  }, [initializeData, refreshData]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Order Pipeline Stats
  const pipeline = [
    { id: 'pending', label: 'Pending', count: s?.pendingOrders || 0, color: '#F59E0B' },
    { id: 'confirmed', label: 'Confirmed', count: s?.orderStatusData?.find(d => d.name.toLowerCase() === 'confirmed')?.value || 0, color: '#3B82F6' },
    { id: 'packed', label: 'Packed', count: s?.orderStatusData?.find(d => d.name.toLowerCase() === 'packed')?.value || 0, color: '#8B5CF6' },
    { id: 'dispatched', label: 'Dispatched', count: s?.orderStatusData?.find(d => d.name.toLowerCase() === 'dispatched')?.value || 0, color: '#F97316' },
    { id: 'shipped', label: 'Shipped', count: s?.orderStatusData?.find(d => d.name.toLowerCase() === 'shipped')?.value || 0, color: '#06B6D4' },
    { id: 'out for delivery', label: 'OFD', count: s?.orderStatusData?.find(d => d.name.toLowerCase() === 'out for delivery')?.value || 0, color: '#10B981' },
    { id: 'delivered', label: 'Delivered', count: s?.orderStatusData?.find(d => d.name.toLowerCase() === 'delivered')?.value || 0, color: '#10B981' }
  ];
  const pipelineTotal = pipeline.reduce((sum, p) => sum + p.count, 0) || 1;

  // Hourly Activity Mock Data (or compute from orders)
  const hourlyData = Array.from({ length: 24 }).map((_, i) => ({
    hour: i,
    orders: Math.floor(Math.random() * (i > 8 && i < 22 ? 8 : 2))
  }));
  const currentHour = new Date().getHours();

  // Stock Alerts
  const lowStockProducts = (products || []).filter(p => p.stock < 10);
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
          <p className="font-body text-[15px] text-[#999999] mt-1">Here's what's happening with your store.</p>
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
          index={0} title="Total Revenue" value={s?.totalRevenue || 0} isCurrency change={12.5} changeType="up" icon={IndianRupee}
          bottomContent={<p className="font-mono text-[14px] text-[#0A0A0A]">₹28,400 today <span className="mx-2 text-[#E8E8E8]">•</span> <span className="text-[#555555]">₹1,82,350 this month</span></p>}
        />
        <StatsCard 
          index={1} title="Total Orders" value={s?.totalOrders || 0} change={8.2} changeType="up" icon={ShoppingBag}
          bottomContent={<p className="font-mono text-[14px] text-[#0A0A0A]">12 today <span className="mx-2 text-[#E8E8E8]">•</span> <span className="text-[#555555]">142 this month</span></p>}
        />
        <StatsCard 
          index={2} title="Pending Payments" value={124800} isCurrency change={-2.4} changeType="down" icon={Clock}
          bottomContent={
            <div>
              <p className="font-body text-[13px] text-[#F59E0B] mb-1">From 38 COD orders {124800 > 50000 && '⚠️'}</p>
              <p className="font-mono text-[14px] text-[#555555]">Online: ₹3,57,550 <span className="mx-2 text-[#E8E8E8]">•</span> COD: ₹1,24,800</p>
            </div>
          }
        />
        <StatsCard 
          index={3} title="Registered Users" value={s?.totalUsers || 0} change={23} changeType="up" icon={Users}
          bottomContent={<p className="font-mono text-[14px] text-[#0A0A0A]">8 new today <span className="mx-2 text-[#E8E8E8]">•</span> <span className="text-[#555555]">45 this month</span></p>}
        />
      </div>

      {/* ROW 3: ORDER PIPELINE */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-white border border-[#E8E8E8] rounded-xl p-7"
      >
        <h3 className="font-heading text-[20px] text-[#0A0A0A] font-bold mb-6">Order Pipeline</h3>
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
            Cancelled: {s?.orderStatusData?.find(d => d.name.toLowerCase() === 'cancelled')?.value || 0} · 
            Returned: {s?.orderStatusData?.find(d => d.name.toLowerCase() === 'returned')?.value || 0}
          </p>
        </div>
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
              <p className="font-mono text-[32px] text-[#0A0A0A] font-bold">₹3,57,550</p>
              <p className="font-body text-[14px] text-[#999999] mt-1">Total Collected</p>
              <p className="font-body text-[13px] text-[#555555] mt-1">From 124 delivered orders</p>
            </div>
            <div className="flex items-center gap-1.5 mt-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <p className="font-body text-[12px] text-[#10B981]">Payment received</p>
            </div>
          </div>
          <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#F0F0F0] pt-6 md:pt-0 md:pl-6">
            <div>
              <p className="font-mono text-[32px] text-[#F59E0B] font-bold">₹1,24,800</p>
              <p className="font-body text-[14px] text-[#999999] mt-1">Pending (COD)</p>
              <p className="font-body text-[13px] text-[#555555] mt-1">38 orders awaiting delivery</p>
            </div>
            <div className="flex items-center gap-1.5 mt-6">
              <span className="text-[12px]">⚠️</span>
              <p className="font-body text-[12px] text-[#F59E0B]">Awaiting delivery for collection</p>
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
                {[
                  { m: 'UPI', o: 142, a: 182400 },
                  { m: 'Credit/Debit', o: 86, a: 124350 },
                  { m: 'COD (Collected)', o: 64, a: 50800 },
                  { m: 'COD (Pending)', o: 38, a: 124800 },
                  { m: 'Wallet', o: 12, a: 8200 }
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}>
                    <td className="py-2 px-2 text-[#0A0A0A]">{row.m}</td>
                    <td className="py-2 px-2 text-right text-[#555555] font-mono">{row.o}</td>
                    <td className="py-2 px-2 text-right text-[#0A0A0A] font-mono">₹{row.a.toLocaleString()}</td>
                  </tr>
                ))}
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

      {/* ROW 8: ALERTS & HOURLY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                <p className="font-body text-[14px] text-[#10B981] font-medium">All products well stocked</p>
              </div>
            ) : (
              [...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((p, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[#F0F0F0] pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0] || p.image} className="w-8 h-8 rounded bg-[#F5F5F3] object-cover" alt="" />
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white border border-[#E8E8E8] rounded-xl p-7">
          <h3 className="font-heading text-[20px] text-[#0A0A0A] font-bold mb-6">Today's Activity</h3>
          <div className="h-[140px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 11, fill: '#999', fontFamily: 'Outfit' }} 
                  axisLine={false} tickLine={false}
                  tickFormatter={(h) => h % 4 === 0 ? (h === 0 ? '12AM' : h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h-12}PM`) : ''}
                />
                <Tooltip 
                  cursor={{ fill: '#FAFAFA' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-[#E8E8E8] rounded shadow-sm px-2 py-1">
                          <p className="font-body text-[12px] text-[#0A0A0A]">{payload[0].value} orders at {payload[0].payload.hour}:00</p>
                        </div>
                      )
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="orders" 
                  radius={[2, 2, 0, 0]} 
                  shape={(props) => {
                    const { fill, x, y, width, height, payload } = props;
                    return <rect x={x} y={y} width={width} height={height} fill={payload.hour === currentHour ? '#FF3C78' : (payload.orders === 0 ? '#E8E8E8' : '#0A0A0A')} rx={2} ry={2} />;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="font-body text-[13px] text-[#999999] text-center">Peak: 2PM (12 orders) · Average: 3.5/hr</p>
        </motion.div>
      </div>

    </div>
  );
};

export default AdminDashboard;
