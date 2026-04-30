import React, { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/Product/ProductCard';
import Footer from '../components/Layout/Footer';

const SizeModal = ({ product, onClose, onSelect }) => {
  const sizes = product.sizes || [];
  const available = product.sizesAvailable || {};
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-[320px] shadow-xl">
        <h3 className="font-heading text-[16px] text-[#0A0A0A] font-semibold mb-4">Select Size</h3>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {sizes.map((s) => (
            <button key={s} disabled={!available[s]} onClick={() => onSelect(s)} className={`h-10 border rounded-md font-body text-[13px] font-medium transition-all ${available[s] ? 'border-[#E8E8E8] text-[#0A0A0A] hover:border-[#0A0A0A] hover:bg-[#F8F8F6]' : 'border-[#F0F0F0] text-[#CCC] cursor-not-allowed line-through'}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-2.5 font-body text-[13px] text-[#999] hover:text-[#0A0A0A] transition-colors">Cancel</button>
      </motion.div>
    </motion.div>
  );
};

const WishlistCard = ({ product }) => {
  const { toggle } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const handleMoveToBag = useCallback(() => {
    if (product.sizes && product.sizes.length > 0) {
      setShowSizeModal(true);
    } else {
      addToCart(product, 'One Size', product.colors?.[0]);
      toggle(product);
      toast.success('Moved to bag!');
    }
  }, [product, addToCart, toggle]);

  const handleSizeSelect = useCallback((size) => {
    addToCart(product, size, product.colors?.[0]);
    toggle(product);
    setShowSizeModal(false);
    toast.success('Moved to bag!');
  }, [product, addToCart, toggle]);

  return (
    <>
      <div>
        <ProductCard product={product} />
        <button onClick={handleMoveToBag} className="w-full mt-[-1px] py-2.5 bg-[#F8F8F8] border border-[#E8E8E8] font-body text-[12px] uppercase tracking-[0.05em] text-[#0A0A0A] font-medium hover:border-[#0A0A0A] transition-colors rounded-b-md">
          Move to Bag
        </button>
      </div>
      <AnimatePresence>
        {showSizeModal && <SizeModal product={product} onClose={() => setShowSizeModal(false)} onSelect={handleSizeSelect} />}
      </AnimatePresence>
    </>
  );
};

const Wishlist = () => {
  const { items, clear } = useWishlistStore();

  if (items.length === 0) {
    return (
      <>
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Heart size={64} className="text-[#CCCCCC] mb-5" strokeWidth={1.2} />
          <h2 className="font-heading text-[24px] text-[#0A0A0A] mb-2">Your wishlist is empty</h2>
          <p className="font-body text-[14px] text-[#999] mb-8 max-w-xs">Save your favourite items to wishlist</p>
          <Link to="/shop" className="bg-[#0A0A0A] text-white font-body text-[13px] uppercase tracking-wider font-medium hover:bg-[#333] transition-colors" style={{ padding: '14px 40px', borderRadius: 4 }}>
            Start Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-[20px] uppercase tracking-[0.04em] text-[#0A0A0A] font-bold">
            My Wishlist <span className="font-body text-[14px] text-[#999] font-normal normal-case">({items.length} items)</span>
          </h1>
          <button onClick={clear} className="font-body text-[12px] text-[#999] hover:text-black transition-colors">Clear All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((product) => (
            <WishlistCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default memo(Wishlist);
