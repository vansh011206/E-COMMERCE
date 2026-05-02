import React, { memo } from 'react';

const SkeletonCard = () => (
  <div className="bg-white border border-[#EFEFED] rounded-md overflow-hidden">
    {/* Image area */}
    <div className="aspect-[3/4] bg-[#F2F2F0] skeleton-shimmer rounded-t-md" />

    {/* Text area */}
    <div className="px-3 pt-3 pb-4 flex flex-col gap-2">
      <div className="w-[40%] h-[10px] bg-[#EBEBEB] rounded skeleton-shimmer" />
      <div className="w-[85%] h-[14px] bg-[#EBEBEB] rounded skeleton-shimmer" />
      <div className="w-[70%] h-[14px] bg-[#EBEBEB] rounded skeleton-shimmer" />
      <div className="w-[60%] h-[15px] bg-[#EBEBEB] rounded skeleton-shimmer" />
      <div className="w-[45%] h-[12px] bg-[#EBEBEB] rounded skeleton-shimmer" />
    </div>
  </div>
);

export default memo(SkeletonCard);
