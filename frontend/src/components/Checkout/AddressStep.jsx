import React, { memo, useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const AddressStep = ({ onNext, selectedAddressId, setSelectedAddressId }) => {
  const { addresses, addAddress, removeAddress } = useAuthStore();
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [isLocating, setIsLocating] = useState(false);

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

  const handlePincodeBlur = async () => {
    if (formData.pincode.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData((p) => ({ ...p, city: postOffice.District, state: postOffice.State }));
          if (errors.city) setErrors((p) => ({ ...p, city: '' }));
          if (errors.state) setErrors((p) => ({ ...p, state: '' }));
        }
      } catch (err) {
        // Fallback to manual entry
      }
    }
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data && data.address) {
          const fetchedCity = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state_district || '';
          const fetchedState = data.address.state || '';
          const fetchedPincode = data.address.postcode || '';
          
          setFormData(prev => ({
            ...prev,
            city: fetchedCity,
            state: fetchedState,
            pincode: fetchedPincode
          }));
          toast.success('Location fetched successfully');
        }
      } catch (error) {
        toast.error('Failed to fetch location details');
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      toast.error('Location permission denied. Please allow location access.');
      setIsLocating(false);
    });
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

  const handleSaveAndContinue = async () => {
    if (showForm) {
      if (validate()) {
        try {
          const mappedData = {
            ...formData,
            addressLine1: formData.address1,
            addressLine2: formData.address2
          };
          const newId = await addAddress(mappedData);
          setSelectedAddressId(newId);
          setShowForm(false);
          onNext();
        } catch (error) {
          console.error("Failed to add address", error);
          toast.error(error.message || "Failed to add address. Please try again.");
        }
      }
    } else {
      if (selectedAddressId) onNext();
    }
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-[18px] text-[#0A0A0A] font-semibold uppercase tracking-wider">
          Select Delivery Address
        </h2>
        {showForm && (
          <button 
            onClick={handleFetchLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 font-body text-[13px] text-[#FF3C78] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MapPin size={16} />
            {isLocating ? 'Locating...' : 'Use my location'}
          </button>
        )}
      </div>

      {!showForm && addresses.length > 0 && (
        <div className="space-y-4 mb-6">
          {addresses.map((addr) => {
            const currentId = addr._id || addr.id;
            return (
            <label
              key={currentId}
              className={`block border-[1.5px] rounded-lg p-4 cursor-pointer transition-colors ${
                selectedAddressId === currentId ? 'border-[#0A0A0A] bg-[#F8F8F8]' : 'border-[#E8E8E8] hover:border-[#CCC]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === currentId}
                    onChange={() => setSelectedAddressId(currentId)}
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
                      {addr.addressLine1 || addr.address1} {addr.addressLine2 || addr.address2 && `, ${addr.addressLine2 || addr.address2}`}
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
                    onClick={async (e) => {
                      e.preventDefault();
                      await removeAddress(currentId);
                      if (selectedAddressId === currentId) setSelectedAddressId(null);
                      if (addresses.length === 1) setShowForm(true);
                    }}
                    className="font-body text-[11px] text-[#E53935] uppercase hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </label>
          )})}

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
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
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
        className="w-full rounded h-[50px] px-4 text-white font-heading text-[13px] uppercase tracking-[0.1em] bg-[#0A0A0A] hover:bg-[#333] transition-colors disabled:opacity-50"
      >
        Save and Continue
      </button>
    </div>
  );
};

export default memo(AddressStep);
