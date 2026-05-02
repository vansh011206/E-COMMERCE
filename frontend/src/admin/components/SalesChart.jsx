import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-lg shadow-md p-3">
      <p className="font-body text-[12px] text-[#999999] mb-1">{label}</p>
      <p className="font-mono text-[14px] text-[#0A0A0A] font-bold">
        Revenue: ₹{(data.revenue || 0).toLocaleString('en-IN')}
      </p>
      <p className="font-body text-[13px] text-[#555555]">
        Orders: {data.orders || 0}
      </p>
    </div>
  );
};

const SalesChart = () => {
  const { dashboardStats } = useAdminStore();
  const [period, setPeriod] = useState(30);
  const data = (dashboardStats?.revenueChartData || []).slice(-period);
  const totalRevenue = data.reduce((s, d) => s + (d.revenue || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white border border-[#E8E8E8] rounded-[14px] p-7"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-heading text-[20px] text-[#0A0A0A]">Revenue Overview</h3>
        <div className="flex gap-1">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`h-[36px] px-4 rounded-full font-body text-[13px] transition-all border ${
                period === d 
                  ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' 
                  : 'bg-white text-[#555555] border-[#E8E8E8] hover:bg-[#FAFAFA]'
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="font-mono text-[28px] text-[#0A0A0A] font-bold">
          ₹{totalRevenue.toLocaleString('en-IN')}
        </p>
        <p className="font-body text-[13px] text-[#999]">
          Last {period} days
        </p>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradientBW" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0A0A0A" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#0A0A0A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F0F0F0" strokeDasharray="4 4" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#999999', fontSize: 11, fontFamily: 'Outfit' }} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            <YAxis 
              tick={{ fill: '#999999', fontSize: 11, fontFamily: 'Outfit' }} 
              axisLine={false} 
              tickLine={false}
              dx={-10}
              tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E8E8E8', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0A0A0A"
              strokeWidth={2}
              fill="url(#revenueGradientBW)"
              activeDot={{ r: 5, stroke: '#0A0A0A', strokeWidth: 2, fill: 'white' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesChart;
