import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import LiveOrderPopup from './LiveOrderPopup';

const AdminLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#FFFFFF] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[240px] h-screen overflow-hidden relative">
        <AdminTopBar setMobileMenuOpen={setMobileMenuOpen} />
        
        <main
          className="flex-1 overflow-y-auto w-full admin-scrollbar bg-[#FFFFFF]"
        >
          <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      <LiveOrderPopup />

      {/* Custom scrollbar styles for admin */}
      <style>{`
        .admin-scrollbar::-webkit-scrollbar { width: 8px; }
        .admin-scrollbar::-webkit-scrollbar-track { background: #FFFFFF; }
        .admin-scrollbar::-webkit-scrollbar-thumb { background: #E8E8E8; border-radius: 4px; }
        .admin-scrollbar::-webkit-scrollbar-thumb:hover { background: #CCCCCC; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
