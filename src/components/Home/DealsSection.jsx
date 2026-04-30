import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductStore } from '../../store/productStore';
import ProductCard from '../Product/ProductCard';

const DealsSection = () => {
  const { allProducts } = useProductStore();
  const deals = allProducts
    .filter((p) => p.isBestSeller && p.discount >= 20)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4);

  // Countdown timer – 24h from page load
  const [timeLeft, setTimeLeft] = useState({ h: 6, m: 24, s: 38 });

  useEffect(() => {
    const end = Date.now() + 6 * 3600 * 1000 + 24 * 60 * 1000 + 38 * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  if (deals.length === 0) return null;

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading text-2xl text-[#0A0A0A] uppercase tracking-[0.06em] font-bold">
              Deals of the Day
            </h2>
            <div className="w-9 h-[2px] bg-black mt-2" />
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="font-body text-[11px] uppercase tracking-wider text-[#999] mr-2">Ends in</span>
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((val, i) => (
              <React.Fragment key={i}>
                <div className="w-11 h-11 bg-[#F2F2F0] rounded-lg flex items-center justify-center">
                  <span className="font-mono text-lg font-bold text-[#0A0A0A]">{val}</span>
                </div>
                {i < 2 && <span className="font-mono text-lg text-[#999]">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
        >
          {deals.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <ProductCard product={product} showDealBadge />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(DealsSection);
