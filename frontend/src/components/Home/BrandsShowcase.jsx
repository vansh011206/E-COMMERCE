import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const brands = [
  { name: 'ZARA', tagline: 'New Collection Weekly' },
  { name: 'H&M', tagline: 'Affordable Basics' },
  { name: "LEVI'S", tagline: 'Since 1853' },
  { name: 'NIKE', tagline: 'Just Do It' },
  { name: 'ADIDAS', tagline: 'Originals' },
  { name: 'PUMA', tagline: 'Forever Faster' },
  { name: 'JACK & JONES', tagline: "Men's Fashion" },
  { name: 'ONLY', tagline: "Women's Style" },
  { name: 'FABINDIA', tagline: 'Indian Heritage' },
  { name: 'VERO MODA', tagline: 'Contemporary' },
];

const categories = [
  { img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', label: 'T-Shirts', count: '124+ items', route: '/shop?category=Men&subCategory=T-Shirts' },
  { img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', label: 'Jeans', count: '98+ items', route: '/shop?category=Men&subCategory=Jeans' },
  { img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', label: 'Shirts', count: '86+ items', route: '/shop?category=Men&subCategory=Shirts' },
  { img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80', label: 'Shorts', count: '64+ items', route: '/shop?category=Men&subCategory=Shorts' },
  { img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80', label: 'Trousers', count: '72+ items', route: '/shop?category=Men&subCategory=Trousers' },
  { img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', label: 'Jackets', count: '54+ items', route: '/shop?category=Men&subCategory=Jackets' },
  { img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', label: 'Dresses', count: '142+ items', route: '/shop?category=Women&subCategory=Dresses' },
  { img: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80', label: 'Tops', count: '118+ items', route: '/shop?category=Women&subCategory=Tops' },
  { img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80', label: 'Ethnic Wear', count: '96+ items', route: '/shop?category=Women&subCategory=Ethnic' },
  { img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80', label: 'Footwear', count: '88+ items', route: '/shop?type=Footwear' },
  { img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80', label: 'Accessories', count: '76+ items', route: '/shop?type=Accessories' },
  { img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80', label: 'Activewear', count: '58+ items', route: '/shop?subCategory=Activewear' },
];

const pills = [
  { label: 'Innerwear', icon: 'https://images.pexels.com/photos/9221906/pexels-photo-9221906.jpeg?auto=compress&cs=tinysrgb&h=100', route: '/shop?subCategory=Innerwear' },
  { label: 'Socks', icon: 'https://images.pexels.com/photos/31450721/pexels-photo-31450721.jpeg?auto=compress&cs=tinysrgb&h=100', route: '/shop?subCategory=Socks' },
  { label: 'Gym Wear', icon: 'https://images.pexels.com/photos/32498592/pexels-photo-32498592.jpeg?auto=compress&cs=tinysrgb&h=100', route: '/shop?subCategory=Activewear' },
  { label: 'Sandals', icon: 'https://images.pexels.com/photos/34969443/pexels-photo-34969443.jpeg?auto=compress&cs=tinysrgb&h=100', route: '/shop?subCategory=Sandals' },
  { label: 'Formals', icon: 'https://images.pexels.com/photos/1453008/pexels-photo-1453008.jpeg?auto=compress&cs=tinysrgb&h=100', route: '/shop?occasion=Formal' },
  { label: 'Co-ords', icon: 'https://images.pexels.com/photos/28719728/pexels-photo-28719728.jpeg?auto=compress&cs=tinysrgb&h=100', route: '/shop?subCategory=Co-ord Sets' },
  { label: 'Scarves & More', icon: 'https://images.pexels.com/photos/31450715/pexels-photo-31450715.jpeg?auto=compress&cs=tinysrgb&h=100', route: '/shop?subCategory=Accessories' },
  { label: 'Sneakers', icon: 'https://images.pexels.com/photos/28651554/pexels-photo-28651554.jpeg?auto=compress&cs=tinysrgb&h=100', route: '/shop?subCategory=Sneakers' },
];

const BrandsShowcase = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brand) => {
    navigate(`/shop?brand=${encodeURIComponent(brand)}`);
  };

  const handleCategoryClick = (route) => {
    navigate(route);
  };

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };
  const categoryContainerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };
  const categoryItemVars = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <section className="bg-[#F8F8F6] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* --- PART A: BRANDS ROW --- */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="font-heading text-[24px] text-[#0A0A0A] font-bold uppercase tracking-[0.06em]">
              Shop By Brand
            </h2>
            <div className="h-[2px] w-[36px] bg-gradient-to-r from-pink-500 to-purple-500 mt-2"></div>
          </div>
          <button 
            onClick={() => navigate('/shop')} 
            className="font-body text-[13px] text-[#555] hover:text-[#0A0A0A] transition-colors"
          >
            View All Brands &rarr;
          </button>
        </motion.div>

        {/* Brands Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-12"
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {brands.map((brand, idx) => (
            <motion.div
              key={idx}
              variants={itemVars}
              onClick={() => handleBrandClick(brand.name)}
              className="bg-white border border-[#E8E8E8] rounded-lg h-[72px] flex flex-col justify-center items-center cursor-pointer hover:border-[#0A0A0A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200"
            >
              <span className="font-heading text-[16px] text-[#0A0A0A] font-bold uppercase tracking-[0.08em]">
                {brand.name}
              </span>
              <span className="font-body text-[10px] text-[#999] uppercase tracking-wider mt-0.5">
                {brand.tagline}
              </span>
            </motion.div>
          ))}
        </motion.div>


        {/* --- PART B: QUICK SHOP CATEGORIES --- */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-8 mt-12"
        >
          <h2 className="font-heading text-[22px] text-[#0A0A0A] font-bold uppercase tracking-wider">
            Quick Shop
          </h2>
          <p className="font-body text-[14px] text-[#999] mt-1">Browse by category</p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-5 mb-10"
          variants={categoryContainerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              variants={categoryItemVars}
              onClick={() => handleCategoryClick(cat.route)}
              className="group bg-white border border-[#E8E8E8] rounded-[10px] overflow-hidden cursor-pointer hover:border-[#CCCCCC] hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-all duration-200"
            >
              <div className="aspect-square overflow-hidden bg-[#F2F2F0]">
                <img 
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>
              <div className="py-3 px-2 flex flex-col items-center justify-center bg-white">
                <span className="font-body text-[13px] text-[#0A0A0A] font-medium text-center">
                  {cat.label}
                </span>
                <span className="font-body text-[11px] text-[#999] text-center mt-0.5">
                  {cat.count}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>


        {/* --- PART C: ALSO EXPLORE --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h3 className="font-body text-[13px] text-[#999] uppercase tracking-[0.1em] font-medium mb-4">
            Also Explore
          </h3>
          
          <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {pills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(pill.route)}
                className="flex items-center gap-2.5 h-[48px] px-5 bg-white border border-[#E8E8E8] rounded-full whitespace-nowrap hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] transition-colors duration-200 group flex-shrink-0"
              >
                {pill.icon === 'color' ? (
                  <div className="w-7 h-7 rounded-full bg-[#F0F0F0] shrink-0" />
                ) : (
                  <img 
                    src={pill.icon}
                    alt={pill.label}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                    loading="lazy"
                  />
                )}
                <span className="font-body text-[13px] font-medium">{pill.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BrandsShowcase;
