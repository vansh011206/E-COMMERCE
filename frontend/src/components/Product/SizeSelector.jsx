import React, { useState, memo } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const SizeSelector = ({ sizes, sizesAvailable, selectedSize, onSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  // Triggered externally when trying to add to bag without size
  const triggerError = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };

  return (
    <>
      <div className="mt-8 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading text-[11px] uppercase tracking-wider text-[#0A0A0A] font-semibold">
            Select Size
          </span>
          <button 
            onClick={() => setShowModal(true)}
            className="font-body text-[12px] text-[#FF3C78] underline hover:text-black transition-colors"
          >
            Size Guide
          </button>
        </div>

        <div className={`flex flex-wrap gap-2 ${errorShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          {sizes.map((size) => {
            const available = sizesAvailable?.[size] !== false;
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                disabled={!available}
                onClick={() => onSelect(size)}
                title={!available ? 'Out of stock' : ''}
                className={`relative min-w-[52px] h-[44px] px-2 rounded-[4px] border-[1.5px] font-mono text-[13px] font-medium transition-all duration-150 flex items-center justify-center overflow-hidden
                  ${!available 
                    ? 'border-[#E8E8E8] text-[#CCC] cursor-not-allowed bg-white' 
                    : isSelected 
                      ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white' 
                      : 'border-[#E8E8E8] text-[#555] bg-white hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
                  }`}
              >
                {size}
                {/* Out of stock diagonal line */}
                {!available && (
                  <div className="absolute inset-0 w-full h-[1.5px] bg-[#E8E8E8] origin-top-left rotate-[35deg] pointer-events-none" style={{ top: '0', left: '0', width: '150%' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              <div className="p-6 pb-0 flex justify-between items-center mb-6">
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-[#0A0A0A]">Size Guide</h3>
                <button onClick={() => setShowModal(false)} className="text-[#999] hover:text-black transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 pb-8 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#E8E8E8]">
                      <th className="py-3 px-2 font-body text-[12px] text-[#999] font-medium">Size</th>
                      <th className="py-3 px-2 font-body text-[12px] text-[#999] font-medium">Chest (in)</th>
                      <th className="py-3 px-2 font-body text-[12px] text-[#999] font-medium">Waist (in)</th>
                      <th className="py-3 px-2 font-body text-[12px] text-[#999] font-medium">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[13px] text-[#333]">
                    <tr className="border-b border-[#F0F0F0]">
                      <td className="py-3 px-2 font-bold text-black">S</td><td className="py-3 px-2">38</td><td className="py-3 px-2">36</td><td className="py-3 px-2">27</td>
                    </tr>
                    <tr className="border-b border-[#F0F0F0]">
                      <td className="py-3 px-2 font-bold text-black">M</td><td className="py-3 px-2">40</td><td className="py-3 px-2">38</td><td className="py-3 px-2">28</td>
                    </tr>
                    <tr className="border-b border-[#F0F0F0]">
                      <td className="py-3 px-2 font-bold text-black">L</td><td className="py-3 px-2">42</td><td className="py-3 px-2">40</td><td className="py-3 px-2">29</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-bold text-black">XL</td><td className="py-3 px-2">44</td><td className="py-3 px-2">42</td><td className="py-3 px-2">30</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-4 font-body text-[11px] text-[#999] italic">Measurements may vary by 0.5 inches due to manual measurement.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </>
  );
};

export default memo(SizeSelector);
