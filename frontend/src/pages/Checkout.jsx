import React, { memo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

import AddressStep from '../components/Checkout/AddressStep';
import SummaryStep from '../components/Checkout/SummaryStep';
import PaymentStep from '../components/Checkout/PaymentStep';
import OrderSuccess from '../components/Checkout/OrderSuccess';

const steps = ['DELIVERY', 'SUMMARY', 'PAYMENT'];

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (items.length === 0 && currentStep < 4) {
      navigate('/cart');
    }
  }, [isAuthenticated, items.length, navigate, currentStep]);

  if (!isAuthenticated || (items.length === 0 && currentStep < 4)) {
    return null;
  }

  const handleNextStep = (data) => {
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      setOrderData({ addressId: selectedAddressId, ...data });
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3) {
      setOrderData((prev) => ({ ...prev, paymentMethod: data.method }));
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeInOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.25, ease: 'easeInOut' } }
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-white">
        <OrderSuccess orderData={orderData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Checkout Header */}
      <div className="border-b border-[#E8E8E8] bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 md:px-6 h-[70px] flex items-center justify-between">
          <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/cart')} className="font-body text-[13px] text-[#555] hover:text-[#0A0A0A] flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <Link to="/" className="font-heading text-[20px] font-bold tracking-[0.1em] uppercase text-[#0A0A0A]">
            VOGUE
          </Link>
          <div className="flex items-center gap-1.5 font-body text-[12px] text-[#555]">
            <Lock size={14} /> Secure
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 right-0 top-[6px] h-[1.5px] bg-[#E8E8E8] -z-10" />
          
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            
            return (
              <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors duration-300 ${isCompleted ? 'bg-[#0A0A0A]' : isCurrent ? 'bg-[#FF3C78]' : 'bg-[#E8E8E8]'}`}>
                  {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={`font-body text-[11px] uppercase tracking-[0.05em] font-medium transition-colors ${isCompleted ? 'text-[#0A0A0A]' : isCurrent ? 'text-[#FF3C78]' : 'text-[#999]'}`}>
                  {step}
                </span>
              </div>
            );
          })}
          
          {/* Active progress line overlay */}
          <div 
            className="absolute left-0 top-[6px] h-[1.5px] bg-[#0A0A0A] -z-10 transition-all duration-500 ease-in-out" 
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>

        {/* Step Content with Animation */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit">
              <AddressStep onNext={handleNextStep} selectedAddressId={selectedAddressId} setSelectedAddressId={setSelectedAddressId} />
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit">
              <SummaryStep onNext={handleNextStep} selectedAddressId={selectedAddressId} setStep={setCurrentStep} />
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit">
              <PaymentStep onNext={handleNextStep} finalTotal={orderData?.finalTotal} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(Checkout);
