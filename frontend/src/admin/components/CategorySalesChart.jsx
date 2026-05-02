import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';

const COLORS = ['#FF3C78', '#7B61FF', '#3FB950', '#58A6FF', '#F0883E', '#D29922'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-lg border px-3 py-2" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
      <p className="font-body text-[12px] text-[#0A0A0A]">{d?.category}</p>
      <p className="font-mono text-[12px] text-[#555555]">Sales: {d?.sales} items</p>
      <p className="font-mono text-[12px] text-[#3FB950]">Revenue: ₹{(d?.revenue || 0).toLocaleString('en-IN')}</p>
    </div>
  );
};

const CategorySalesChart = () => {
  const { dashboardStats } = useAdminStore();
  const data = [...(dashboardStats.categoryData || [])].sort((a, b) => b.revenue - a.revenue);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="rounded-xl border p-6"
      style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      <h3 className="font-heading text-[14px] text-[#0A0A0A] font-bold uppercase tracking-wider mb-1">
        Sales by Category
      </h3>
      <p className="font-body text-[12px] text-[#555555] mb-4">Revenue breakdown</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" barSize={16}>
          <CartesianGrid stroke="#F3F4F6" strokeDasharray="4 4" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`} />
          <YAxis type="category" dataKey="category" width={70} tick={{ fill: '#555555', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CategorySalesChart;
