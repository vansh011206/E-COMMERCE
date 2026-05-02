import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useProductStore } from '../../store/productStore';

const ProductCard = ({ product, showDealBadge = false }) => {
  const navigate = useNavigate();
  const { toggle, isWishlisted } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const addToViewHistory = useProductStore((s) => s.addToViewHistory);
  const wishlisted = isWishlisted(product.id);

  const [justAdded, setJustAdded] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const handleCardClick = useCallback(() => {
    addToViewHistory(product.id);
    navigate(`/product/${product.id}`);
  }, [product.id, navigate, addToViewHistory]);

  const handleWishlist = useCallback((e) => {
    e.stopPropagation();
    toggle(product);
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 300);
  }, [product, toggle]);

  const handleAddToBag = useCallback((e) => {
    e.stopPropagation();
    if (justAdded) return;
    addToCart(product, 'M', product.colors?.[0]);
    toast.success('Added to bag! ✓');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }, [product, addToCart, justAdded]);

  const showDiscount = product.discount > 0;
  const showNew = product.isNewArrival && !showDiscount;

  return (
    <motion.div
      className="group h-full flex flex-col bg-white border border-[#EFEFED] rounded-md overflow-hidden cursor-pointer hover:border-[#E0E0E0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] transition-all duration-200"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* ── Image Section ── */}
      <div className="relative overflow-hidden bg-[#F2F2F0] aspect-[3/4]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Discount Badge */}
        {showDealBadge && showDiscount && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-black text-white text-[11px] font-body font-semibold px-2 py-[3px] rounded-[3px]">
            -{product.discount}%
          </span>
        )}
        {!showDealBadge && showDiscount && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-black text-white text-[11px] font-body font-semibold px-2 py-[3px] rounded-[3px]">
            -{product.discount}%
          </span>
        )}

        {/* New Badge */}
        {showNew && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#0A0A0A] text-white text-[10px] font-body font-semibold uppercase tracking-wider px-2 py-[3px] rounded-[3px]">
            New
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-150"
          aria-label="Toggle wishlist"
          style={{ transform: heartPop ? 'scale(1.25)' : 'scale(1)', transition: 'transform 250ms ease-out' }}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={wishlisted ? 'fill-black text-black' : 'text-[#999]'}
          />
        </button>

        {/* Add to Bag Overlay */}
        <button
          onClick={handleAddToBag}
          className={`absolute bottom-0 left-0 right-0 h-[42px] flex items-center justify-center gap-2 text-white text-[12px] font-body uppercase tracking-[0.1em] z-10 transition-all duration-200 ease-out md:translate-y-full md:group-hover:translate-y-0 ${
            justAdded ? 'bg-[#00D68F]' : 'bg-[#0A0A0A]/88'
          }`}
        >
          {justAdded ? (
            <>
              <Check size={14} />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>

      {/* ── Text Section ── */}
      <div className="flex-1 flex flex-col px-3 pt-2.5 pb-3">
        {/* Brand */}
        <p className="font-body text-[11px] text-[#999] uppercase tracking-[0.06em] truncate">
          {product.brand}
        </p>

        {/* Name */}
        <p className="font-body text-[14px] text-[#0A0A0A] mt-[3px] leading-[1.4] line-clamp-2 mb-2">
          {product.name}
        </p>

        <div className="mt-auto flex flex-col gap-1.5">
          {/* Price Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[15px] font-semibold text-[#0A0A0A]">
            {product.currency}{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <>
              <span className="font-mono text-[13px] text-[#BBB] line-through">
                {product.currency}{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="font-body text-[12px] text-[#FF4747]">
                ({product.discount}% OFF)
              </span>
            </>
          )}
        </div>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[#F59E0B] text-[12px]">★</span>
            <span className="font-body text-[12px] text-[#999]">
              {product.rating}
            </span>
            <span className="text-[#DDD] text-[10px] mx-0.5">|</span>
            <span className="font-body text-[12px] text-[#999]">
              {product.reviewCount >= 1000
                ? `${(product.reviewCount / 1000).toFixed(1)}K`
                : product.reviewCount}
            </span>
          </div>
        )}

        {/* Deal Stock Indicator */}
        {showDealBadge && product.stock < 50 && (
          <div className="mt-1">
            <p className="font-body text-[11px] text-[#333] font-medium mb-1">🔥 Only {product.stock} left</p>
            <div className="w-full h-[3px] bg-[#E8E8E8] rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full"
                style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);






