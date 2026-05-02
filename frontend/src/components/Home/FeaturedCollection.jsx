import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const COLLECTIONS = [
  {
    label: 'NEW ARRIVALS',
    name: 'Summer Essentials',
    link: '/shop?category=Men&subCategory=T-Shirts',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
  },
  {
    label: 'TRENDING',
    name: 'Street Style Edit',
    link: '/shop?tags=streetwear',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  },
  {
    label: 'FESTIVE EDIT',
    name: 'Festive Collection',
    link: '/shop?category=Women&subCategory=Ethnic',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80',
  },
  {
    label: 'FOOTWEAR',
    name: 'Sneaker Culture',
    link: '/shop?type=Footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    wide: true,
  },
  {
    label: 'WORKWEAR',
    name: 'Workwear Edit',
    link: '/shop?occasion=Formal',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
];

const CollectionCard = ({ label, name, link, image, wide = false }) => (
  <Link to={link} className="group relative block overflow-hidden rounded-lg">
    <div className={`relative w-full ${wide ? 'aspect-video' : 'aspect-[4/5]'} overflow-hidden`}>
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
    </div>
    <div className="absolute bottom-0 left-0 p-5 md:p-6">
      <p className="font-body text-[10px] uppercase tracking-[0.12em] text-white/70 mb-1">{label}</p>
      <h3 className={`font-heading font-bold text-white leading-tight mb-2 ${wide ? 'text-2xl md:text-[28px]' : 'text-xl md:text-[22px]'}`}>
        {name}
      </h3>
      <span className="font-body text-[11px] uppercase tracking-[0.1em] text-white/80 group-hover:text-white group-hover:tracking-[0.15em] transition-all duration-300">
        Shop Now →
      </span>
    </div>
  </Link>
);

const FeaturedCollection = () => {
  return (
    <section className="bg-[#F8F8F6] py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-2xl text-[#0A0A0A] uppercase tracking-[0.06em] font-bold">
            Featured Collections
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {COLLECTIONS.slice(0, 3).map((c) => (
            <motion.div
              key={c.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <CollectionCard {...c} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
          }}
        >
          <motion.div
            className="md:col-span-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <CollectionCard {...COLLECTIONS[3]} />
          </motion.div>
          <motion.div
            className="md:col-span-2"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <CollectionCard {...COLLECTIONS[4]} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(FeaturedCollection);
