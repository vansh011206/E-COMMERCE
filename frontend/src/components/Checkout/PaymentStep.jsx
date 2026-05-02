import React, { memo, useState } from 'react';
import { CreditCard, Smartphone, Building2, Banknote, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const PaymentStep = ({ finalTotal, onNext }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const getCardType = (num) => {
    if (num.startsWith('4')) return 'VISA';
    if (num.startsWith('5')) return 'MASTERCARD';
    return null;
  };

  const cardType = getCardType(cardNumber.replace(/\s/g, ''));

  return (
    <div className="py-2">
      <h2 className="font-heading text-[18px] text-[#0A0A0A] font-semibold mb-6 uppercase tracking-wider">
        Select Payment Method
      </h2>

      <div className="space-y-4 mb-6">
        {/* Credit / Debit Card */}
        <div
          className={`border-[1.5px] rounded-lg overflow-hidden transition-colors ${
            selectedMethod === 'card' ? 'border-[#0A0A0A] bg-[#F8F8F8]' : 'border-[#E8E8E8] hover:border-[#CCC] cursor-pointer'
          }`}
        >
          <label className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setSelectedMethod('card')}>
            <input type="radio" name="payment" checked={selectedMethod === 'card'} onChange={() => {}} className="accent-[#0A0A0A]" />
            <CreditCard size={20} className={selectedMethod === 'card' ? 'text-[#0A0A0A]' : 'text-[#555]'} />
            <span className="font-body text-[14px] font-medium text-[#0A0A0A]">Credit / Debit Card</span>
          </label>
          <AnimatePresence>
            {selectedMethod === 'card' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 overflow-hidden">
                <div className="pt-2 space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full h-[48px] px-4 bg-white border border-[#E8E8E8] rounded-lg font-mono text-[14px] outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                    {cardType && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-heading text-[12px] font-bold text-[#0A0A0A]">
                        {cardType}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" maxLength={5} className="w-full h-[48px] px-4 bg-white border border-[#E8E8E8] rounded-lg font-mono text-[14px] outline-none focus:border-[#0A0A0A] transition-colors" />
                    <input type="password" placeholder="CVV" maxLength={3} className="w-full h-[48px] px-4 bg-white border border-[#E8E8E8] rounded-lg font-mono text-[14px] outline-none focus:border-[#0A0A0A] transition-colors" />
                  </div>
                  <input type="text" placeholder="Cardholder Name" className="w-full h-[48px] px-4 bg-white border border-[#E8E8E8] rounded-lg font-body text-[14px] outline-none focus:border-[#0A0A0A] transition-colors" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#0A0A0A] rounded w-4 h-4" />
                    <span className="font-body text-[13px] text-[#555]">Securely save this card for faster payments</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* UPI */}
        <div
          className={`border-[1.5px] rounded-lg overflow-hidden transition-colors ${
            selectedMethod === 'upi' ? 'border-[#0A0A0A] bg-[#F8F8F8]' : 'border-[#E8E8E8] hover:border-[#CCC] cursor-pointer'
          }`}
        >
          <label className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setSelectedMethod('upi')}>
            <input type="radio" name="payment" checked={selectedMethod === 'upi'} onChange={() => {}} className="accent-[#0A0A0A]" />
            <Smartphone size={20} className={selectedMethod === 'upi' ? 'text-[#0A0A0A]' : 'text-[#555]'} />
            <span className="font-body text-[14px] font-medium text-[#0A0A0A]">UPI (GPay, PhonePe, Paytm)</span>
          </label>
          <AnimatePresence>
            {selectedMethod === 'upi' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 overflow-hidden">
                <div className="pt-2 space-y-4">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter UPI ID (e.g. name@bank)" className="flex-1 h-[48px] px-4 bg-white border border-[#E8E8E8] rounded-lg font-body text-[14px] outline-none focus:border-[#0A0A0A] transition-colors" />
                    <button className="px-6 bg-black text-white font-body text-[13px] uppercase tracking-wider font-medium rounded-lg hover:bg-[#333] transition-colors">Verify</button>
                  </div>
                  <div className="flex gap-3">
                    {['GPay', 'PhonePe', 'Paytm'].map((app) => (
                      <button key={app} className="flex-1 py-2 border border-[#E8E8E8] rounded-lg bg-white font-body text-[13px] font-medium text-[#555] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors">
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Net Banking */}
        <div
          className={`border-[1.5px] rounded-lg overflow-hidden transition-colors ${
            selectedMethod === 'netbanking' ? 'border-[#0A0A0A] bg-[#F8F8F8]' : 'border-[#E8E8E8] hover:border-[#CCC] cursor-pointer'
          }`}
        >
          <label className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setSelectedMethod('netbanking')}>
            <input type="radio" name="payment" checked={selectedMethod === 'netbanking'} onChange={() => {}} className="accent-[#0A0A0A]" />
            <Building2 size={20} className={selectedMethod === 'netbanking' ? 'text-[#0A0A0A]' : 'text-[#555]'} />
            <span className="font-body text-[14px] font-medium text-[#0A0A0A]">Net Banking</span>
          </label>
        </div>

        {/* Cash on Delivery */}
        <div
          className={`border-[1.5px] rounded-lg overflow-hidden transition-colors ${
            selectedMethod === 'cod' ? 'border-[#0A0A0A] bg-[#F8F8F8]' : 'border-[#E8E8E8] hover:border-[#CCC] cursor-pointer'
          }`}
        >
          <label className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setSelectedMethod('cod')}>
            <input type="radio" name="payment" checked={selectedMethod === 'cod'} onChange={() => {}} className="accent-[#0A0A0A]" />
            <Banknote size={20} className={selectedMethod === 'cod' ? 'text-[#0A0A0A]' : 'text-[#555]'} />
            <span className="font-body text-[14px] font-medium text-[#0A0A0A]">Cash on Delivery</span>
          </label>
          <AnimatePresence>
            {selectedMethod === 'cod' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 overflow-hidden">
                <div className="pt-2 bg-[#FFF4E5] border border-[#FFE0B2] p-3 rounded-lg">
                  <p className="font-body text-[13px] text-[#E65100]">Note: Additional ₹49 COD charge applicable.</p>
                  <p className="font-body text-[12px] text-[#E65100] mt-1">Available for orders below ₹5000.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Wallet */}
        <div
          className={`border-[1.5px] rounded-lg overflow-hidden transition-colors ${
            selectedMethod === 'wallet' ? 'border-[#0A0A0A] bg-[#F8F8F8]' : 'border-[#E8E8E8] hover:border-[#CCC] cursor-pointer'
          }`}
        >
          <label className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setSelectedMethod('wallet')}>
            <input type="radio" name="payment" checked={selectedMethod === 'wallet'} onChange={() => {}} className="accent-[#0A0A0A]" />
            <Wallet size={20} className={selectedMethod === 'wallet' ? 'text-[#0A0A0A]' : 'text-[#555]'} />
            <span className="font-body text-[14px] font-medium text-[#0A0A0A]">Paytm / Wallet</span>
          </label>
        </div>
      </div>

      <button
        onClick={() => {
          if (selectedMethod === 'card') {
            if (cardNumber.length < 19) return toast.error('Please enter a valid 16-digit card number');
            // Basic check for other fields can be added if state was managed, but we'll enforce just card number for demo
            if (cardNumber.trim() === '') return toast.error('Please enter card details');
          } else if (selectedMethod === 'upi') {
            const upiInput = document.querySelector('input[placeholder="Enter UPI ID (e.g. name@bank)"]').value;
            if (!upiInput || !upiInput.includes('@')) return toast.error('Please enter a valid UPI ID');
          }
          onNext({ method: selectedMethod });
        }}
        className="w-full h-[52px] rounded-lg text-white font-heading text-[14px] uppercase tracking-[0.1em] transition-colors bg-[#0A0A0A] hover:bg-[#333]"
      >
        Pay ₹{(finalTotal + (selectedMethod === 'cod' ? 49 : 0)).toLocaleString('en-IN')}
      </button>
    </div>
  );
};

export default memo(PaymentStep);
