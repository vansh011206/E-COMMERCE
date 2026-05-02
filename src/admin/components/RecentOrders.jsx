import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAdminStore } from '../store/adminStore';
import StatusBadge from './StatusBadge';

const RecentOrders = () => {
  const navigate = useNavigate();
  const { dashboardStats } = useAdminStore();
  const orders = dashboardStats.recentOrders || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-[#FFFFFF] border border-[#E8E8E8] rounded-[14px] w-full"
    >
      <div className="flex items-center justify-between px-7 py-6">
        <h3 className="font-heading text-[20px] text-[#0A0A0A] font-bold">Recent Orders</h3>
        <button onClick={() => navigate('/admin/orders')} className="font-body text-[13px] text-[#FF3C78] hover:underline font-medium">
          View all orders →
        </button>
      </div>

      <div className="overflow-x-auto admin-scrollbar pb-2">
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr className="bg-[#F8F8F6] border-b-[2px] border-[#E8E8E8]">
              <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium rounded-tl-lg">Order ID</th>
              <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Customer</th>
              <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Items</th>
              <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Amount</th>
              <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Payment</th>
              <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Status</th>
              <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Date</th>
              <th className="px-6 py-[14px] text-right font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 8).map((order) => {
              const d = new Date(order.createdAt || Date.now());
              return (
                <tr
                  key={order.orderId}
                  onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                  className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors cursor-pointer group last:border-0"
                  style={{ minHeight: '72px' }}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-[14px] text-[#0A0A0A] font-semibold group-hover:text-[#FF3C78] transition-colors">
                      {order.orderId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[28px] h-[28px] rounded-full bg-[#F5F5F3] flex items-center justify-center font-body text-[11px] text-[#555555] shrink-0 font-medium">
                        {order.userName?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0 max-w-[140px]">
                        <p className="font-body text-[14px] text-[#0A0A0A] truncate">{order.userName}</p>
                        <p className="font-body text-[12px] text-[#999999] truncate mt-0.5">{order.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex -space-x-2">
                        {(order.items || []).slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-md overflow-hidden border-[2px] border-white relative bg-[#F5F5F3] shrink-0 shadow-sm z-[3] group-hover:z-[4]">
                            {item.product?.image && <img src={item.product.image} alt="" className="w-full h-full object-cover" />}
                            {idx === 2 && (order.items?.length || 0) > 3 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="font-mono text-[10px] text-white font-medium">+{order.items.length - 3}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="font-body text-[12px] text-[#999999]">{(order.items || []).reduce((s,i)=>s+i.quantity,0)} items</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-[15px] text-[#0A0A0A] font-semibold">₹{(order.total || 0).toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {order.paymentMethod === 'cod' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      )}
                      <p className="font-body text-[13px] text-[#555555] uppercase">{order.paymentMethod || 'UPI'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-body text-[13px] text-[#999999] whitespace-nowrap">{format(d, "dd MMM, h:mm a")}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="font-body text-[13px] text-[#555555] hover:text-[#0A0A0A] hover:underline font-medium">
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {orders.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <p className="font-body text-[13px] text-[#999999]">No recent orders found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentOrders;
