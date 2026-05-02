import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import Footer from '../components/Layout/Footer';

const Cart = () => {
  const { items, getCount, clearCart } = useCartStore();
  const count = getCount();

  if (items.length === 0) {
    return (
      <>
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <ShoppingBag size={64} className="text-[#CCCCCC] mb-5" strokeWidth={1.2} />
          <h2 className="font-heading text-[24px] text-[#0A0A0A] mb-2">Your bag is empty</h2>
          <p className="font-body text-[14px] text-[#999] mb-8 max-w-xs">
            Looks like you haven't added anything to your bag yet.
          </p>
          <Link
            to="/shop"
            className="bg-[#0A0A0A] text-white font-body text-[13px] uppercase tracking-wider font-medium rounded hover:bg-[#333] transition-colors"
            style={{ padding: '14px 40px', borderRadius: 4 }}
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6" style={{ paddingTop: 40, paddingBottom: 40 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-[20px] text-[#0A0A0A] font-bold uppercase tracking-[0.04em]">
            My Bag <span className="font-body text-[14px] text-[#999] font-normal normal-case">({count} items)</span>
          </h1>
          <button onClick={clearCart} className="font-body text-[12px] text-[#999] hover:text-black transition-colors">
            Clear All
          </button>
        </div>

        {/* Layout: Left 65% + Right 35% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default memo(Cart);
