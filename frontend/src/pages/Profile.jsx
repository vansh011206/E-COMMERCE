import React, { memo, useState } from 'react';
import { Link, useNavigate, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { LogOut, Camera, MapPin, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import Footer from '../components/Layout/Footer';

const ProfileOverview = ({ user, isEditing, setIsEditing, formData, setFormData, handleSave, getInitials, orders }) => (
  <>
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
          <p className="font-mono text-[24px] text-[#0A0A0A] font-bold">{user.wishlist?.length || 0}</p>
          <p className="font-body text-[12px] text-[#999] uppercase tracking-wider mt-1">Wishlist</p>
        </div>
        <div className="text-center px-4">
          <p className="font-mono text-[24px] text-[#0A0A0A] font-bold">0</p>
          <p className="font-body text-[12px] text-[#999] uppercase tracking-wider mt-1">Reviews</p>
        </div>
      </div>
    </div>
  </>
);

const ProfileAddresses = () => {
  const { addresses, removeAddress } = useAuthStore();
  
  return (
    <>
      <h1 className="font-heading text-[24px] text-[#0A0A0A] font-bold uppercase tracking-wider mb-6">My Addresses</h1>
      <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 md:p-8">
        {addresses.length === 0 ? (
          <div className="text-center py-10">
            <MapPin size={40} className="mx-auto text-[#CCC] mb-4" />
            <p className="font-body text-[14px] text-[#555]">No addresses found.</p>
            <p className="font-body text-[12px] text-[#999] mt-1">You can add an address during checkout.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map(addr => {
              const currentId = addr._id || addr.id;
              return (
                <div key={currentId} className="border border-[#E8E8E8] rounded-lg p-5 relative group hover:border-[#CCC] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-body text-[15px] text-[#0A0A0A] font-bold">{addr.fullName}</span>
                    <span className="font-body text-[10px] bg-[#F5F5F5] px-2 py-0.5 rounded text-[#555] uppercase tracking-wider">
                      {addr.type || 'HOME'}
                    </span>
                  </div>
                  <p className="font-body text-[13px] text-[#555] leading-relaxed max-w-[90%]">
                    {addr.addressLine1 || addr.address1} {addr.addressLine2 || addr.address2 ? `, ${addr.addressLine2 || addr.address2}` : ''}
                    <br />
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="font-body text-[13px] text-[#555] mt-3">
                    <span className="font-medium text-[#0A0A0A]">Phone:</span> {addr.phone}
                  </p>
                  <button 
                    onClick={() => {
                      removeAddress(currentId);
                      toast.success('Address removed');
                    }}
                    className="absolute top-4 right-4 text-[#999] hover:text-[#E53935] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, orders } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSave = () => {
    useAuthStore.setState({ user: { ...user, name: formData.name, phone: formData.phone } });
    setIsEditing(false);
    toast.success('Profile updated');
  };

  const getInitials = (name) => name?.charAt(0).toUpperCase() || 'U';

  const isActive = (path) => {
    if (path === '/profile' && location.pathname === '/profile') return true;
    if (path !== '/profile' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkClass = (path) => `flex items-center px-4 py-3 font-body text-[14px] rounded-lg transition-colors ${
    isActive(path) 
      ? 'bg-[#F8F8F8] text-[#0A0A0A] font-semibold border-l-2 border-[#FF3C78]' 
      : 'text-[#555] hover:bg-[#F8F8F8] hover:text-[#0A0A0A]'
  }`;

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
                <Link to="/profile" className={linkClass('/profile')}>Overview</Link>
                <Link to="/orders" className={linkClass('/orders')}>My Orders</Link>
                <Link to="/profile/addresses" className={linkClass('/profile/addresses')}>My Addresses</Link>
                <Link to="/wishlist" className={linkClass('/wishlist')}>Wishlist</Link>
              </nav>

              <button onClick={handleLogout} className="mt-8 w-full flex items-center gap-2 px-4 py-3 text-[#E53935] hover:bg-[#FFEBEE] font-body text-[14px] font-medium rounded-lg transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<ProfileOverview user={user} isEditing={isEditing} setIsEditing={setIsEditing} formData={formData} setFormData={setFormData} handleSave={handleSave} getInitials={getInitials} orders={orders} />} />
              <Route path="/addresses" element={<ProfileAddresses />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default memo(Profile);
