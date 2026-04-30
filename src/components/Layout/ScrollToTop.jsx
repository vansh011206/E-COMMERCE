import React, { useState, useEffect, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          onClick={scrollUp}
          className="fixed bottom-6 right-6 md:bottom-6 md:right-6 z-40 w-11 h-11 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-[#333] transition-colors duration-200 mb-14 md:mb-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default memo(ScrollToTop);
