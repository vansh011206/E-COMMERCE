import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check, Star } from 'lucide-react';
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
  const wishlisted = isWishlisted(product._id || product.id);

  const [justAdded, setJustAdded] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const handleCardClick = useCallback(() => {
    addToViewHistory(product._id || product.id);
    navigate(`/product/${product._id || product.id}`);
  }, [product._id, product.id, navigate, addToViewHistory]);

  const handleWishlist = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await toggle(product);
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 300);
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
    }
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
      className="group h-full flex flex-col bg-background-primary cursor-pointer transition-all duration-300"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Image Section ── */}
      <div className="relative overflow-hidden bg-background-secondary aspect-[3/4] rounded-[4px] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay gradient on hover for better text contrast if needed */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {showDiscount && (
            <span className="bg-white/95 backdrop-blur-sm text-text-primary text-[10px] font-heading font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm">
              -{product.discount}%
            </span>
          )}
          {showNew && (
            <span className="bg-accent-primary text-white text-[10px] font-heading font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-[34px] h-[34px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
          aria-label="Toggle wishlist"
          style={{ transform: heartPop ? 'scale(1.2)' : '' }}
        >
          <Heart
            size={16}
            strokeWidth={wishlisted ? 2 : 1.5}
            className={wishlisted ? 'fill-accent-primary text-accent-primary' : 'text-text-primary'}
          />
        </button>

        {/* Add to Bag Overlay Button */}
        <button
          onClick={handleAddToBag}
          className={`absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center gap-2 text-white text-[12px] font-heading font-medium uppercase tracking-widest z-10 transition-all duration-300 ease-out translate-y-full group-hover:translate-y-0 ${
            justAdded ? 'bg-accent-primary' : 'bg-accent-primary/95 hover:bg-accent-primary backdrop-blur-sm'
          }`}
        >
          {justAdded ? (
            <>
              <Check size={16} />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              <span>Quick Add</span>
            </>
          )}
        </button>
      </div>

      {/* ── Text Section ── */}
      <div className="flex-1 flex flex-col pt-3.5 pb-2 px-1">
        {/* Brand & Rating Row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="font-heading font-semibold text-[13px] text-text-primary uppercase tracking-wider truncate">
            {product.brand}
          </p>
          
          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <span className="text-text-primary text-[11px] font-medium leading-none flex items-center gap-0.5">
                {product.rating}
                <Star className="w-3 h-3 fill-current mb-[1px]" />
              </span>
              <span className="text-text-muted text-[10px]">
                ({product.reviewCount >= 1000 ? `${(product.reviewCount / 1000).toFixed(1)}K` : product.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <p className="font-body text-[14px] text-text-secondary leading-snug line-clamp-1 mb-2.5">
          {product.name}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          {/* Price Row */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-[16px] font-medium text-text-primary">
              {product.currency}{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="font-mono text-[13px] text-text-muted line-through">
                  {product.currency}{product.mrp.toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>

          {/* Deal Stock Indicator */}
          {showDealBadge && product.stock < 50 && (
            <div className="mt-1.5">
              <p className="font-body text-[11px] text-[#FF4747] font-medium mb-1.5 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4747] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4747]"></span>
                </span>
                Only {product.stock} left
              </p>
              <div className="w-full h-[3px] bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF4747] rounded-full transition-all duration-500"
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
