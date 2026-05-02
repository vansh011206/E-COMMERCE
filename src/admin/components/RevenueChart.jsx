import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
      <p className="font-body text-[12px] text-[#555555] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono text-[12px]" style={{ color: p.color }}>
          {p.name}: ₹{(p.value || 0).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

const RevenueChart = () => {
  const { dashboardStats } = useAdminStore();
  const data = dashboardStats.weeklyData || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl border p-6"
      style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      <h3 className="font-heading text-[14px] text-[#0A0A0A] font-bold uppercase tracking-wider mb-1">
        This Week vs Last Week
      </h3>
      <p className="font-body text-[12px] text-[#555555] mb-4">Revenue comparison</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid stroke="#F3F4F6" strokeDasharray="4 4" />
          <XAxis dataKey="day" tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="thisWeek" name="This Week" fill="#FF3C78" radius={[3, 3, 0, 0]} barSize={14} />
          <Bar dataKey="lastWeek" name="Last Week" fill="rgba(123,97,255,0.4)" radius={[3, 3, 0, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default RevenueChart;
