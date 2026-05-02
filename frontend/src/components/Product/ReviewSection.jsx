import React, { memo } from 'react';
import { Star, ThumbsUp, CheckCircle2 } from 'lucide-react';

const ReviewSection = ({ product }) => {
  if (!product.reviews || product.reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-body text-[14px] text-[#555] mb-4">No reviews yet for this product.</p>
        <button className="border border-[#0A0A0A] text-[#0A0A0A] px-6 py-2.5 font-heading text-[13px] uppercase tracking-wider font-semibold rounded hover:bg-[#FAFAFA] transition-colors">
          Write a Review
        </button>
      </div>
    );
  }

  // Calculate rating distribution
  const totalReviews = product.reviews.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  product.reviews.forEach(r => {
    if (distribution[Math.floor(r.rating)] !== undefined) {
      distribution[Math.floor(r.rating)]++;
    }
  });

  return (
    <div className="py-4">
      {/* Summary Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10 border-b border-[#E8E8E8] pb-10">
        
        {/* Left: Overall Rating */}
        <div className="flex flex-col items-center md:items-start md:w-1/3">
          <div className="flex items-end gap-2 mb-2">
            <span className="font-mono text-[56px] font-bold text-[#0A0A0A] leading-none">{product.rating}</span>
            <span className="font-body text-[14px] text-[#999] mb-2">out of 5</span>
          </div>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className={`${i < Math.floor(product.rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-[#E8E8E8] text-[#E8E8E8]'}`} />
            ))}
          </div>
          <p className="font-body text-[13px] text-[#555]">
            {product.reviewCount?.toLocaleString() || totalReviews} Ratings · {totalReviews} Reviews
          </p>
        </div>

        {/* Right: Rating Bars */}
        <div className="w-full md:w-2/3 flex flex-col gap-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars];
            const percentage = Math.round((count / totalReviews) * 100) || 0;
            return (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8 text-right font-body text-[13px] text-[#555]">
                  {stars} <Star size={10} className="fill-[#999] text-[#999] -mt-0.5" />
                </div>
                <div className="flex-1 h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#FF3C78] to-[#7B61FF]" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-8 font-mono text-[12px] text-[#999] text-right">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-[14px] uppercase tracking-wider text-[#0A0A0A] font-bold">Customer Reviews ({totalReviews})</h3>
          <button className="font-body text-[13px] text-[#0A0A0A] underline hover:text-[#555]">Write a Review</button>
        </div>

        <div className="space-y-0">
          {product.reviews.map((review) => (
            <div key={review.id} className="border-b border-[#E8E8E8] py-6 last:border-0">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={`${i < Math.floor(review.rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-[#E8E8E8] text-[#E8E8E8]'}`} />
                ))}
              </div>
              
              <p className="font-body text-[14px] text-[#333] leading-[1.6] mb-3">
                {review.comment}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="font-body text-[13px] font-semibold text-[#0A0A0A]">{review.userName}</div>
                {review.verified && (
                  <div className="flex items-center gap-1 bg-[#E8F5E9] text-[#00A86B] px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                    <CheckCircle2 size={10} /> Verified Purchase
                  </div>
                )}
                <div className="font-body text-[12px] text-[#999]">{review.date}</div>
                
                <div className="flex-1 min-w-[20px]" /> {/* Spacer */}
                
                <button className="flex items-center gap-1.5 font-body text-[12px] text-[#999] hover:text-[#0A0A0A] transition-colors">
                  <ThumbsUp size={14} /> Helpful ({review.helpful || 0})
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalReviews > 3 && (
          <div className="mt-8 text-center">
            <button className="border border-[#E8E8E8] text-[#555] px-6 py-2.5 font-heading text-[13px] uppercase tracking-wider font-semibold rounded hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors">
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ReviewSection);
