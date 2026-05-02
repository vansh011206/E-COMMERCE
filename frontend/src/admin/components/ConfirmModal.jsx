import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'danger', requireInput = false }) => {
  const [inputValue, setInputValue] = useState('');

  const colors = {
    danger: { btn: '#F85149', btnHover: '#da3633', icon: '#F85149' },
    warning: { btn: '#D29922', btnHover: '#b8860b', icon: '#D29922' }
  };
  const c = colors[type] || colors.danger;

  const canConfirm = requireInput ? inputValue === 'DELETE' : true;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm();
    setInputValue('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[440px] rounded-xl border overflow-hidden"
            style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${c.icon}15` }}>
                  <AlertTriangle size={20} style={{ color: c.icon }} />
                </div>
                <h3 className="font-heading text-[18px] text-[#0A0A0A] font-bold">{title}</h3>
                <button onClick={onClose} className="ml-auto text-[#888888] hover:text-[#0A0A0A] transition-colors">
                  <X size={18} />
                </button>
              </div>

              <p className="font-body text-[14px] text-[#555555] leading-relaxed mb-4">{message}</p>

              {requireInput && (
                <div className="mb-4">
                  <p className="font-body text-[12px] text-[#555555] mb-2">
                    Type <span className="font-mono text-[#F85149] font-bold">DELETE</span> to confirm
                  </p>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full h-[40px] px-3 rounded-lg border font-mono text-[14px] text-[#0A0A0A] outline-none transition-colors"
                    style={{ background: '#F9FAFB', borderColor: inputValue === 'DELETE' ? '#3FB950' : '#E5E7EB' }}
                    placeholder="Type DELETE here"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={onClose}
                className="flex-1 h-[40px] rounded-lg border font-body text-[13px] text-[#555555] hover:text-[#0A0A0A] hover:border-[#999999] transition-colors"
                style={{ borderColor: '#E5E7EB' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="flex-1 h-[40px] rounded-lg font-body text-[13px] text-[#0A0A0A] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: canConfirm ? c.btn : '#F3F4F6' }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
