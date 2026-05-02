import React, { memo, useState, useMemo } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

const SummaryStep = ({ onNext, selectedAddressId, setStep }) => {
  const { items, getTotal } = useCartStore();
  const { addresses } = useAuthStore();
  const address = addresses.find((a) => a.id === selectedAddressId);

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shake, setShake] = useState(false);

  const totalMRP = useMemo(() => items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0), [items]);
  const totalSellingPrice = getTotal();
  const savings = totalMRP - totalSellingPrice;
  const deliveryFee = totalSellingPrice > 999 ? 0 : 99;
  const finalTotal = totalSellingPrice - couponDiscount + deliveryFee;
  const totalSavings = savings + couponDiscount;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'FLAT10') {
      const disc = Math.round(totalSellingPrice * 0.1);
      setCouponDiscount(disc);
      setCouponApplied('valid');
    } else {
      setCouponApplied('invalid');
      setCouponDiscount(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(null);
    setCouponDiscount(0);
  };

  return (
    <div className="py-2">
      <h2 className="font-heading text-[18px] text-[#0A0A0A] font-semibold mb-6 uppercase tracking-wider">
        Order Summary
      </h2>

      {/* Delivery Address Review */}
      {address && (
        <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start mb-2">
            <span className="font-body text-[12px] text-[#555] uppercase tracking-wider font-medium">Deliver To:</span>
            <button onClick={() => setStep(1)} className="font-body text-[12px] text-[#0A0A0A] underline hover:text-[#FF3C78]">Change</button>
          </div>
          <div className="font-body text-[14px] text-[#0A0A0A] font-bold mb-1">{address.fullName}</div>
          <p className="font-body text-[13px] text-[#555] leading-relaxed">
            {address.address1} {address.address2 && `, ${address.address2}`}
            <br />
            {address.city}, {address.state} - {address.pincode}
          </p>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 hide-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border border-[#E8E8E8] rounded-lg p-3">
            <div className="w-[60px] h-[80px] bg-[#F8F8F6] rounded overflow-hidden flex-shrink-0">
              <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[13px] text-[#0A0A0A] font-medium line-clamp-1">{item.product.name}</p>
              <p className="font-body text-[12px] text-[#555] mt-1">
                {item.selectedSize && `Size: ${item.selectedSize}`} | Qty: {item.quantity}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-[14px] font-bold text-[#0A0A0A]">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                {item.product.mrp > item.product.price && (
                  <span className="font-mono text-[12px] text-[#BBB] line-through">₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="mb-6">
        {couponApplied === 'valid' ? (
          <div className="border border-[#00A86B] rounded-lg px-4 py-3 flex items-center justify-between bg-[#00A86B]/5">
            <span className="font-body text-[13px] text-[#00A86B] font-medium">
              FLAT10 applied ✓ Saving ₹{couponDiscount.toLocaleString('en-IN')}
            </span>
            <button onClick={handleRemoveCoupon} className="font-body text-[12px] text-[#E53935] font-semibold uppercase hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <div className={`border rounded-lg px-3 py-2.5 flex items-center gap-2 transition-colors ${couponApplied === 'invalid' ? 'border-[#E53935]' : 'border-dashed border-[#E8E8E8]'} ${shake ? 'animate-shake' : ''}`}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                if (couponApplied === 'invalid') setCouponApplied(null);
              }}
              placeholder="Enter coupon code"
              className="flex-1 bg-transparent border-none outline-none font-body text-[13px] text-[#0A0A0A] placeholder:text-[#BBB]"
            />
            <button onClick={handleApplyCoupon} disabled={!couponCode.trim()} className="font-body text-[13px] text-[#FF3C78] font-semibold uppercase hover:text-[#E5356B] transition-colors disabled:opacity-40">
              Apply
            </button>
          </div>
        )}
        {couponApplied === 'invalid' && <p className="font-body text-[12px] text-[#E53935] mt-1.5 ml-1">Invalid coupon code</p>}
      </div>

      {/* Price Breakdown */}
      <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg p-5 mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-body text-[14px] text-[#555]">Total MRP</span>
          <span className="font-mono text-[14px] text-[#0A0A0A]">₹{totalMRP.toLocaleString('en-IN')}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-body text-[14px] text-[#555]">Discount on MRP</span>
            <span className="font-mono text-[14px] text-[#00A86B]">−₹{savings.toLocaleString('en-IN')}</span>
          </div>
        )}
        {couponApplied === 'valid' && couponDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-body text-[14px] text-[#555]">Coupon Discount</span>
            <span className="font-mono text-[14px] text-[#00A86B]">−₹{couponDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="font-body text-[14px] text-[#555]">Delivery Fee</span>
          <span className={`font-mono text-[14px] ${deliveryFee === 0 ? 'text-[#00A86B]' : 'text-[#0A0A0A]'}`}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="border-t border-dashed border-[#E8E8E8] my-1" />
        <div className="flex justify-between items-center pt-1">
          <span className="font-body text-[14px] text-[#0A0A0A] font-semibold">Total Amount</span>
          <span className="font-mono text-[18px] font-bold text-[#0A0A0A]">₹{finalTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <button
        onClick={() => onNext({ couponDiscount, finalTotal, deliveryFee })}
        className="w-full h-[52px] rounded-lg text-white font-heading text-[14px] uppercase tracking-[0.1em] transition-colors bg-[#0A0A0A] hover:bg-[#333]"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default memo(SummaryStep);
