import React, { memo } from 'react';

const BRANDS = [
  'Zara', 'H&M', 'Nike', 'Adidas', "Levi's", 'Puma', 'Jack & Jones',
  'ONLY', 'Vero Moda', 'FabIndia', 'W', 'Allen Solly', 'Van Heusen',
  'Fossil', 'Biba', 'Mango', 'Forever 21', 'Pull & Bear', 'Stradivarius', 'Massimo Dutti',
];

const BrandsMarquee = () => {
  const renderBrands = () =>
    BRANDS.map((brand, i) => (
      <span key={`${brand}-${i}`} className="inline-flex items-center gap-12 flex-shrink-0 px-6">
        <span className="font-heading text-3xl lg:text-4xl font-bold text-[#CCC] uppercase tracking-[0.05em] whitespace-nowrap hover:text-[#0A0A0A] transition-colors duration-300 cursor-default select-none">
          {brand}
        </span>
        <span className="text-[#E8E8E8] text-2xl select-none">·</span>
      </span>
    ));

  return (
    <section className="bg-[#F8F8F6] py-16 border-t border-b border-[#E8E8E8] overflow-hidden">
      <div className="text-center mb-10">
        <h3 className="font-heading text-[14px] uppercase text-[#999] tracking-[0.15em] font-medium">
          Brands We Carry
        </h3>
      </div>

      <div className="relative overflow-hidden">
        <div className="marquee-track flex items-center">
          {renderBrands()}
          {renderBrands()}
        </div>
      </div>
    </section>
  );
};

export default memo(BrandsMarquee);
