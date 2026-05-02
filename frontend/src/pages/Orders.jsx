import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import Footer from '../components/Layout/Footer';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const { addToCart } = useCartStore();

  const handleReorder = () => {
    order.items.forEach(item => {
      addToCart({ id: item.customId, name: item.name, price: item.price, images: [item.image] }, item.selectedSize || 'M', null, item.quantity);
    });
    toast.success('Items added to bag');
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'bg-[#E8F5E9] text-[#00A86B]';
      case 'SHIPPED': return 'bg-[#E3F2FD] text-[#1565C0]';
      case 'PROCESSING': return 'bg-[#FFF3E0] text-[#E65100]';
      case 'CANCELLED': return 'bg-[#FFEBEE] text-[#C62828]';
      default: return 'bg-[#F5F5F5] text-[#555]';
    }
  };

  const steps = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Shipped', 'Delivered'];
  const currentStepIdx = steps.findIndex(s => s.toUpperCase() === (order.status || 'Pending').toUpperCase());
  const activeIdx = currentStepIdx === -1 ? 0 : currentStepIdx;

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-mono text-[13px] text-[#0A0A0A] font-semibold">Order {order.orderId}</h3>
          <p className="font-body text-[12px] text-[#999] mt-0.5">Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
        <div className={`px-3 py-1 rounded-full font-heading text-[11px] font-bold uppercase tracking-wider ${getStatusColor(order.status || 'Pending')}`}>
          {order.status || 'Pending'}
        </div>
      </div>

      {/* Main Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {(order.items || []).slice(0, 3).map((item, idx) => (
              <div key={idx} className="w-10 h-[52px] rounded-sm overflow-hidden border-2 border-white relative bg-[#F8F8F6]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {idx === 2 && order.items.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="font-body text-[10px] text-white font-medium">+{order.items.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <p className="font-body text-[13px] text-[#555] line-clamp-1">
              {order.items && order.items.length > 0 ? `${order.items[0].name} × ${order.items[0].quantity}` : 'No items'}
            </p>
            {order.items && order.items.length > 1 && (
              <p className="font-body text-[12px] text-[#999]">and {order.items.length - 1} more items</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[14px] text-[#0A0A0A] font-bold">₹{(order.totalPrice || order.total || 0).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Stepper */}
      {(order.status || 'Pending').toUpperCase() !== 'CANCELLED' && (
        <div className="relative flex justify-between mb-6 px-2 mt-4">
          <div className="absolute left-4 right-4 top-2 h-[2px] bg-[#E8E8E8] -z-10" />
          <div className="absolute left-4 top-2 h-[2px] bg-[#10B981] -z-10 transition-all duration-500" style={{ width: `calc(${(activeIdx / (steps.length - 1)) * 100}% - 16px)` }} />
          
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIdx;
            const isCurrent = idx === activeIdx;
            return (
              <div key={step} className="flex flex-col items-center gap-2 bg-white px-1">
                <div className={`relative w-4 h-4 rounded-full flex items-center justify-center ${isCompleted ? 'bg-[#10B981]' : isCurrent ? 'bg-[#3B82F6]' : 'bg-[#E8E8E8]'}`}>
                  {isCompleted && <span className="text-white text-[10px] font-bold">✓</span>}
                  {isCurrent && <div className="absolute -inset-1 border border-[#3B82F6] rounded-full animate-ping opacity-30" />}
                </div>
                <span className={`font-body text-[10px] sm:text-[11px] ${isCurrent ? 'text-[#3B82F6] font-bold' : isCompleted ? 'text-[#10B981] font-medium' : 'text-[#999]'}`}>{step}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-[#E8E8E8]">
        <button onClick={handleReorder} className="flex-1 py-2 border border-[#E8E8E8] rounded font-body text-[13px] text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors">
          REORDER
        </button>
        <button onClick={() => setExpanded(!expanded)} className="flex-1 py-2 border border-[#E8E8E8] rounded font-body text-[13px] text-[#0A0A0A] flex items-center justify-center gap-1 hover:border-[#0A0A0A] transition-colors">
          VIEW DETAILS <ChevronDown size={14} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-4 mt-4 border-t border-dashed border-[#E8E8E8] space-y-4">
              <h4 className="font-heading text-[14px] text-[#0A0A0A] font-medium uppercase tracking-wider">Items</h4>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-12 h-16 bg-[#F8F8F6] rounded overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-[13px] text-[#0A0A0A]">{item.name}</p>
                    <p className="font-body text-[12px] text-[#999] mt-0.5">Size: {item.selectedSize || 'M'} | Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8E8E8]">
                <div>
                  <h4 className="font-heading text-[12px] text-[#999] uppercase tracking-wider mb-1">Payment Method</h4>
                  <p className="font-body text-[13px] text-[#0A0A0A] capitalize">{order.paymentMethod || 'Credit Card'}</p>
                </div>
                <div className="text-right">
                  <button className="inline-flex items-center gap-1 font-body text-[13px] text-[#FF3C78] hover:underline">
                    <Download size={14} /> Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Orders = () => {
  const { isAuthenticated, orders, fetchMyOrders } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
      
      // Real-time updates for user orders
      import('../socket').then(({ default: socket }) => {
        socket.connect();
        
        const handleOrderUpdate = () => {
          fetchMyOrders();
        };
        
        socket.on('user_order_updated', handleOrderUpdate);
        
        return () => {
          socket.off('user_order_updated', handleOrderUpdate);
        };
      });
    }
  }, [isAuthenticated, fetchMyOrders]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center text-center px-6">
        <Package size={64} className="text-[#CCCCCC] mb-4" strokeWidth={1} />
        <h2 className="font-heading text-[24px] text-[#0A0A0A] mb-2">Sign in to view orders</h2>
        <p className="font-body text-[14px] text-[#999] mb-8">Access your order history and track deliveries.</p>
        <Link to="/login" className="bg-[#0A0A0A] text-white px-10 py-3.5 font-heading text-[14px] uppercase tracking-[0.1em] rounded-lg hover:bg-[#333] transition-colors">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="font-heading text-[24px] text-[#0A0A0A] font-bold uppercase tracking-wider mb-6">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E8E8] py-16 flex flex-col items-center justify-center text-center">
            <Package size={64} className="text-[#CCCCCC] mb-4" strokeWidth={1} />
            <h2 className="font-heading text-[20px] text-[#0A0A0A] mb-2">No orders yet</h2>
            <p className="font-body text-[14px] text-[#999] mb-8">When you place an order, it will appear here</p>
            <Link to="/shop" className="bg-white border border-[#E8E8E8] text-[#0A0A0A] px-8 py-3 font-body text-[13px] uppercase tracking-wider font-medium rounded hover:border-[#0A0A0A] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <OrderCard key={order._id || order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default memo(Orders);
