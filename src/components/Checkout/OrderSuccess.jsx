import React, { memo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

const OrderSuccess = ({ orderData }) => {
  const { items, clearCart } = useCartStore();
  const { addOrder, user, addresses } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const placeOrder = async () => {
      if (items.length > 0 && orderData) {
        // Find the full address
        const selectedAddress = addresses?.find(a => a.id === orderData.addressId) || {};
        
        const orderPayload = {
          items,
          address: {
            fullName: selectedAddress.fullName || user?.name || 'Guest User',
            phone: selectedAddress.phone || user?.phone || '9999999999',
            addressLine1: selectedAddress.addressLine1 || 'Unknown Address',
            city: selectedAddress.city || 'Unknown City',
            state: selectedAddress.state || 'Unknown State',
            pincode: selectedAddress.pincode || '000000',
            type: selectedAddress.type || 'home'
          },
          paymentMethod: orderData.paymentMethod,
          total: orderData.finalTotal,
          deliveryFee: orderData.paymentMethod === 'cod' ? 49 : 0
        };

        try {
          await addOrder(orderPayload);
          if (isMounted) {
            clearCart();
            toast.success("Order confirmed! Track it in 'My Orders'");
            window.lastOrderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`; // fallback display
          }
        } catch (error) {
          toast.error("Failed to place order.");
        }
      }
    };

    placeOrder();

    return () => { isMounted = false; };
  }, [items, orderData, addOrder, clearCart]);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="relative w-24 h-24 mb-6">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#0A0A0A"
            strokeWidth="3"
            strokeDasharray="283"
            strokeDashoffset="0"
            className="animate-circle-draw origin-center -rotate-90"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center animate-checkmark-pop opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <Check size={36} className="text-[#FF3C78]" strokeWidth={2.5} />
        </div>
      </div>

      <h1 className="font-heading text-[32px] text-[#0A0A0A] font-bold mb-2">Order Placed!</h1>
      <p className="font-body text-[16px] text-[#555] mb-6">Thank you for your purchase</p>
      
      <div className="inline-block bg-[#F8F8F8] px-4 py-2 rounded mb-4">
        <span className="font-mono text-[14px] text-[#0A0A0A] font-bold">
          {window.lastOrderId || '#ORD-XXXXX'}
        </span>
      </div>
      
      <p className="font-body text-[14px] text-[#555] mb-10">
        Estimated delivery: <span className="font-medium text-[#0A0A0A]">{deliveryDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link
          to="/orders"
          className="flex-1 py-3 border border-[#0A0A0A] text-[#0A0A0A] font-body text-[13px] uppercase tracking-[0.1em] font-medium rounded hover:bg-[#F8F8F8] transition-colors text-center"
        >
          View My Orders
        </Link>
        <Link
          to="/"
          className="flex-1 py-3 text-white text-center font-body text-[13px] uppercase tracking-[0.1em] font-medium rounded transition-colors bg-[#0A0A0A] hover:bg-[#333]"
        >
          Continue Shopping
        </Link>
      </div>
      
      <style>{`
        @keyframes circle-draw {
          0% { stroke-dashoffset: 283; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-circle-draw {
          animation: circle-draw 0.4s ease-out forwards;
        }
        @keyframes checkmark-pop {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-checkmark-pop {
          animation: checkmark-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default memo(OrderSuccess);
