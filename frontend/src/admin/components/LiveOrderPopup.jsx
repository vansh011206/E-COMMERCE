import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, ShoppingBag, Users } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { subscribe } from '../../ably';

const LiveOrderPopup = () => {
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const refreshData = useAdminStore((s) => s.refreshData);

  useEffect(() => {
    const unsub1 = subscribe('admin-notifications', 'new_order', (order) => {
      setPopups((prev) => {
        const newPopup = {
          ...order,
          type: 'order',
          popupId: Math.random().toString(),
          startTime: Date.now(),
        };
        return [newPopup, ...prev];
      });
      refreshData();
    });

    const unsub2 = subscribe('admin-notifications', 'new_notification', (notif) => {
      if (notif.type === 'new_user') {
        setPopups((prev) => {
          const newPopup = {
            orderId: 'NEW_USER',
            userName: notif.data?.userName || 'New User',
            totalPrice: 0,
            items: [],
            type: 'user',
            popupId: Math.random().toString(),
            startTime: Date.now(),
            message: notif.message,
          };
          return [newPopup, ...prev];
        });
      }
      refreshData();
    });

    return () => {
      unsub1();
      unsub2();
    };
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

  const isOrder = (p) => p.type !== 'user';

  return (
    <>
      <style>{`
        .lop-wrap {
          position: fixed;
          right: 24px;
          width: 355px;
          border-radius: 14px;
          overflow: hidden;
          z-index: 9999;
          animation: lopSlideIn 0.35s cubic-bezier(0.21,1.02,0.73,1) forwards;
          transition: bottom 0.3s cubic-bezier(0.21,1.02,0.73,1), opacity 0.2s, transform 0.2s;

          /* Dark card bg — clearly separate from white site bg */
          background: #1e2225;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3);
        }

        .lop-wrap.lop-stale {
          opacity: 0.78;
          transform: scale(0.975);
          transform-origin: bottom right;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.05);
        }

        .lop-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          border-radius: 0;
          z-index: 1;
        }

        .lop-wrap.lop-order::before { background: #10B981; }
        .lop-wrap.lop-user::before  { background: #60a5fa; }
        .lop-wrap.lop-stale::before { opacity: 0.45; }

        @keyframes lopSlideIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        .lop-body { padding: 14px 14px 13px 18px; }

        .lop-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 11px;
        }

        .lop-icon {
          width: 34px; height: 34px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .lop-icon.lop-icon--order { background: rgba(16,185,129,0.15); }
        .lop-icon.lop-icon--user  { background: rgba(96,165,250,0.12); }

        .lop-title {
          font-size: 13px;
          font-weight: 600;
          color: #f0f0f0;
          margin: 0; line-height: 1.3;
        }

        .lop-ts {
          font-size: 11px;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0.01em;
        }
        .lop-ts--fresh { color: #10B981; }
        .lop-ts--old   { color: #555; }
        .lop-ts--user-fresh { color: #60a5fa; }

        .lop-close {
          background: none; border: none;
          cursor: pointer; padding: 3px;
          color: #555;
          display: flex; align-items: center;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .lop-close:hover { color: #ccc; background: rgba(255,255,255,0.06); }

        .lop-details {
          background: #14171a;
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .lop-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .lop-row:last-child { margin-bottom: 0; }

        .lop-lbl  { font-size: 11.5px; color: #666; }
        .lop-val  { font-size: 11.5px; font-weight: 500; color: #d0d0d0; }
        .lop-mono { font-family: monospace; font-weight: 600; color: #d0d0d0; }

        .lop-divider {
          height: 0.5px;
          background: rgba(255,255,255,0.07);
          margin: 8px 0;
        }

        .lop-badge {
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 20px;
          font-weight: 500;
        }
        .lop-badge--order { background: rgba(16,185,129,0.15); color: #34d399; }

        .lop-amount {
          font-size: 15px;
          font-weight: 700;
          color: #f0f0f0;
          font-family: monospace;
        }

        .lop-message {
          font-size: 12px;
          color: #888;
          margin: 0;
          line-height: 1.5;
        }

        .lop-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lop-cta {
          font-size: 12px; font-weight: 600;
          background: none; border: none;
          cursor: pointer; padding: 0;
          display: flex; align-items: center; gap: 5px;
          transition: gap 0.15s;
        }
        .lop-cta:hover { gap: 8px; }
        .lop-cta--order { color: #10B981; }
        .lop-cta--user  { color: #60a5fa; }

        .lop-dismiss {
          font-size: 11px; color: #444;
          background: none; border: none;
          cursor: pointer; padding: 0;
          transition: color 0.15s;
        }
        .lop-dismiss:hover { color: #888; }

        .lop-progress { height: 3px; background: #111; }

        .lop-progress-fill {
          height: 100%;
          animation: lopShrink 6s linear forwards;
          border-radius: 0 2px 2px 0;
        }
        .lop-progress-fill--order { background: #10B981; }
        .lop-progress-fill--user  { background: #60a5fa; opacity: 0.7; }
        .lop-progress-fill.paused { animation-play-state: paused; }

        @keyframes lopShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      {visiblePopups.map((popup, index) => {
        const isOrderType = isOrder(popup);
        const isFresh = index === 0;

        return (
          <div
            key={popup.popupId}
            className={[
              'lop-wrap',
              isOrderType ? 'lop-order' : 'lop-user',
              index > 0 ? 'lop-stale' : '',
            ].join(' ')}
            style={{ bottom: `${24 + index * 152}px` }}
            onMouseEnter={() => setHoveredId(popup.popupId)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="lop-body">
              <div className="lop-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={`lop-icon lop-icon--${isOrderType ? 'order' : 'user'}`}>
                    {isOrderType ? (
                      <ShoppingBag size={15} color="#10B981" strokeWidth={2} />
                    ) : (
                      <Users size={15} color="#60a5fa" strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <p className="lop-title">
                      {isOrderType ? 'New order received' : 'New user registered'}
                    </p>
                    <p className={`lop-ts ${isFresh ? (isOrderType ? 'lop-ts--fresh' : 'lop-ts--user-fresh') : 'lop-ts--old'}`}>
                      {isFresh ? 'Just now' : `${index * 38}s ago`}
                    </p>
                  </div>
                </div>
                <button className="lop-close" onClick={() => removePopup(popup.popupId)}>
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>

              <div className="lop-details">
                {isOrderType ? (
                  <>
                    <div className="lop-row">
                      <span className="lop-lbl">Order</span>
                      <span className="lop-mono">#{popup.orderId}</span>
                    </div>
                    <div className="lop-row">
                      <span className="lop-lbl">Customer</span>
                      <span className="lop-val">
                        {popup.userName || popup.shippingAddress?.fullName}
                      </span>
                    </div>
                    <div className="lop-divider" />
                    <div className="lop-row">
                      <span className="lop-badge lop-badge--order">
                        {popup.items?.length || 0} items
                      </span>
                      <span className="lop-amount">
                        ₹{(popup.totalPrice || popup.total || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="lop-message">{popup.message}</p>
                )}
              </div>

              <div className="lop-footer">
                <button
                  className={`lop-cta lop-cta--${isOrderType ? 'order' : 'user'}`}
                  onClick={() => {
                    removePopup(popup.popupId);
                    isOrderType
                      ? navigate(`/admin/orders/${popup.orderId}`)
                      : navigate('/admin/users');
                  }}
                >
                  {isOrderType ? 'View order' : 'View users'}
                  <ArrowRight size={11} strokeWidth={2.5} />
                </button>
                <button className="lop-dismiss" onClick={() => removePopup(popup.popupId)}>
                  Dismiss
                </button>
              </div>
            </div>

            <div className="lop-progress">
              <div
                className={`lop-progress-fill lop-progress-fill--${isOrderType ? 'order' : 'user'} ${hoveredId === popup.popupId ? 'paused' : ''}`}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default LiveOrderPopup;