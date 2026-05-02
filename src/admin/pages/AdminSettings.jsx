import React, { useState } from 'react';
import { Save, Shield, User, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: 'Administrator',
    email: 'admin@voguevault.com'
  });
  
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [storeData, setStoreData] = useState({
    storeName: 'VOGUEVAULT',
    supportEmail: 'support@voguevault.com',
    currency: 'INR (₹)',
    taxRate: '18'
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Profile settings saved');
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Security settings updated');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleStoreSave = (e) => {
    e.preventDefault();
    toast.success('Store settings saved');
  };

  const tabs = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'store', label: 'Store Preferences', icon: Globe }
  ];

  return (
    <div className="w-full max-w-[1000px]">
      <div className="mb-8">
        <h1 className="font-heading text-[32px] text-[#0A0A0A] font-bold">Settings</h1>
        <p className="font-body text-[15px] text-[#999999] mt-1">Manage system preferences and your admin account.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[240px] shrink-0">
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-[14px] transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#0A0A0A] text-white font-medium shadow-sm' 
                    : 'text-[#555555] hover:bg-[#F5F5F3] hover:text-[#0A0A0A]'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#E8E8E8] rounded-[14px] overflow-hidden">
              <div className="p-8 border-b border-[#E8E8E8]">
                <h2 className="font-heading text-[20px] text-[#0A0A0A] font-bold">Admin Profile</h2>
                <p className="font-body text-[14px] text-[#555555] mt-1">Update your personal information.</p>
              </div>
              <form onSubmit={handleProfileSave} className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-[80px] h-[80px] rounded-full bg-[#F5F5F3] flex items-center justify-center font-heading text-[32px] text-[#0A0A0A] font-bold shrink-0 border border-[#E8E8E8]">
                    {profileData.name.charAt(0)}
                  </div>
                  <div>
                    <button type="button" className="font-body text-[13px] px-4 py-2 bg-white border border-[#E8E8E8] hover:border-[#0A0A0A] rounded-lg transition-colors text-[#0A0A0A] font-medium">
                      Change Avatar
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="font-body text-[13px] text-[#555555] block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={e => setProfileData({...profileData, name: e.target.value})}
                      className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[13px] text-[#555555] block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({...profileData, email: e.target.value})}
                      className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="h-[44px] px-8 bg-[#0A0A0A] hover:bg-[#333333] text-white rounded-lg font-heading text-[13px] uppercase tracking-wider flex items-center gap-2 transition-colors">
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white border border-[#E8E8E8] rounded-[14px] overflow-hidden">
              <div className="p-8 border-b border-[#E8E8E8]">
                <h2 className="font-heading text-[20px] text-[#0A0A0A] font-bold">Security</h2>
                <p className="font-body text-[14px] text-[#555555] mt-1">Update your password and secure your account.</p>
              </div>
              <form onSubmit={handleSecuritySave} className="p-8 space-y-6">
                <div>
                  <label className="font-body text-[13px] text-[#555555] block mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})}
                    className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div className="pt-2">
                  <label className="font-body text-[13px] text-[#555555] block mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={e => setSecurityData({...securityData, newPassword: e.target.value})}
                    className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="font-body text-[13px] text-[#555555] block mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})}
                    className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="h-[44px] px-8 bg-[#0A0A0A] hover:bg-[#333333] text-white rounded-lg font-heading text-[13px] uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <Save size={16} /> Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="bg-white border border-[#E8E8E8] rounded-[14px] overflow-hidden">
              <div className="p-8 border-b border-[#E8E8E8]">
                <h2 className="font-heading text-[20px] text-[#0A0A0A] font-bold">Store Preferences</h2>
                <p className="font-body text-[14px] text-[#555555] mt-1">Manage global store settings.</p>
              </div>
              <form onSubmit={handleStoreSave} className="p-8 space-y-6">
                <div>
                  <label className="font-body text-[13px] text-[#555555] block mb-1.5">Store Name</label>
                  <input
                    type="text"
                    value={storeData.storeName}
                    onChange={e => setStoreData({...storeData, storeName: e.target.value})}
                    className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-[13px] text-[#555555] block mb-1.5">Support Email</label>
                  <input
                    type="email"
                    value={storeData.supportEmail}
                    onChange={e => setStoreData({...storeData, supportEmail: e.target.value})}
                    className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="font-body text-[13px] text-[#555555] block mb-1.5">Currency</label>
                    <select
                      value={storeData.currency}
                      onChange={e => setStoreData({...storeData, currency: e.target.value})}
                      className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                    >
                      <option value="INR (₹)">INR (₹)</option>
                      <option value="USD ($)">USD ($)</option>
                      <option value="EUR (€)">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-[13px] text-[#555555] block mb-1.5">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={storeData.taxRate}
                      onChange={e => setStoreData({...storeData, taxRate: e.target.value})}
                      className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="h-[44px] px-8 bg-[#0A0A0A] hover:bg-[#333333] text-white rounded-lg font-heading text-[13px] uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <Save size={16} /> Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
