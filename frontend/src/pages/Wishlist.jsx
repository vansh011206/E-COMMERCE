import React, { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import Footer from '../components/Layout/Footer';

const SizeModal = ({ product, onClose, onSelect }) => {
  const sizes = product.sizes || [];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-7 w-full max-w-[360px] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-[18px] text-[#0A0A0A] font-bold">Select Size</h3>
          <button onClick={onClose} className="text-[#999] hover:text-[#0A0A0A] transition-colors">
            <Heart size={20} className="rotate-45" /> {/* Close icon substitute */}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {sizes.map((s) => (
            <button key={s} onClick={() => onSelect(s)} className="h-12 border border-[#E8E8E8] rounded-xl font-body text-[14px] font-semibold text-[#0A0A0A] hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-200">
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-[#E8E8E8] font-body text-[14px] font-medium text-[#555] hover:bg-[#F8F8F8] transition-colors">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WishlistCard = ({ product }) => {
  const toggle = useWishlistStore((s) => s.toggle);
  const addToCart = useCartStore((s) => s.addToCart);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const handleMoveToBag = useCallback(async () => {
    if (product.sizes && product.sizes.length > 0) {
      setShowSizeModal(true);
    } else {
      addToCart(product, 'One Size', product.colors?.[0]);
      await toggle(product);
      toast.success('Moved to bag!');
    }
  }, [product, addToCart, toggle]);

  const handleSizeSelect = useCallback(async (size) => {
    addToCart(product, size, product.colors?.[0]);
    await toggle(product);
    setShowSizeModal(false);
    toast.success('Moved to bag!');
  }, [product, addToCart, toggle]);

  const handleRemove = useCallback(async () => {
    try {
      await toggle(product);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  }, [product, toggle]);

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="group bg-white border border-[#F0F0F0] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F9F9]">
        <Link to={`/product/${product._id || product.id}`}>
          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </Link>
        <button onClick={handleRemove} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-[#E53935] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#E53935] hover:text-white">
          <Trash2 size={14} />
        </button>
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#FF3C78] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            {product.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-heading text-[14px] text-[#0A0A0A] font-semibold line-clamp-1 mb-1">{product.name}</h3>
          <p className="font-body text-[12px] text-[#999] line-clamp-1">{product.brand}</p>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-heading text-[15px] text-[#0A0A0A] font-bold">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="font-body text-[13px] text-[#CCC] line-through">₹{product.mrp}</span>
          )}
        </div>
        <button onClick={handleMoveToBag} className="w-full py-3 bg-[#0A0A0A] text-white rounded-xl font-body text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-[#333] transition-all flex items-center justify-center gap-2 group/btn">
          <span>Move to Bag</span>
          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
      <AnimatePresence>
        {showSizeModal && <SizeModal product={product} onClose={() => setShowSizeModal(false)} onSelect={handleSizeSelect} />}
      </AnimatePresence>
    </motion.div>
  );
};

const Wishlist = () => {
  const wishlist = useAuthStore((s) => s.wishlist) || [];

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-24 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-24 h-24 bg-[#F8F8F8] rounded-full flex items-center justify-center mb-8">
            <Heart size={40} className="text-[#DDD]" strokeWidth={1.5} />
          </motion.div>
          <h2 className="font-heading text-[28px] text-[#0A0A0A] font-bold mb-3">Wishlist is empty</h2>
          <p className="font-body text-[16px] text-[#555] mb-10 max-w-sm leading-relaxed">
            Looks like you haven't added anything to your wishlist yet. Explore our latest collection!
          </p>
          <Link to="/shop" className="group flex items-center gap-2 px-10 py-4 bg-[#0A0A0A] text-white rounded-full font-body text-[14px] font-bold uppercase tracking-wider hover:bg-[#333] transition-all shadow-lg hover:shadow-xl">
            Start Shopping
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-heading text-[28px] text-[#0A0A0A] font-bold mb-1">My Wishlist</h1>
            <p className="font-body text-[14px] text-[#555]">
              You have <span className="font-bold text-[#0A0A0A]">{wishlist.length}</span> {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div className="h-px bg-[#EEE] flex-1 md:mx-10" />
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {wishlist.map((product) => (
              <WishlistCard key={product._id || product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default memo(Wishlist);
