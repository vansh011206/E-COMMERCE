import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useAdminStore } from '../store/adminStore';
import StatusBadge from '../components/StatusBadge';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, initializeData } = useAdminStore();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const statuses = ['All', 'Pending', 'Confirmed', 'Packed', 'Dispatched', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

  const filteredOrders = orders.filter(o => {
    const searchMatch = 
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();
    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const exportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Items Count', 'Total Amount', 'Payment Method', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(o => [
        o.orderId,
        `"${o.userName}"`,
        o.userEmail,
        o.items?.length || 0,
        o.total || 0,
        o.paymentMethod || 'upi',
        o.status,
        `"${format(new Date(o.createdAt || Date.now()), "yyyy-MM-dd HH:mm:ss")}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_export_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-[32px] text-[#0A0A0A] font-bold">Orders</h1>
          <p className="font-body text-[15px] text-[#999999] mt-1">Manage and track customer orders.</p>
        </div>
        <button
          onClick={exportCSV}
          className="h-[44px] px-6 bg-white border border-[#E8E8E8] hover:border-[#0A0A0A] text-[#0A0A0A] rounded-lg font-heading text-[14px] uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden mb-6">
        <div className="p-6 border-b border-[#E8E8E8] flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {statuses.slice(0, 6).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-4 py-2 rounded-full font-body text-[13px] transition-colors border ${statusFilter === s ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-[#F5F5F3] text-[#555555] border-transparent hover:bg-[#E8E8E8]'}`}
              >
                {s}
              </button>
            ))}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className={`appearance-none px-4 py-2 rounded-full font-body text-[13px] transition-colors border outline-none pr-8 cursor-pointer ${statuses.slice(6).includes(statusFilter) ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-[#F5F5F3] text-[#555555] border-transparent hover:bg-[#E8E8E8]'}`}
              >
                <option value="More" disabled hidden>More Status</option>
                {statuses.slice(6).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Filter size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${statuses.slice(6).includes(statusFilter) ? 'text-white' : 'text-[#555555]'}`} />
            </div>
          </div>
          
          <div className="relative max-w-[300px] shrink-0">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Search by ID, Name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full h-[40px] pl-11 pr-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto admin-scrollbar pb-2">
          <table className="w-full border-collapse border-spacing-0">
            <thead>
              <tr className="bg-[#F8F8F6] border-b-[2px] border-[#E8E8E8]">
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Order ID</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Customer</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Items</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Amount</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Payment</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Status</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Date</th>
                <th className="px-6 py-[14px] text-right font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => {
                const d = new Date(order.createdAt || Date.now());
                return (
                  <tr
                    key={order.orderId}
                    onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                    className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
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
                              {(item.product?.images?.[0] || item.product?.image || item.image) && <img src={item.product?.images?.[0] || item.product?.image || item.image} alt="" className="w-full h-full object-cover" />}
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
                      <p className="font-body text-[13px] text-[#999999] whitespace-nowrap">{format(d, "dd MMM, yyyy")}</p>
                      <p className="font-body text-[12px] text-[#CCCCCC] whitespace-nowrap mt-0.5">{format(d, "h:mm a")}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="font-body text-[13px] text-[#555555] hover:text-[#0A0A0A] hover:underline font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-[#999999] font-body text-[14px]">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#E8E8E8] flex justify-center gap-2 bg-[#F8F8F6]">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg font-body text-[13px] flex items-center justify-center transition-colors ${page === i + 1 ? 'bg-[#0A0A0A] text-white' : 'bg-white border border-[#E8E8E8] text-[#555555] hover:border-[#0A0A0A]'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
