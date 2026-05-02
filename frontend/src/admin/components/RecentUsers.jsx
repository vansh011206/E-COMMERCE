import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useAdminStore } from '../store/adminStore';

const RecentUsers = () => {
  const navigate = useNavigate();
  const { dashboardStats } = useAdminStore();
  const recentUsers = (dashboardStats?.recentUsers || []).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-[#FFFFFF] border border-[#E8E8E8] rounded-[14px]"
    >
      <div className="flex items-center justify-between px-7 py-6">
        <h3 className="font-heading text-[20px] text-[#0A0A0A] font-bold">New Users</h3>
        <button onClick={() => navigate('/admin/users')} className="font-body text-[13px] text-[#FF3C78] hover:underline font-medium">
          View all →
        </button>
      </div>

      <div className="px-7 pb-2">
        {recentUsers.map((user, i) => {
          const joinedDate = new Date(user.createdAt || user.joinedAt || Date.now());
          return (
            <div
              key={user.email || i}
              className="flex items-center gap-4 border-b border-[#F0F0F0] last:border-0 py-3"
              style={{ minHeight: '72px' }}
            >
              <div className="w-[36px] h-[36px] rounded-full bg-[#F5F5F3] flex items-center justify-center shrink-0">
                <span className="font-body text-[14px] text-[#555555] font-medium">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-body text-[14px] text-[#0A0A0A] font-medium truncate">{user.name}</p>
                <p className="font-body text-[12px] text-[#999999] truncate mt-0.5">{user.email}</p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <p className="font-body text-[12px] text-[#CCCCCC]">
                  {formatDistanceToNow(joinedDate, { addSuffix: true })}
                </p>
                <div className="bg-[#F5F5F3] px-2.5 py-0.5 rounded-full">
                  <span className="font-body text-[11px] text-[#555555]">
                    {user.totalOrders || 0} orders
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {recentUsers.length === 0 && (
          <p className="py-8 text-center font-body text-[13px] text-[#999999]">No users registered yet</p>
        )}
      </div>
    </motion.div>
  );
};

export default RecentUsers;
