import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { product, quantity, selectedSize, selectedColor } = item;

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleRemove = useCallback(() => {
    removeFromCart(item.id);
  }, [item.id, removeFromCart]);

  const handleMoveToWishlist = useCallback(() => {
    if (!isWishlisted(product.id)) {
      toggle(product);
    }
    removeFromCart(item.id);
    toast.success('Moved to wishlist');
  }, [product, item.id, toggle, isWishlisted, removeFromCart]);

  return (
    <motion.div
      layout
      initial={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="border-b border-[#E8E8E8]"
    >
      <div className="flex gap-4 py-6 relative">
        {/* Product Image */}
        <Link
          to={`/product/${product.id}`}
          className="flex-shrink-0 w-[100px] h-[130px] bg-[#F8F8F6] rounded-md overflow-hidden"
        >
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-8">
          {/* Brand */}
          <p className="font-body text-[11px] uppercase text-[#999] tracking-[0.05em]">
            {product.brand}
          </p>

          {/* Name */}
          <Link to={`/product/${product.id}`}>
            <p className="font-body text-[15px] text-[#0A0A0A] font-medium mt-0.5 line-clamp-2 hover:underline">
              {product.name}
            </p>
          </Link>

          {/* Size & Color */}
          <p className="font-body text-[13px] text-[#999] mt-1">
            {selectedSize && `Size: ${selectedSize}`}
            {selectedSize && selectedColor && '  ·  '}
            {selectedColor && `Color: ${selectedColor.name || selectedColor}`}
          </p>

          {/* Price Row */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="font-mono text-[16px] font-bold text-[#0A0A0A]">
              {product.currency}{(product.price * quantity).toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="font-mono text-[14px] text-[#BBBBBB] line-through ml-1">
                  {product.currency}{(product.mrp * quantity).toLocaleString('en-IN')}
                </span>
                <span className="font-body text-[12px] text-[#FF3C78] ml-1">
                  ({discount}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-0 mt-3">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="w-7 h-7 flex items-center justify-center border border-[#E8E8E8] rounded-sm text-[#666] hover:border-[#999] hover:text-[#0A0A0A] transition-colors"
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-8 h-7 flex items-center justify-center font-mono text-[13px] font-medium text-[#0A0A0A] border-y border-[#E8E8E8]">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center border border-[#E8E8E8] rounded-sm text-[#666] hover:border-[#999] hover:text-[#0A0A0A] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Move to Wishlist */}
          <button
            onClick={handleMoveToWishlist}
            className="font-body text-[12px] text-[#555] mt-2.5 hover:underline hover:text-[#0A0A0A] transition-colors"
          >
            Move to Wishlist
          </button>
        </div>

        {/* Trash Icon (absolute right) */}
        <button
          onClick={handleRemove}
          className="absolute top-6 right-0 p-1.5 text-[#CCCCCC] hover:text-[#E53935] transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default memo(CartItem);
