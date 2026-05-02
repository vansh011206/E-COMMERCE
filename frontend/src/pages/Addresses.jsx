import React, { memo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import Footer from '../components/Layout/Footer';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Addresses = () => {
  const { user, addresses, addAddress, removeAddress } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', pincode: '', addressLine1: '', addressLine2: '', city: '', state: '', type: 'HOME'
  });
  const [errors, setErrors] = useState({});

  if (!user) return <Navigate to="/login" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Enter valid 10 digit number';
    if (!formData.pincode.match(/^\d{6}$/)) newErrors.pincode = 'Enter valid 6 digit pincode';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.state.trim()) newErrors.state = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await addAddress(formData);
      setShowForm(false);
      setFormData({ fullName: '', phone: '', pincode: '', addressLine1: '', addressLine2: '', city: '', state: '', type: 'HOME' });
      toast.success('Address added successfully');
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeAddress(id);
      toast.success('Address removed');
    } catch (err) {
      toast.error('Failed to remove address');
    }
  };

  const inputClass = (field) =>
    `w-full h-[48px] px-4 bg-[#F8F8F8] border rounded-lg font-body text-[14px] outline-none transition-colors ${errors[field] ? 'border-[#E53935]' : 'border-[#E8E8E8] focus:border-[#0A0A0A]'}`;

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full md:w-[220px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-[#E8E8E8] p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-heading text-[20px] shadow-sm bg-[#0A0A0A]">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading text-[16px] text-[#0A0A0A] font-medium line-clamp-1">{user.name}</h3>
                  <p className="font-body text-[12px] text-[#999] line-clamp-1">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                <Link to="/profile" className="flex items-center px-4 py-3 text-[#555] hover:bg-[#F8F8F8] hover:text-[#0A0A0A] font-body text-[14px] rounded-lg transition-colors">Overview</Link>
                <Link to="/orders" className="flex items-center px-4 py-3 text-[#555] hover:bg-[#F8F8F8] hover:text-[#0A0A0A] font-body text-[14px] rounded-lg transition-colors">My Orders</Link>
                <Link to="/profile/addresses" className="flex items-center px-4 py-3 bg-[#F8F8F8] text-[#0A0A0A] font-body text-[14px] font-semibold rounded-lg border-l-2 border-[#FF3C78]">My Addresses</Link>
                <Link to="/wishlist" className="flex items-center px-4 py-3 text-[#555] hover:bg-[#F8F8F8] hover:text-[#0A0A0A] font-body text-[14px] rounded-lg transition-colors">Wishlist</Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-heading text-[24px] text-[#0A0A0A] font-bold uppercase tracking-wider">My Addresses</h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-body text-[13px] uppercase tracking-wider font-medium bg-[#0A0A0A] hover:bg-[#333] transition-colors"
              >
                <Plus size={16} /> Add New
              </button>
            </div>

            {/* Add Address Form */}
            {showForm && (
              <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 mb-6">
                <h3 className="font-heading text-[16px] text-[#0A0A0A] font-semibold mb-4">Add New Address</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input type="text" name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleChange} className={inputClass('fullName')} />
                      {errors.fullName && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <input type="tel" name="phone" placeholder="Phone *" maxLength={10} value={formData.phone} onChange={handleChange} className={inputClass('phone')} />
                      {errors.phone && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input type="text" name="pincode" placeholder="Pincode *" maxLength={6} value={formData.pincode} onChange={handleChange} className={inputClass('pincode')} />
                      {errors.pincode && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.pincode}</p>}
                    </div>
                    <div>
                      <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleChange} className={inputClass('city')} />
                      {errors.city && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <select name="state" value={formData.state} onChange={handleChange} className={inputClass('state')}>
                        <option value="">State *</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.state}</p>}
                    </div>
                  </div>
                  <div>
                    <input type="text" name="addressLine1" placeholder="Address Line 1 *" value={formData.addressLine1} onChange={handleChange} className={inputClass('addressLine1')} />
                    {errors.addressLine1 && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.addressLine1}</p>}
                  </div>
                  <input type="text" name="addressLine2" placeholder="Address Line 2 (Landmark)" value={formData.addressLine2} onChange={handleChange} className="w-full h-[48px] px-4 bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg font-body text-[14px] outline-none focus:border-[#0A0A0A] transition-colors" />
                  <div className="flex gap-3">
                    {['HOME', 'OFFICE'].map(t => (
                      <button key={t} type="button" onClick={() => setFormData(p => ({ ...p, type: t }))} className={`px-6 py-2 rounded-lg font-body text-[12px] font-medium border transition-colors ${formData.type === t ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white' : 'border-[#E8E8E8] bg-white text-[#555]'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSave} className="px-8 py-3 rounded-lg text-white font-body text-[13px] uppercase tracking-wider font-medium bg-[#0A0A0A] hover:bg-[#333] transition-colors">Save Address</button>
                    <button onClick={() => setShowForm(false)} className="px-6 py-3 font-body text-[13px] text-[#999] hover:text-[#0A0A0A]">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
              <div className="bg-white border border-[#E8E8E8] rounded-xl p-12 text-center">
                <MapPin size={48} className="mx-auto text-[#CCC] mb-4" />
                <p className="font-heading text-[16px] text-[#555] mb-2">No addresses saved yet</p>
                <p className="font-body text-[13px] text-[#999]">Add a delivery address to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr) => {
                  const id = addr._id || addr.id;
                  return (
                    <div key={id} className="bg-white border border-[#E8E8E8] rounded-xl p-5 flex justify-between items-start hover:border-[#CCC] transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-body text-[15px] text-[#0A0A0A] font-bold">{addr.fullName}</span>
                          <span className="font-body text-[10px] bg-[#E8E8E8] px-2 py-0.5 rounded-full text-[#555] uppercase tracking-wider">{addr.type}</span>
                        </div>
                        <p className="font-body text-[13px] text-[#555] leading-relaxed">
                          {addr.addressLine1 || addr.address1}
                          {(addr.addressLine2 || addr.address2) && `, ${addr.addressLine2 || addr.address2}`}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="font-body text-[13px] text-[#555] mt-1">
                          <span className="font-medium">Phone:</span> {addr.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(id)}
                        className="p-2 text-[#999] hover:text-[#E53935] transition-colors"
                        title="Remove address"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default memo(Addresses);
