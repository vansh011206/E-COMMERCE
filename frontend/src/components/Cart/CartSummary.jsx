import React, { memo, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

const CartSummary = () => {
  const navigate = useNavigate();
  const { items, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shake, setShake] = useState(false);

  const totalMRP = useMemo(() => items.reduce((s, i) => s + i.product.mrp * i.quantity, 0), [items]);
  const totalSelling = getTotal();
  const savings = totalMRP - totalSelling;
  const deliveryFee = totalSelling > 999 ? 0 : 99;
  const finalTotal = totalSelling - couponDiscount + deliveryFee;
  const totalSavings = savings + couponDiscount;

  const handleApply = () => {
    if (couponCode.trim().toUpperCase() === 'FLAT10') {
      const d = Math.round(totalSelling * 0.1);
      setCouponDiscount(d);
      setCouponApplied('valid');
    } else {
      setCouponApplied('invalid');
      setCouponDiscount(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleRemove = () => { setCouponCode(''); setCouponApplied(null); setCouponDiscount(0); };

  return (
    <div className="sticky top-[80px]">
      <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg p-6">
        <h3 className="font-heading text-[13px] uppercase tracking-[0.1em] text-[#0A0A0A] font-semibold mb-5">Price Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between"><span className="font-body text-[14px] text-[#555]">Total MRP</span><span className="font-mono text-[14px] text-[#0A0A0A]">₹{totalMRP.toLocaleString('en-IN')}</span></div>
          {savings > 0 && <div className="flex justify-between"><span className="font-body text-[14px] text-[#555]">Discount on MRP</span><span className="font-mono text-[14px] text-[#00A86B]">−₹{savings.toLocaleString('en-IN')}</span></div>}
          {couponApplied === 'valid' && couponDiscount > 0 && <div className="flex justify-between"><span className="font-body text-[14px] text-[#555]">Coupon Discount</span><span className="font-mono text-[14px] text-[#00A86B]">−₹{couponDiscount.toLocaleString('en-IN')}</span></div>}
          <div className="flex justify-between"><span className="font-body text-[14px] text-[#555]">Delivery Fee</span><span className={`font-mono text-[14px] ${deliveryFee === 0 ? 'text-[#00A86B]' : 'text-[#0A0A0A]'}`}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
          <div className="border-t border-dashed border-[#E8E8E8] my-1" />
          <div className="flex justify-between pt-1"><span className="font-body text-[14px] text-[#0A0A0A] font-semibold">Total Amount</span><span className="font-mono text-[18px] font-bold text-[#0A0A0A]">₹{finalTotal.toLocaleString('en-IN')}</span></div>
          {totalSavings > 0 && <p className="font-body text-[13px] text-[#00A86B] text-center mt-2">You will save ₹{totalSavings.toLocaleString('en-IN')} on this order</p>}
        </div>

        {/* Coupon */}
        <div className="mt-5">
          {couponApplied === 'valid' ? (
            <div className="border border-[#00A86B] rounded-lg px-4 py-3 flex items-center justify-between bg-[#00A86B]/5">
              <span className="font-body text-[13px] text-[#00A86B] font-medium">FLAT10 applied ✓ Saving ₹{couponDiscount.toLocaleString('en-IN')}</span>
              <button onClick={handleRemove} className="font-body text-[12px] text-[#E53935] font-semibold uppercase hover:underline">Remove</button>
            </div>
          ) : (
            <div className={`border rounded-lg px-3 py-2.5 flex items-center gap-2 transition-colors ${couponApplied === 'invalid' ? 'border-[#E53935]' : 'border-dashed border-[#E8E8E8]'} ${shake ? 'animate-shake' : ''}`}>
              <input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); if (couponApplied === 'invalid') setCouponApplied(null); }} placeholder="Enter coupon code" className="flex-1 bg-transparent border-none outline-none font-body text-[13px] text-[#0A0A0A] placeholder:text-[#BBB]" />
              <button onClick={handleApply} disabled={!couponCode.trim()} className="font-body text-[13px] text-[#FF3C78] font-semibold uppercase hover:text-[#E5356B] transition-colors disabled:opacity-40">Apply</button>
            </div>
          )}
          {couponApplied === 'invalid' && <p className="font-body text-[12px] text-[#E53935] mt-1.5 ml-1">Invalid coupon code</p>}
        </div>

        {/* CTA */}
        <button onClick={() => navigate('/checkout')} className="w-full h-[52px] mt-5 rounded-lg text-white font-heading text-[14px] uppercase tracking-[0.1em] transition-colors bg-[#0A0A0A] hover:bg-[#333]">
          Place Order
        </button>

        {/* Trust */}
        <div className="flex items-center justify-center gap-4 border-t border-[#E8E8E8] mt-4 pt-3">
          <span className="font-body text-[11px] text-[#999]">🔒 Secure</span>
          <span className="font-body text-[11px] text-[#999]">|</span>
          <span className="font-body text-[11px] text-[#999]">↩ Easy Returns</span>
          <span className="font-body text-[11px] text-[#999]">|</span>
          <span className="font-body text-[11px] text-[#999]">✓ Genuine</span>
        </div>
      </div>
    </div>
  );
};

export default memo(CartSummary);
