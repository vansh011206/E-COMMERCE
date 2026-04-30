import React, { memo, useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

const AddressStep = ({ onNext, selectedAddressId, setSelectedAddressId }) => {
  const { addresses, addAddress, removeAddress } = useAuthStore();
  const [showForm, setShowForm] = useState(addresses.length === 0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    type: 'HOME',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId, setSelectedAddressId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handlePincodeBlur = () => {
    if (formData.pincode.length === 6) {
      // Mock autofill
      setFormData((p) => ({ ...p, city: 'Mumbai', state: 'Maharashtra' }));
      if (errors.city) setErrors((p) => ({ ...p, city: '' }));
      if (errors.state) setErrors((p) => ({ ...p, state: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Enter valid 10 digit number';
    if (!formData.pincode.match(/^\d{6}$/)) newErrors.pincode = 'Enter valid 6 digit pincode';
    if (!formData.address1.trim()) newErrors.address1 = 'Address line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndContinue = () => {
    if (showForm) {
      if (validate()) {
        const newId = addAddress(formData);
        setSelectedAddressId(newId);
        setShowForm(false);
        onNext();
      }
    } else {
      if (selectedAddressId) onNext();
    }
  };

  return (
    <div className="py-2">
      <h2 className="font-heading text-[18px] text-[#0A0A0A] font-semibold mb-6 uppercase tracking-wider">
        Select Delivery Address
      </h2>

      {!showForm && addresses.length > 0 && (
        <div className="space-y-4 mb-6">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`block border-[1.5px] rounded-lg p-4 cursor-pointer transition-colors ${
                selectedAddressId === addr.id ? 'border-[#0A0A0A] bg-[#F8F8F8]' : 'border-[#E8E8E8] hover:border-[#CCC]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1 accent-[#0A0A0A]"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body text-[14px] text-[#0A0A0A] font-bold">{addr.fullName}</span>
                      <span className="font-body text-[10px] bg-[#E8E8E8] px-2 py-0.5 rounded-full text-[#555] uppercase tracking-wider">
                        {addr.type}
                      </span>
                    </div>
                    <p className="font-body text-[13px] text-[#555] leading-relaxed">
                      {addr.address1} {addr.address2 && `, ${addr.address2}`}
                      <br />
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="font-body text-[13px] text-[#555] mt-1">
                      <span className="font-medium">Phone:</span> {addr.phone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeAddress(addr.id);
                      if (selectedAddressId === addr.id) setSelectedAddressId(null);
                      if (addresses.length === 1) setShowForm(true);
                    }}
                    className="font-body text-[11px] text-[#E53935] uppercase hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </label>
          ))}

          <button
            onClick={() => setShowForm(true)}
            className="font-body text-[13px] text-[#FF3C78] font-medium hover:underline mt-2"
          >
            + Add another address
          </button>
        </div>
      )}

      {showForm && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full h-[48px] px-4 bg-[#F8F8F8] border rounded-lg font-body text-[14px] outline-none transition-colors ${
                  errors.fullName ? 'border-[#E53935]' : 'border-[#E8E8E8] focus:border-[#0A0A0A]'
                }`}
              />
              {errors.fullName && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className={`w-full h-[48px] px-4 bg-[#F8F8F8] border rounded-lg font-body text-[14px] outline-none transition-colors ${
                  errors.phone ? 'border-[#E53935]' : 'border-[#E8E8E8] focus:border-[#0A0A0A]'
                }`}
              />
              {errors.phone && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="pincode"
                placeholder="Pincode *"
                value={formData.pincode}
                onChange={handleChange}
                onBlur={handlePincodeBlur}
                maxLength={6}
                className={`w-full h-[48px] px-4 bg-[#F8F8F8] border rounded-lg font-body text-[14px] outline-none transition-colors ${
                  errors.pincode ? 'border-[#E53935]' : 'border-[#E8E8E8] focus:border-[#0A0A0A]'
                }`}
              />
              {errors.pincode && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.pincode}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full h-[48px] px-4 bg-[#F8F8F8] border rounded-lg font-body text-[14px] outline-none transition-colors ${
                    errors.city ? 'border-[#E53935]' : 'border-[#E8E8E8] focus:border-[#0A0A0A]'
                  }`}
                />
                {errors.city && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.city}</p>}
              </div>
              <div>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full h-[48px] px-4 bg-[#F8F8F8] border rounded-lg font-body text-[14px] outline-none transition-colors ${
                    errors.state ? 'border-[#E53935]' : 'border-[#E8E8E8] focus:border-[#0A0A0A]'
                  }`}
                >
                  <option value="">State *</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  {/* Add more states as needed */}
                </select>
                {errors.state && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.state}</p>}
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              name="address1"
              placeholder="Address Line 1 (House/Flat/Office) *"
              value={formData.address1}
              onChange={handleChange}
              className={`w-full h-[48px] px-4 bg-[#F8F8F8] border rounded-lg font-body text-[14px] outline-none transition-colors ${
                errors.address1 ? 'border-[#E53935]' : 'border-[#E8E8E8] focus:border-[#0A0A0A]'
              }`}
            />
            {errors.address1 && <p className="font-body text-[12px] text-[#E53935] mt-1">{errors.address1}</p>}
          </div>

          <div>
            <input
              type="text"
              name="address2"
              placeholder="Address Line 2 (Landmark/Area)"
              value={formData.address2}
              onChange={handleChange}
              className="w-full h-[48px] px-4 bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg font-body text-[14px] outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>

          <div>
            <p className="font-body text-[13px] text-[#555] mb-2">Address Type</p>
            <div className="flex gap-3">
              {['HOME', 'OFFICE'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, type }))}
                  className={`px-6 py-2 rounded-lg font-body text-[12px] font-medium transition-colors border ${
                    formData.type === type
                      ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                      : 'border-[#E8E8E8] bg-white text-[#555] hover:border-[#0A0A0A]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {addresses.length > 0 && (
            <button
              onClick={() => setShowForm(false)}
              className="font-body text-[13px] text-[#999] hover:text-[#0A0A0A] mt-2"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      <button
        onClick={handleSaveAndContinue}
        disabled={!showForm && !selectedAddressId}
        className="flex-1 rounded h-[50px] text-white font-heading text-[13px] uppercase tracking-[0.1em] bg-[#0A0A0A] hover:bg-[#333] transition-colors disabled:opacity-50"
      >
        Save and Continue
      </button>
    </div>
  );
};

export default memo(AddressStep);
