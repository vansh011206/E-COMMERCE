import React, { useState, useEffect, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductGallery from '../components/Product/ProductGallery';
import ProductInfo from '../components/Product/ProductInfo';
import ReviewSection from '../components/Product/ReviewSection';
import SimilarProducts from '../components/Product/SimilarProducts';
import Footer from '../components/Layout/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, getRelated, getRecentlyViewed, addToViewHistory } = useProductStore();

  const product = getProduct(id);
  const related = getRelated(id);
  const recentlyViewed = getRecentlyViewed().filter(p => p.id !== id);

  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id && product) {
      addToViewHistory(id);
      window.scrollTo(0, 0);
    } else if (!product) {
      // Redirect or show not found logic could go here
    }
  }, [id, product, addToViewHistory]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-heading text-2xl text-[#0A0A0A] mb-2">Product Not Found</h2>
        <p className="font-body text-[#999] mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/shop" className="bg-black text-white px-6 py-2.5 font-body text-sm">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* ── Breadcrumb ── */}
        <div className="py-4 font-body text-[12px] text-[#999] flex items-center gap-1.5 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-[#555] transition-colors">Home</Link>
          <ChevronRight size={12} className="flex-shrink-0" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#555] transition-colors">{product.category}</Link>
          <ChevronRight size={12} className="flex-shrink-0" />
          <Link to={`/shop?subCategory=${product.subCategory}`} className="hover:text-[#555] transition-colors">{product.subCategory}</Link>
          <ChevronRight size={12} className="flex-shrink-0" />
          <span className="text-[#0A0A0A] font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* ── Main Content (Gallery + Info) ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-16 pt-2">
          {/* Left: Gallery (55%) */}
          <div className="w-full lg:w-[55%]">
            <ProductGallery images={product.images || []} name={product.name} />
          </div>

          {/* Right: Info (45%) */}
          <div className="w-full lg:w-[45%]">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="max-w-4xl mx-auto pb-16">
          <div className="sticky top-[64px] z-30 bg-white border-b border-[#E8E8E8] flex overflow-x-auto hide-scrollbar">
            {[
              { id: 'details', label: 'Product Details' },
              { id: 'size', label: 'Size & Fit' },
              { id: 'reviews', label: `Reviews (${product.reviewCount || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                id={tab.id === 'reviews' ? 'reviews-tab' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-4 text-center font-heading text-[13px] uppercase tracking-[0.06em] font-medium transition-colors relative ${
                  activeTab === tab.id ? 'text-[#0A0A0A]' : 'text-[#999] hover:text-[#555]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0A0A0A]" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-8 px-4 md:px-0">
            {/* Tab: Details */}
            {activeTab === 'details' && (
              <div className="animate-fadeIn">
                <p className="font-body text-[14px] text-[#555] leading-relaxed mb-8">
                  {product.description}
                </p>
                {product.specifications && (
                  <div className="border border-[#E8E8E8] rounded-md overflow-hidden">
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <div key={key} className={`flex px-4 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F6]'}`}>
                        <span className="w-1/2 font-body text-[13px] text-[#999]">{key}</span>
                        <span className="w-1/2 font-body text-[13px] text-[#0A0A0A] font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Size & Fit */}
            {activeTab === 'size' && (
              <div className="animate-fadeIn">
                <p className="font-body text-[14px] text-[#333] mb-6">The model (height 6'1") is wearing a size M.</p>
                <div className="border border-[#E8E8E8] rounded-md overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead className="bg-[#F8F8F6]">
                      <tr>
                        <th className="py-3 px-4 font-body text-[12px] text-[#999] font-medium border-b border-[#E8E8E8]">Size</th>
                        <th className="py-3 px-4 font-body text-[12px] text-[#999] font-medium border-b border-[#E8E8E8]">Chest (in)</th>
                        <th className="py-3 px-4 font-body text-[12px] text-[#999] font-medium border-b border-[#E8E8E8]">Front Length (in)</th>
                        <th className="py-3 px-4 font-body text-[12px] text-[#999] font-medium border-b border-[#E8E8E8]">Across Shoulder (in)</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[13px] text-[#333]">
                      <tr className="border-b border-[#F0F0F0]"><td className="py-3 px-4 font-bold text-black">S</td><td className="py-3 px-4">38</td><td className="py-3 px-4">27</td><td className="py-3 px-4">16</td></tr>
                      <tr className="border-b border-[#F0F0F0]"><td className="py-3 px-4 font-bold text-black">M</td><td className="py-3 px-4">40</td><td className="py-3 px-4">28</td><td className="py-3 px-4">17</td></tr>
                      <tr className="border-b border-[#F0F0F0]"><td className="py-3 px-4 font-bold text-black">L</td><td className="py-3 px-4">42</td><td className="py-3 px-4">29</td><td className="py-3 px-4">18</td></tr>
                      <tr><td className="py-3 px-4 font-bold text-black">XL</td><td className="py-3 px-4">44</td><td className="py-3 px-4">30</td><td className="py-3 px-4">19</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="animate-fadeIn">
                <ReviewSection product={product} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Product Carousels ── */}
      <SimilarProducts products={related} title="Similar Products" />
      <SimilarProducts products={recentlyViewed} title="Recently Viewed" />

      {/* ── Mobile Bottom Sticky Action Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E8E8E8] z-50 flex">
        <button 
          onClick={() => {
            const el = document.querySelector('.sticky.top-\\[80px\\]');
            if(el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 bg-white text-[#555] font-heading text-[13px] uppercase tracking-wider font-semibold border-r border-[#E8E8E8] flex items-center justify-center hover:bg-[#F8F8F6] transition-colors"
        >
          Wishlist
        </button>
        <button 
          onClick={() => {
            const el = document.querySelector('.sticky.top-\\[80px\\]');
            if(el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 bg-[#0A0A0A] text-white font-heading text-[13px] uppercase tracking-wider font-semibold flex items-center justify-center hover:bg-[#333] transition-colors"
        >
          Add to Bag
        </button>
      </div>

      {/* Padding for mobile sticky bar */}
      <div className="md:hidden h-16" />

      <Footer />
    </div>
  );
};

export default memo(ProductDetail);
