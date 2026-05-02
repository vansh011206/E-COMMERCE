import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = (s) => {
    switch (s.toUpperCase()) {
      case 'PENDING':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'CONFIRMED':
        return 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]';
      case 'PACKED':
        return 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]';
      case 'DISPATCHED':
        return 'bg-[#FED7AA] text-[#9A3412] border-[#FDBA74]';
      case 'SHIPPED':
        return 'bg-[#CFFAFE] text-[#155E75] border-[#A5F3FC]';
      case 'OUT FOR DELIVERY':
      case 'DELIVERED':
        return 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]';
      case 'CANCELLED':
      case 'RETURNED':
        return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
      default:
        return 'bg-[#F5F5F3] text-[#555555] border-[#E8E8E8]';
    }
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.08em] border ${getStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
