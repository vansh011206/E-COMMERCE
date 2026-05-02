import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, CreditCard, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';
import StatusBadge from '../components/StatusBadge';

const AdminOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders, updateOrderStatus, initializeData } = useAdminStore();
  
  const [order, setOrder] = useState(null);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (orders.length > 0) {
      const found = orders.find(o => o.orderId === id);
      if (found) setOrder(found);
    }
  }, [id, orders]);

  if (!order) return <div className="p-8 text-center font-body text-[#999999]">Loading order...</div>;

  const d = new Date(order.createdAt || Date.now());
  const itemsCount = (order.items || []).reduce((s, i) => s + i.quantity, 0);

  const steps = ['Pending', 'Confirmed', 'Packed', 'Dispatched', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = steps.findIndex(s => s.toLowerCase() === order.status.toLowerCase());
  const isCancelled = order.status.toLowerCase() === 'cancelled';
  const isReturned = order.status.toLowerCase() === 'returned';

  const handleStatusUpdate = (newStatus) => {
    updateOrderStatus(order.orderId, newStatus);
    toast.success(`Order marked as ${newStatus}`);
  };

  const getNextStatusOptions = () => {
    if (isCancelled || isReturned || currentStatusIndex === steps.length - 1) return [];
    if (currentStatusIndex === -1) return ['Confirmed', 'Cancelled'];
    return [steps[currentStatusIndex + 1], 'Cancelled'];
  };

  return (
    <div className="w-full max-w-[1000px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/orders')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F5F5F3] text-[#555555] transition-colors shrink-0">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-[32px] text-[#0A0A0A] font-bold">{order.orderId}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="font-body text-[15px] text-[#999999] mt-1">{format(d, "MMM dd, yyyy 'at' h:mm a")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getNextStatusOptions().map(status => (
            <button
              key={status}
              onClick={() => handleStatusUpdate(status)}
              className={`h-[44px] px-6 rounded-lg font-heading text-[13px] uppercase tracking-wider font-bold transition-all ${
                status === 'Cancelled' 
                  ? 'border border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]'
                  : 'bg-[#0A0A0A] hover:bg-[#333333] text-white shadow-md'
              }`}
            >
              Mark as {status}
            </button>
          ))}
        </div>
      </div>

      {/* PIPELINE */}
      {!isCancelled && !isReturned && (
        <div className="bg-white border border-[#E8E8E8] rounded-[14px] p-8 mb-6 overflow-hidden">
          <div className="relative flex justify-between items-center z-10 px-4">
            <div className="absolute left-10 right-10 top-4 h-[3px] bg-[#F5F5F3] -z-10 rounded-full" />
            <div 
              className="absolute left-10 top-4 h-[3px] bg-[#0A0A0A] -z-10 rounded-full transition-all duration-500" 
              style={{ width: `calc(${(Math.max(0, currentStatusIndex) / (steps.length - 1)) * 100}% - 40px)` }} 
            />
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-white ${isCompleted ? 'bg-[#0A0A0A]' : 'bg-[#E8E8E8]'} transition-colors duration-500`}>
                    {isCompleted && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <p className={`mt-3 font-body text-[12px] uppercase tracking-[0.05em] ${isCurrent ? 'text-[#0A0A0A] font-bold' : isCompleted ? 'text-[#0A0A0A] font-medium' : 'text-[#999999]'}`}>{step}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[14px] p-6 mb-6 flex items-center gap-4 text-[#991B1B]">
          <XCircle size={24} />
          <div>
            <h3 className="font-heading text-[16px] font-bold">Order Cancelled</h3>
            <p className="font-body text-[14px]">This order was cancelled and will not be fulfilled.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* ITEMS */}
          <div className="bg-white border border-[#E8E8E8] rounded-[14px] overflow-hidden">
            <div className="p-6 border-b border-[#E8E8E8]">
              <h2 className="font-heading text-[18px] text-[#0A0A0A] font-bold">Items ({itemsCount})</h2>
            </div>
            <div className="p-6">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b border-[#F0F0F0] last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
                  <div className="w-[80px] h-[100px] bg-[#F5F5F3] rounded-lg border border-[#E8E8E8] overflow-hidden shrink-0">
                    {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-body text-[16px] text-[#0A0A0A] font-medium">{item.product?.name || 'Product'}</h3>
                      <p className="font-body text-[13px] text-[#999999] mt-1">Size: <span className="text-[#0A0A0A]">{item.size || 'M'}</span></p>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="font-body text-[14px] text-[#555555]">Qty: {item.quantity}</p>
                      <p className="font-mono text-[16px] text-[#0A0A0A] font-bold">₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#F8F8F6] p-6 border-t border-[#E8E8E8]">
              <div className="flex justify-between items-center mb-2">
                <p className="font-body text-[14px] text-[#555555]">Subtotal</p>
                <p className="font-mono text-[14px] text-[#0A0A0A]">₹{(order.total || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="font-body text-[14px] text-[#555555]">Shipping</p>
                <p className="font-body text-[14px] text-[#10B981]">Free</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#E8E8E8]">
                <p className="font-heading text-[18px] text-[#0A0A0A] font-bold">Total</p>
                <p className="font-mono text-[24px] text-[#0A0A0A] font-bold">₹{(order.total || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* CUSTOMER */}
          <div className="bg-white border border-[#E8E8E8] rounded-[14px] p-6">
            <h2 className="font-heading text-[18px] text-[#0A0A0A] font-bold mb-4 flex items-center gap-2">
              <User size={18} className="text-[#999999]" /> Customer
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[44px] h-[44px] rounded-full bg-[#F5F5F3] flex items-center justify-center font-heading text-[16px] text-[#555555] font-bold">
                {order.userName?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-[15px] text-[#0A0A0A] font-medium truncate">{order.userName}</p>
                <p className="font-body text-[13px] text-[#555555] truncate">{order.userEmail}</p>
              </div>
            </div>
            <p className="font-body text-[13px] text-[#555555]">Phone: {order.shippingAddress?.phone || 'N/A'}</p>
          </div>

          {/* ADDRESS */}
          <div className="bg-white border border-[#E8E8E8] rounded-[14px] p-6">
            <h2 className="font-heading text-[18px] text-[#0A0A0A] font-bold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-[#999999]" /> Shipping Address
            </h2>
            {order.shippingAddress ? (
              <div className="font-body text-[14px] text-[#555555] space-y-1">
                <p className="text-[#0A0A0A] font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              </div>
            ) : (
              <p className="font-body text-[13px] text-[#999999]">No address provided</p>
            )}
          </div>

          {/* PAYMENT */}
          <div className="bg-white border border-[#E8E8E8] rounded-[14px] p-6">
            <h2 className="font-heading text-[18px] text-[#0A0A0A] font-bold mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-[#999999]" /> Payment Info
            </h2>
            <div className="flex items-center justify-between">
              <p className="font-body text-[14px] text-[#555555]">Method</p>
              <p className="font-body text-[14px] text-[#0A0A0A] uppercase font-bold">{order.paymentMethod || 'UPI'}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="font-body text-[14px] text-[#555555]">Status</p>
              {order.paymentMethod === 'cod' ? (
                <span className="font-body text-[12px] text-[#F59E0B] font-medium uppercase tracking-wider">Pending Collection</span>
              ) : (
                <span className="font-body text-[12px] text-[#10B981] font-medium uppercase tracking-wider">Paid</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
