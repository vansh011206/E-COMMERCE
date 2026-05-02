import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

const LiveOrderPopup = () => {
  const navigate = useNavigate();
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [popups, setPopups] = useState([]);
  const refreshData = useAdminStore((s) => s.refreshData);

  useEffect(() => {
    const initialOrders = JSON.parse(localStorage.getItem('all-orders') || '[]');
    setLastOrderCount(initialOrders.length);

    const interval = setInterval(() => {
      const currentOrders = JSON.parse(localStorage.getItem('all-orders') || '[]');
      if (currentOrders.length > lastOrderCount) {
        const newOnes = currentOrders.slice(0, currentOrders.length - lastOrderCount);
        
        // Add to popup queue
        setPopups((prev) => {
          const newPopups = [...newOnes.map(o => ({ ...o, popupId: Math.random().toString() })), ...prev];
          return newPopups;
        });
        
        setLastOrderCount(currentOrders.length);
        refreshData();
        
        // Play subtle sound (optional, wrapping in try/catch to avoid autoplay policies)
        try {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch (e) {}
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastOrderCount, refreshData]);

  // Auto-dismiss logic
  useEffect(() => {
    if (popups.length > 0) {
      const timers = popups.map((p) =>
        setTimeout(() => {
          removePopup(p.popupId);
        }, 8000)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [popups]);

  const removePopup = (id) => {
    setPopups((prev) => prev.filter((p) => p.popupId !== id));
  };

  const visiblePopups = popups.slice(0, 3); // Max 3 visible at once

  return (
    <>
      {visiblePopups.map((order, index) => (
        <div
          key={order.popupId}
          className="fixed right-6 bg-[#FFFFFF] border border-[#E8E8E8] border-l-[4px] border-l-[#FF3C78] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-5 z-[9999] transition-all duration-300 w-[380px] animate-popup-enter"
          style={{ bottom: `${24 + index * 140}px` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-[#0A0A0A]" />
              <h4 className="font-heading text-[14px] text-[#0A0A0A] font-medium tracking-wider">NEW ORDER RECEIVED</h4>
            </div>
            <button onClick={() => removePopup(order.popupId)} className="text-[#999999] hover:text-[#0A0A0A] transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="font-mono text-[14px] text-[#FF3C78] font-bold">{order.orderId}</p>
            <p className="font-body text-[13px] text-[#555555] truncate">{order.userName} · {order.userEmail}</p>
          </div>
          
          <div className="mb-4">
            <p className="font-mono text-[14px] text-[#0A0A0A]">
              {order.items?.length || 0} items · ₹{(order.total || 0).toLocaleString('en-IN')}
            </p>
            <p className="font-body text-[13px] text-[#555555]">Payment: {order.paymentMethod?.toUpperCase()}</p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                removePopup(order.popupId);
                navigate(`/admin/orders/${order.orderId}`);
              }}
              className="bg-[#0A0A0A] hover:bg-[#333333] text-white h-9 px-4 rounded-lg font-body text-[12px] uppercase tracking-wider transition-colors"
            >
              View Order
            </button>
            <span className="font-body text-[12px] text-[#999999]">Just now</span>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes popup-enter {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default LiveOrderPopup;
