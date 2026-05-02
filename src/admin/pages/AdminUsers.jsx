import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { users, deleteUser, clearAllData, initializeData } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearData = () => {
    if (window.confirm('WARNING: This will delete ALL orders, users, and admin data. Are you absolutely sure?')) {
      if (window.confirm('Please confirm again. This cannot be undone.')) {
        clearAllData();
        toast.success('All data cleared successfully');
        navigate('/admin/dashboard');
      }
    }
  };

  return (
    <div className="w-full max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-[32px] text-[#0A0A0A] font-bold">Users</h1>
          <p className="font-body text-[15px] text-[#999999] mt-1">Manage registered customers and accounts.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden mb-12">
        <div className="p-6 border-b border-[#E8E8E8]">
          <div className="relative max-w-[400px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[44px] pl-11 pr-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto admin-scrollbar pb-2">
          <table className="w-full border-collapse border-spacing-0">
            <thead>
              <tr className="bg-[#F8F8F6] border-b-[2px] border-[#E8E8E8]">
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Customer</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Joined Date</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Orders</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Total Spent</th>
                <th className="px-6 py-[14px] text-right font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const d = new Date(user.joinedAt || Date.now());
                return (
                  <tr
                    key={user.email}
                    className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors"
                    style={{ minHeight: '72px' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#F5F5F3] flex items-center justify-center font-heading text-[16px] text-[#555555] shrink-0 font-bold">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-body text-[15px] text-[#0A0A0A] font-medium">{user.name}</p>
                          <p className="font-body text-[13px] text-[#555555] mt-0.5">{user.email}</p>
                          <p className="font-body text-[12px] text-[#999999] mt-0.5">{user.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body text-[14px] text-[#0A0A0A]">{format(d, "MMM dd, yyyy")}</p>
                      <p className="font-body text-[12px] text-[#999999] mt-0.5">{format(d, "h:mm a")}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-[16px] text-[#0A0A0A] font-medium">{user.totalOrders || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-[16px] text-[#0A0A0A] font-medium">₹{(user.totalSpent || 0).toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => navigate(`/admin/orders?search=${user.email}`)}
                          className="font-body text-[13px] text-[#555555] hover:text-[#0A0A0A] transition-colors hover:underline font-medium"
                        >
                          View Orders
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this user?')) deleteUser(user.email);
                          }}
                          className="font-body text-[13px] text-[#EF4444] hover:text-[#B91C1C] transition-colors hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-[#999999] font-body text-[14px]">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-[#FECACA] bg-[#FEF2F2] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-[18px] text-[#991B1B] font-bold flex items-center gap-2 mb-2">
            <AlertTriangle size={20} /> Danger Zone
          </h2>
          <p className="font-body text-[14px] text-[#991B1B]">
            Clear all store data including orders, users, and admin settings. This action cannot be undone.
          </p>
        </div>
        <button
          onClick={handleClearData}
          className="h-[44px] px-6 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-heading text-[14px] uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0 whitespace-nowrap"
        >
          <Trash2 size={18} />
          Clear All Data
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
