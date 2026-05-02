import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Package, Plus, ShoppingBag, Users, Settings, LogOut, X } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

const NavGroup = ({ label, children }) => (
  <div className="mb-6">
    <p className="font-body text-[10px] uppercase text-[#999999] tracking-[0.12em] px-3 mb-2 font-semibold">
      {label}
    </p>
    <div className="space-y-0.5">
      {children}
    </div>
  </div>
);

const NavItem = ({ to, icon: Icon, label, badge, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `
        relative flex items-center h-[42px] px-3 rounded-lg font-body text-[14px] transition-all duration-150
        ${isActive ? 'text-[#0A0A0A] bg-[#FFFFFF] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.06)]' : 'text-[#555555] font-medium hover:text-[#0A0A0A] hover:bg-[#EFEFED]'}
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#FF3C78] rounded-r-[3px]" />
          )}
          <Icon size={18} className="mr-[10px]" strokeWidth={isActive ? 2.5 : 2} />
          <span className="flex-1 text-left">{label}</span>
          {badge > 0 && (
            <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-[#FF3C78] text-white font-mono text-[11px] font-semibold px-1.5 ml-2">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

const AdminSidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();
  const { dashboardStats, adminLogout } = useAdminStore();
  const pendingOrders = dashboardStats?.pendingOrders || 0;

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[240px] bg-[#F8F8F6] border-r border-[#E8E8E8] flex flex-col transition-transform duration-300 z-50 overflow-y-auto admin-scrollbar
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="p-5 pb-2 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="font-heading text-[16px] text-[#0A0A0A] tracking-[0.1em] font-bold">VOGUEVAULT</h2>
          <span className="ml-2 bg-[#0A0A0A] text-white font-body text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
            Admin
          </span>
        </div>
        <button className="md:hidden text-[#555555]" onClick={() => setMobileMenuOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 px-3 py-6 overflow-y-auto admin-scrollbar">
        <NavGroup label="MAIN">
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" end />
          <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
        </NavGroup>

        <NavGroup label="CATALOG">
          <NavItem to="/admin/products" icon={Package} label="All Products" end />
          <NavItem to="/admin/products/add" icon={Plus} label="Add Product" />
        </NavGroup>

        <NavGroup label="ORDERS">
          <NavItem to="/admin/orders" icon={ShoppingBag} label="All Orders" badge={pendingOrders} />
        </NavGroup>

        <NavGroup label="CUSTOMERS">
          <NavItem to="/admin/users" icon={Users} label="All Users" />
        </NavGroup>

        <NavGroup label="SYSTEM">
          <NavItem to="/admin/settings" icon={Settings} label="Settings" />
        </NavGroup>
      </div>

      <div className="mt-auto border-t border-[#E8E8E8] p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-heading text-[14px] font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-[13px] text-[#0A0A0A] font-semibold truncate">Administrator</p>
            <p className="font-body text-[11px] text-[#999999] truncate">admin@voguevault.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-[#999999] hover:text-[#EF4444] font-body text-[13px] font-medium transition-colors rounded-lg hover:bg-red-50"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
