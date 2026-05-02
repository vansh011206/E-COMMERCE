import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductStore } from '../../store/productStore';
import ProductCard from '../Product/ProductCard';

const TrendingNow = () => {
  const { allProducts } = useProductStore();
  const trending = allProducts.filter((p) => p.isTrending).slice(0, 10);

  if (trending.length === 0) return null;

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl text-[#0A0A0A] uppercase tracking-[0.06em] font-bold">
              Trending Now
            </h2>
            <div className="w-9 h-[2px] bg-black mt-2" />
          </div>
          <Link
            to="/shop?sort=popularity"
            className="font-body text-[13px] text-[#555] hover:text-[#0A0A0A] transition-colors duration-200"
          >
            View All →
          </Link>
        </div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.04 },
            },
          }}
        >
          {trending.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(TrendingNow);
