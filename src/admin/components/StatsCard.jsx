import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const AnimatedCounter = ({ value, isCurrency = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500; // 1.5s
    const target = value || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  const formatted = count.toLocaleString('en-IN');
  return <>{isCurrency ? `₹${formatted}` : formatted}</>;
};

const StatsCard = ({ title, value, change, changeType, icon: Icon, bottomContent, isCurrency, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
      className="bg-[#FFFFFF] border border-[#E8E8E8] rounded-[14px] p-7 hover:border-[#CCCCCC] hover:shadow-md transition-all duration-200"
    >
      <div className="w-9 h-9 rounded-full bg-[#F5F5F3] flex items-center justify-center">
        <Icon size={18} className="text-[#0A0A0A]" />
      </div>

      <p className="font-body text-[14px] text-[#999999] mt-4">{title}</p>
      
      <p className="font-mono text-[36px] text-[#0A0A0A] font-bold mt-1">
        <AnimatedCounter value={value} isCurrency={isCurrency} />
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          {changeType === 'up' ? (
            <TrendingUp size={14} className="text-[#10B981]" />
          ) : (
            <TrendingDown size={14} className="text-[#EF4444]" />
          )}
          <span className={`font-body text-[13px] ${changeType === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="font-body text-[13px] text-[#999999] ml-1">vs prev. period</span>
        </div>
      )}

      {bottomContent && (
        <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
          {bottomContent}
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
