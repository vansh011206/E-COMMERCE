import React, { memo } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/Home/HeroSection';
import CategoryStrip from '../components/Home/CategoryStrip';
import TrendingNow from '../components/Home/TrendingNow';
import FeaturedCollection from '../components/Home/FeaturedCollection';
import BrandsShowcase from '../components/Home/BrandsShowcase';
import DealsSection from '../components/Home/DealsSection';
import BrandsMarquee from '../components/Home/BrandsMarquee';
import Newsletter from '../components/Home/Newsletter';
import Footer from '../components/Layout/Footer';
import ProductCard from '../components/Product/ProductCard';
import { useProductStore } from '../store/productStore';

const PickedForYou = memo(() => {
  const { getRecommended, viewHistory } = useProductStore();
  const recommended = getRecommended();

  if (!recommended || recommended.length === 0) return null;

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl text-[#0A0A0A] uppercase tracking-[0.06em] font-bold">
              Picked For You
            </h2>
            <div className="w-9 h-[2px] bg-black mt-2" />
          </div>
        </div>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
          }}
        >
          {recommended.map((product) => (
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
});

const Home = () => {
  return (
    <>
      <HeroSection />
      <div className="relative z-30">
        <CategoryStrip />
        <TrendingNow />
      </div>
      <BrandsShowcase />
      <BrandsMarquee />
      <FeaturedCollection />
      <DealsSection />
      <PickedForYou />
      <Newsletter />
      <Footer />
    </>
  );
};

export default memo(Home);
