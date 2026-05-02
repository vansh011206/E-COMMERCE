import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-lg shadow-sm px-3 py-2">
      <p className="font-body text-[13px] text-[#0A0A0A]">
        <span style={{ color: d.payload.color }} className="font-bold mr-1">•</span>
        {d.name}: <span className="font-mono font-bold">{d.value}</span>
      </p>
    </div>
  );
};

const OrderStatusPie = () => {
  const { dashboardStats } = useAdminStore();
  const rawData = dashboardStats.orderStatusData || [];
  
  // Apply grayscale colors + accent for largest
  let maxIndex = 0;
  let maxVal = -1;
  rawData.forEach((d, i) => {
    if (d.value > maxVal) {
      maxVal = d.value;
      maxIndex = i;
    }
  });

  const getGrayscaleColor = (name) => {
    const n = name.toUpperCase();
    if (n.includes('PENDING')) return '#D4D4D4';
    if (n.includes('PROCESS') || n.includes('PACK') || n.includes('DISPATCH') || n.includes('SHIP')) return '#A3A3A3';
    if (n.includes('DELIVER')) return '#0A0A0A';
    if (n.includes('CANCEL') || n.includes('RETURN')) return '#E8E8E8';
    return '#CCCCCC';
  };

  const data = rawData.map((d, i) => ({
    ...d,
    color: i === maxIndex ? '#FF3C78' : getGrayscaleColor(d.name)
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="bg-white border border-[#E8E8E8] rounded-[14px] p-7 h-full flex flex-col"
    >
      <h3 className="font-heading text-[20px] text-[#0A0A0A] mb-4">
        Order Status
      </h3>

      <div className="relative h-[200px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
          <p className="font-mono text-[28px] text-[#0A0A0A] font-bold leading-none">{total}</p>
          <p className="font-body text-[12px] text-[#999999] mt-1">Total</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-auto pt-6">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="font-body text-[13px] text-[#555555] flex-1 truncate">{d.name}</span>
            <span className="font-mono text-[13px] text-[#0A0A0A]">{d.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderStatusPie;
