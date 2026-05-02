import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';

const AdminTopBar = ({ setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, unreadCount, fetchNotifications, markNotificationRead, markAllRead } = useAdminStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [dateStr, setDateStr] = useState('');

  // Generate page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'Dashboard';
    if (path === '/admin/products') return 'Products';
    if (path === '/admin/products/add') return 'Add Product';
    if (path.includes('/admin/products/edit')) return 'Edit Product';
    if (path === '/admin/orders') return 'Orders';
    if (path.includes('/admin/orders/')) return `Order ${path.split('/').pop()}`;
    if (path === '/admin/users') return 'Users';
    if (path === '/admin/settings') return 'Settings';
    return 'Admin';
  };

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateDate();
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, []);

  // Poll notifications every 10 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAllRead = () => {
    markAllRead();
    setShowNotifs(false);
  };

  const handleNotifClick = (notif) => {
    markNotificationRead(notif._id);
    if (notif.type === 'new_order' && notif.data?.orderId) {
      navigate(`/admin/orders/${notif.data.orderId}`);
    }
    setShowNotifs(false);
  };

  const formatTime = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  return (
    <div className="h-[64px] bg-[#FFFFFF] border-b border-[#E8E8E8] sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#0A0A0A]" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <h1 className="font-heading text-[20px] md:text-[22px] text-[#0A0A0A] font-bold">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCCCCC]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-[40px] w-[240px] pl-10 pr-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-full font-body text-[13px] text-[#0A0A0A] placeholder-[#CCCCCC] outline-none focus:border-[#0A0A0A] transition-colors"
          />
        </div>

        {/* Date */}
        <div className="hidden lg:block font-body text-[13px] text-[#999999]">
          {dateStr}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-[#555555] hover:text-[#0A0A0A] transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#FF3C78] rounded-full flex items-center justify-center">
                <span className="font-mono text-[10px] text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </div>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[48px] w-[320px] md:w-[380px] bg-white border border-[#E8E8E8] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E8]">
                  <h3 className="font-heading text-[16px] text-[#0A0A0A] font-bold">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="font-body text-[12px] text-[#FF3C78] hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto admin-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center font-body text-[13px] text-[#999999]">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 15).map((notif) => (
                      <div
                        key={notif._id}
                        className={`flex gap-3 px-4 py-3 border-b border-[#E8E8E8] last:border-0 hover:bg-[#F8F8F6] cursor-pointer transition-colors ${notif.isRead ? 'bg-white' : 'bg-[#FFF8FA]'}`}
                        onClick={() => handleNotifClick(notif)}
                      >
                        <div className="mt-1.5 shrink-0">
                          {!notif.isRead && <Circle size={8} className="fill-[#FF3C78] text-[#FF3C78]" />}
                        </div>
                        <div>
                          <p className={`font-body text-[14px] text-[#0A0A0A] ${notif.isRead ? '' : 'font-medium'}`}>{notif.title}</p>
                          <p className="font-body text-[13px] text-[#555555] mt-0.5">{notif.message}</p>
                          <p className="font-body text-[12px] text-[#999999] mt-1">{formatTime(notif.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
