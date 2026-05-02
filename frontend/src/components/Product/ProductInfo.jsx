import React, { useState, memo } from 'react';
import { Star, ShoppingBag, Heart, MapPin, Truck, RotateCcw, ShieldCheck, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import SizeSelector from './SizeSelector';

const ProductInfo = ({ product }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buttonState, setButtonState] = useState('idle'); // idle, loading, success
  const [sizeErrorShake, setSizeErrorShake] = useState(0); // Trigger for size selector
  const [pincode, setPincode] = useState('');

  const isOutOfStock = product.stock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Please select a size');
      setSizeErrorShake((v) => v + 1); // Trigger shake
      return;
    }
    
    setButtonState('loading');
    setTimeout(() => {
      addToCart(product, selectedSize, selectedColor, quantity);
      setButtonState('success');
      toast.success('Added to bag!');
      setTimeout(() => setButtonState('idle'), 1500);
    }, 400);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code copied: ${code}`);
  };

  return (
    <div className="flex flex-col h-full sticky top-[80px]">
      {/* 1. Brand + Name */}
      <div className="mb-3">
        <Link to={`/shop?brand=${product.brand}`} className="font-heading text-[13px] uppercase tracking-[0.06em] text-[#999] hover:text-[#0A0A0A] transition-colors">
          {product.brand}
        </Link>
        <h1 className="font-body text-[22px] font-medium text-[#0A0A0A] leading-[1.3] mt-1">
          {product.name}
        </h1>
      </div>

      {/* 2. Rating */}
      {product.reviewCount > 0 && (
        <div className="flex items-center gap-3 mb-4 cursor-pointer group" onClick={() => document.getElementById('reviews-tab').scrollIntoView({behavior: 'smooth'})}>
          <div className="flex items-center gap-1 border border-[#E8E8E8] px-2 py-0.5 rounded-[4px] bg-white group-hover:border-[#CCC] transition-colors">
            <span className="font-mono text-[14px] font-semibold text-[#0A0A0A]">{product.rating}</span>
            <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
          </div>
          <span className="text-[#CCC]">|</span>
          <span className="font-body text-[13px] text-[#999] group-hover:text-[#555] group-hover:underline transition-all">
            {product.reviewCount.toLocaleString()} Ratings
          </span>
        </div>
      )}

      {/* 3. Price Section */}
      <div className="py-4 border-y border-[#F0F0F0] mb-6">
        <div className="flex items-baseline flex-wrap">
          <span className="font-mono text-[28px] font-bold text-[#0A0A0A] mr-2.5">
            {product.currency}{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <>
              <span className="font-mono text-[18px] text-[#BBB] line-through mr-2">
                MRP {product.currency}{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="font-body text-[15px] font-semibold text-[#FF3C78]">
                ({product.discount}% OFF)
              </span>
            </>
          )}
        </div>
        <p className="font-body text-[12px] text-[#999] mt-1">inclusive of all taxes</p>
      </div>

      {/* 4. Color Selection */}
      {product.colors?.length > 0 && (
        <div className="mb-2">
          <p className="font-heading text-[11px] uppercase tracking-[0.08em] text-[#0A0A0A] font-semibold mb-3">
            Color: <span className="text-[#555] font-normal">{selectedColor?.name}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 rounded-full transition-all duration-150 ${
                  selectedColor?.name === color.name ? 'scale-[1.15]' : 'hover:scale-110'
                }`}
                style={{
                  backgroundColor: color.hex,
                  boxShadow: selectedColor?.name === color.name 
                    ? '0 0 0 2px #0A0A0A, inset 0 0 0 1px rgba(0,0,0,0.1)' 
                    : 'inset 0 0 0 1px rgba(0,0,0,0.15)'
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Size Selection */}
      {product.sizes?.length > 0 && (
        <SizeSelector 
          key={sizeErrorShake} // Hack to trigger animation on prop change
          sizes={product.sizes} 
          sizesAvailable={product.sizesAvailable} 
          selectedSize={selectedSize} 
          onSelect={setSelectedSize} 
        />
      )}

      {/* 6. Actions */}
      <div className="flex flex-col gap-2.5 mb-8">
        <div className="flex gap-3 h-[52px]">
          {/* Quantity */}
          <div className="flex items-center border border-[#E8E8E8] rounded bg-white w-32 flex-shrink-0">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center text-[#999] hover:text-[#0A0A0A] hover:bg-[#F8F8F8] transition-colors"><Minus size={16} /></button>
            <span className="font-mono text-[14px] font-medium text-[#0A0A0A] w-8 text-center">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(5, quantity + 1))} className="flex-1 h-full flex items-center justify-center text-[#999] hover:text-[#0A0A0A] hover:bg-[#F8F8F8] transition-colors"><Plus size={16} /></button>
          </div>
          
          {/* Add to Bag */}
          <button
            disabled={isOutOfStock || buttonState === 'loading'}
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-2 font-heading text-[14px] uppercase tracking-[0.1em] font-semibold rounded transition-colors duration-200 ${
              isOutOfStock 
                ? 'bg-[#EFEFED] text-[#999] cursor-not-allowed'
                : buttonState === 'success'
                  ? 'bg-[#00D68F] text-white'
                  : 'bg-[#0A0A0A] text-white hover:bg-[#333]'
            }`}
          >
            {isOutOfStock ? (
              'Out of Stock'
            ) : buttonState === 'loading' ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : buttonState === 'success' ? (
              '✓ Added to Bag'
            ) : (
              <><ShoppingBag size={18} strokeWidth={1.5} /> Add to Bag</>
            )}
          </button>
        </div>
        
        {/* Wishlist */}
        <button
          onClick={() => toggle(product)}
          className={`h-[48px] w-full flex items-center justify-center gap-2 font-body text-[14px] uppercase tracking-[0.06em] font-medium border-[1.5px] rounded transition-all duration-200 ${
            wishlisted 
              ? 'border-black text-black bg-black/5' 
              : 'border-[#E8E8E8] text-[#555] bg-white hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
          }`}
        >
          <Heart size={18} strokeWidth={wishlisted ? 2 : 1.5} className={wishlisted ? 'fill-black' : ''} />
          {wishlisted ? 'Wishlisted' : 'Wishlist'}
        </button>
      </div>

      {/* 7. Delivery Info */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} className="text-[#999]" />
          <input 
            type="text" 
            placeholder="Enter pincode" 
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="flex-1 h-8 border-b border-[#E8E8E8] bg-transparent font-body text-[13px] outline-none focus:border-[#0A0A0A] transition-colors"
          />
          <button className="font-heading text-[12px] font-bold text-[#FF3C78] hover:text-[#D92C60]">CHECK</button>
        </div>
        
        <div className="grid grid-cols-3 border border-[#F0F0F0] rounded-lg bg-[#FAFAFA]">
          <div className="flex flex-col items-center justify-center p-3 text-center border-r border-[#F0F0F0]">
            <Truck size={20} className="text-[#555] mb-2" strokeWidth={1.5} />
            <span className="font-body text-[11px] text-[#555] leading-tight">Free Delivery<br/>above ₹999</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 text-center border-r border-[#F0F0F0]">
            <RotateCcw size={20} className="text-[#555] mb-2" strokeWidth={1.5} />
            <span className="font-body text-[11px] text-[#555] leading-tight">30 Days<br/>Easy Return</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 text-center">
            <ShieldCheck size={20} className="text-[#555] mb-2" strokeWidth={1.5} />
            <span className="font-body text-[11px] text-[#555] leading-tight">100%<br/>Genuine</span>
          </div>
        </div>
      </div>

      {/* 8. Best Offers */}
      <div className="mb-8">
        <h3 className="font-heading text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A] font-bold mb-3">Best Offers</h3>
        <div className="space-y-2">
          <div className="bg-[#FFF8F9] border-l-[3px] border-[#FF3C78] rounded-r-md p-3 flex items-start gap-2">
            <div className="flex-1">
              <span className="font-mono text-[13px] font-bold text-[#0A0A0A] bg-[#FFEBF0] px-1.5 py-[2px] rounded mr-2">FIRST50</span>
              <span className="font-body text-[12px] text-[#555]">Get flat 50% off on your first order.</span>
            </div>
            <button onClick={() => handleCopyCode('FIRST50')} className="font-heading text-[11px] text-[#FF3C78] font-bold whitespace-nowrap mt-1">TAP TO COPY</button>
          </div>
          <div className="bg-[#FFF8F9] border-l-[3px] border-[#FF3C78] rounded-r-md p-3 flex items-start gap-2">
            <div className="flex-1">
              <span className="font-mono text-[13px] font-bold text-[#0A0A0A] bg-[#FFEBF0] px-1.5 py-[2px] rounded mr-2">HDFC20</span>
              <span className="font-body text-[12px] text-[#555]">20% Instant Discount on HDFC Cards.</span>
            </div>
            <button onClick={() => handleCopyCode('HDFC20')} className="font-heading text-[11px] text-[#FF3C78] font-bold whitespace-nowrap mt-1">TAP TO COPY</button>
          </div>
        </div>
      </div>

      {/* 9. Product Details Brief */}
      <div>
        <h3 className="font-heading text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A] font-bold mb-3">Product Highlights</h3>
        <ul className="space-y-1.5">
          {product.description?.split('. ').slice(0, 4).map((str, i) => str && (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#0A0A0A] mt-[8px] flex-shrink-0" />
              <span className="font-body text-[13px] text-[#555] leading-relaxed">{str.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(ProductInfo);
