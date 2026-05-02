import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';

const TopProducts = () => {
  const navigate = useNavigate();
  const { dashboardStats } = useAdminStore();
  const topProducts = (dashboardStats.topProducts || []).slice(0, 5);
  const maxOrders = topProducts.length > 0 ? topProducts[0].orderCount : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="bg-[#FFFFFF] border border-[#E8E8E8] rounded-[14px]"
    >
      <div className="flex items-center justify-between px-7 py-6">
        <h3 className="font-heading text-[20px] text-[#0A0A0A] font-bold">Top Products</h3>
        <button onClick={() => navigate('/admin/products')} className="font-body text-[13px] text-[#FF3C78] hover:underline font-medium">
          View all →
        </button>
      </div>

      <div className="px-7 pb-2">
        {topProducts.map((item, i) => (
          <div
            key={item.product?.id || i}
            className="flex flex-col justify-center border-b border-[#F0F0F0] last:border-0"
            style={{ minHeight: '72px' }}
          >
            <div className="flex items-center gap-4 py-3">
              <span className={`font-mono text-[16px] w-6 shrink-0 text-center ${i === 0 ? 'text-[#0A0A0A] font-bold' : 'text-[#CCCCCC] font-medium'}`}>
                #{i + 1}
              </span>

              <div className="w-[44px] h-[56px] rounded-md overflow-hidden bg-[#F5F5F3] shrink-0">
                {item.product?.image && (
                  <img src={item.product.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-body text-[14px] text-[#0A0A0A] font-medium truncate">{item.product?.name || 'Unknown'}</p>
                <p className="font-body text-[12px] text-[#999999] truncate">{item.product?.brand || 'Generic'} · {item.product?.category || 'General'}</p>
                <div className="w-full h-[3px] rounded-full mt-2 bg-[#F0F0F0]">
                  <div className="h-full rounded-full bg-[#0A0A0A]" style={{ width: `${(item.orderCount / maxOrders) * 100}%` }} />
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-mono text-[14px] text-[#0A0A0A]">{item.orderCount} sold</p>
                <p className="font-mono text-[14px] text-[#555555]">₹{(item.totalRevenue || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        ))}

        {topProducts.length === 0 && (
          <p className="py-8 text-center font-body text-[13px] text-[#999999]">No data available yet</p>
        )}
      </div>
    </motion.div>
  );
};

export default TopProducts;
