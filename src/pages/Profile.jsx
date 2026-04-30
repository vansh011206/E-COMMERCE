import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import Footer from '../components/Layout/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, orders } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSave = () => {
    // Mock save to authStore
    useAuthStore.setState({ user: { ...user, name: formData.name, phone: formData.phone } });
    setIsEditing(false);
    toast.success('Profile updated');
  };

  const getInitials = (name) => name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-[220px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-[#E8E8E8] p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-heading text-[20px] shadow-sm bg-[#0A0A0A]">
                  {getInitials(user.name)}
                </div>
                <div>
                  <h3 className="font-heading text-[16px] text-[#0A0A0A] font-medium line-clamp-1">{user.name}</h3>
                  <p className="font-body text-[12px] text-[#999] line-clamp-1">{user.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <Link to="/profile" className="flex items-center px-4 py-3 bg-[#F8F8F8] text-[#0A0A0A] font-body text-[14px] font-semibold rounded-lg border-l-2 border-[#FF3C78]">
                  Overview
                </Link>
                <Link to="/orders" className="flex items-center px-4 py-3 text-[#555] hover:bg-[#F8F8F8] hover:text-[#0A0A0A] font-body text-[14px] rounded-lg transition-colors">
                  My Orders
                </Link>
                <Link to="/profile/addresses" className="flex items-center px-4 py-3 text-[#555] hover:bg-[#F8F8F8] hover:text-[#0A0A0A] font-body text-[14px] rounded-lg transition-colors">
                  My Addresses
                </Link>
                <Link to="/wishlist" className="flex items-center px-4 py-3 text-[#555] hover:bg-[#F8F8F8] hover:text-[#0A0A0A] font-body text-[14px] rounded-lg transition-colors">
                  Wishlist
                </Link>
                <Link to="/profile/settings" className="flex items-center px-4 py-3 text-[#555] hover:bg-[#F8F8F8] hover:text-[#0A0A0A] font-body text-[14px] rounded-lg transition-colors">
                  Account Settings
                </Link>
              </nav>

              <button onClick={handleLogout} className="mt-8 w-full flex items-center gap-2 px-4 py-3 text-[#E53935] hover:bg-[#FFEBEE] font-body text-[14px] font-medium rounded-lg transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="font-heading text-[24px] text-[#0A0A0A] font-bold uppercase tracking-wider mb-6">Overview</h1>
            
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-heading text-[32px] shadow-sm overflow-hidden bg-[#0A0A0A]">
                      {getInitials(user.name)}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <div>
                    {isEditing ? (
                      <div className="space-y-3">
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="font-heading text-[22px] text-[#0A0A0A] border-b border-[#0A0A0A] outline-none bg-transparent w-full" placeholder="Full Name" />
                        <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="font-body text-[14px] text-[#555] border-b border-[#CCC] outline-none bg-transparent w-full mt-1" placeholder="Phone Number" />
                      </div>
                    ) : (
                      <>
                        <h2 className="font-heading text-[22px] text-[#0A0A0A] font-medium">{user.name}</h2>
                        <p className="font-body text-[14px] text-[#999] mt-1">{user.email}</p>
                        <p className="font-body text-[14px] text-[#555] mt-1">{user.phone || 'Add phone number'}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setIsEditing(false); setFormData({ name: user.name, phone: user.phone }); }} className="font-body text-[13px] text-[#999] hover:text-[#0A0A0A]">Cancel</button>
                      <button onClick={handleSave} className="px-6 py-2 rounded text-white font-body text-[13px] uppercase tracking-wider font-medium bg-[#0A0A0A] hover:bg-[#333] transition-colors">Save</button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="px-6 py-2 border border-[#E8E8E8] rounded font-body text-[13px] text-[#0A0A0A] uppercase tracking-wider font-medium hover:border-[#0A0A0A] transition-colors">
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[#E8E8E8] border-t border-[#E8E8E8] pt-8">
                <div className="text-center px-4">
                  <p className="font-mono text-[24px] text-[#0A0A0A] font-bold">{orders?.length || 0}</p>
                  <p className="font-body text-[12px] text-[#999] uppercase tracking-wider mt-1">Orders</p>
                </div>
                <div className="text-center px-4">
                  <p className="font-mono text-[24px] text-[#0A0A0A] font-bold">5</p>
                  <p className="font-body text-[12px] text-[#999] uppercase tracking-wider mt-1">Wishlist</p>
                </div>
                <div className="text-center px-4">
                  <p className="font-mono text-[24px] text-[#0A0A0A] font-bold">3</p>
                  <p className="font-body text-[12px] text-[#999] uppercase tracking-wider mt-1">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default memo(Profile);
