import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import socket from '../../socket';

const LiveOrderPopup = () => {
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const refreshData = useAdminStore((s) => s.refreshData);

  useEffect(() => {
    const handleNewOrder = (order) => {
      setPopups((prev) => {
        const newPopup = { ...order, popupId: Math.random().toString(), startTime: Date.now() };
        return [newPopup, ...prev];
      });
      refreshData();
    };

    socket.on('new_order', handleNewOrder);
    return () => socket.off('new_order', handleNewOrder);
  }, [refreshData]);

  useEffect(() => {
    if (popups.length > 0) {
      const interval = setInterval(() => {
        setPopups((prev) =>
          prev.filter(p => hoveredId === p.popupId || Date.now() - p.startTime < 6000)
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [popups, hoveredId]);

  const removePopup = (id) => setPopups((prev) => prev.filter((p) => p.popupId !== id));

  const visiblePopups = popups.slice(0, 4);

  return (
    <>
      <style>{`
        .order-popup {
          position: fixed;
          right: 24px;
          width: 360px;
          background: #ffffff;
          border-radius: 14px;
          border: 0.5px solid rgba(0,0,0,0.1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06);
          overflow: hidden;
          z-index: 9999;
          animation: slideInRight 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
          transition: bottom 0.3s cubic-bezier(0.21, 1.02, 0.73, 1), opacity 0.2s, transform 0.2s;
        }

        .order-popup::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: #10B981;
          z-index: 1;
        }

        .order-popup.stale {
          opacity: 0.82;
          transform: scale(0.975);
          transform-origin: bottom right;
        }

        .order-popup.stale::before {
          opacity: 0.45;
        }

        @keyframes slideInRight {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        .order-popup__body {
          padding: 14px 14px 14px 18px;
        }

        .order-popup__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .order-popup__icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #E8F5E9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .order-popup__title {
          font-size: 13px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0;
          line-height: 1.3;
        }

        .order-popup__timestamp {
          font-size: 11px;
          color: #10B981;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .order-popup__timestamp.old {
          color: #999;
        }

        .order-popup__close {
          background: none;
          border: none;
          cursor: pointer;
          color: #BBBBBB;
          padding: 2px;
          display: flex;
          align-items: center;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }

        .order-popup__close:hover {
          color: #0A0A0A;
          background: #F5F5F5;
        }

        .order-popup__details {
          background: #F8F9FA;
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .order-popup__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .order-popup__row:last-child {
          margin-bottom: 0;
        }

        .order-popup__label {
          font-size: 12px;
          color: #888;
        }

        .order-popup__value {
          font-size: 12px;
          font-weight: 500;
          color: #0A0A0A;
        }

        .order-popup__divider {
          height: 0.5px;
          background: rgba(0,0,0,0.07);
          margin: 8px 0;
        }

        .order-popup__badge {
          font-size: 11px;
          background: #E8F5E9;
          color: #0F6E56;
          padding: 2px 9px;
          border-radius: 20px;
          font-weight: 500;
        }

        .order-popup__amount {
          font-size: 15px;
          font-weight: 700;
          color: #0A0A0A;
          font-variant-numeric: tabular-nums;
        }

        .order-popup__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .order-popup__cta {
          font-size: 12px;
          font-weight: 600;
          color: #10B981;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.15s;
        }

        .order-popup__cta:hover {
          gap: 7px;
        }

        .order-popup__dismiss {
          font-size: 11px;
          color: #BBBBBB;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }

        .order-popup__dismiss:hover {
          color: #888;
        }

        .order-popup__progress {
          height: 3px;
          background: #F0F0F0;
          width: 100%;
        }

        .order-popup__progress-fill {
          height: 100%;
          background: #10B981;
          animation: shrink 6s linear forwards;
          transform-origin: left;
        }

        .order-popup__progress-fill.paused {
          animation-play-state: paused;
        }

        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      {visiblePopups.map((order, index) => (
        <div
          key={order.popupId}
          className={`order-popup ${index > 0 ? 'stale' : ''}`}
          style={{ bottom: `${24 + index * 152}px` }}
          onMouseEnter={() => setHoveredId(order.popupId)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="order-popup__body">
            <div className="order-popup__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="order-popup__icon">
                  <ShoppingBag size={15} color="#10B981" strokeWidth={2} />
                </div>
                <div>
                  <p className="order-popup__title">New order received</p>
                  <p className={`order-popup__timestamp ${index > 0 ? 'old' : ''}`}>
                    {index === 0 ? 'Just now' : `${index * 38}s ago`}
                  </p>
                </div>
              </div>
              <button className="order-popup__close" onClick={() => removePopup(order.popupId)}>
                <X size={14} />
              </button>
            </div>

            <div className="order-popup__details">
              <div className="order-popup__row">
                <span className="order-popup__label">Order</span>
                <span className="order-popup__value" style={{ fontFamily: 'monospace' }}>
                  #{order.orderId}
                </span>
              </div>
              <div className="order-popup__row">
                <span className="order-popup__label">Customer</span>
                <span className="order-popup__value">
                  {order.userName || order.shippingAddress?.fullName}
                </span>
              </div>
              <div className="order-popup__divider" />
              <div className="order-popup__row">
                <span className="order-popup__badge">{order.items?.length || 0} items</span>
                <span className="order-popup__amount">
                  ₹{(order.totalPrice || order.total || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="order-popup__footer">
              <button
                className="order-popup__cta"
                onClick={() => {
                  removePopup(order.popupId);
                  navigate(`/admin/orders/${order.orderId}`);
                }}
              >
                View order <ArrowRight size={12} strokeWidth={2.5} />
              </button>
              <button className="order-popup__dismiss" onClick={() => removePopup(order.popupId)}>
                Dismiss
              </button>
            </div>
          </div>

          <div className="order-popup__progress">
            <div
              className={`order-popup__progress-fill ${hoveredId === order.popupId ? 'paused' : ''}`}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default LiveOrderPopup;