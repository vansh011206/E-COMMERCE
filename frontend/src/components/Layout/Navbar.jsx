import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, LogOut, Package } from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';

// ─── Mega Menu Data ─────────────────────────────────────────────────────────
const MEGA_MENU = {
  Men: {
    Topwear: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Jackets', 'Hoodies', 'Sweatshirts', 'Ethnic Wear'],
    Bottomwear: ['Jeans', 'Chinos', 'Formal Trousers', 'Cargo Pants', 'Shorts'],
    Footwear: ['Sneakers', 'Loafers', 'Boots', 'Formal Shoes', 'Sandals'],
    Accessories: ['Watches', 'Belts', 'Wallets', 'Sunglasses', 'Caps', 'Bags'],
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80',
  },
  Women: {
    Topwear: ['Dresses', 'Tops & Blouses', 'Crop Tops', 'Co-ord Sets', 'Ethnic Kurtas', 'Blazers'],
    Bottomwear: ['Jeans', 'Skirts', 'Trousers', 'Leggings', 'Palazzos'],
    Footwear: ['Heels', 'Flats', 'Sneakers', 'Boots', 'Sandals'],
    Accessories: ['Bags', 'Jewelry', 'Scarves', 'Sunglasses', 'Watches'],
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80',
  },
  Kids: {
    Boys: ['T-Shirts', 'Shirts', 'Jeans', 'Shorts', 'Ethnic Wear', 'Shoes'],
    Girls: ['Dresses', 'Tops', 'Leggings', 'Skirts', 'Ethnic Wear', 'Shoes'],
    Infants: ['Onesies', 'Sets', 'Rompers', 'Booties'],
    Accessories: ['School Bags', 'Socks', 'Caps', 'Belts'],
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&q=80',
  },
};

const NAV_LINKS = ['Men', 'Women', 'Kids', 'Studio'];

// ─── Cart Badge ─────────────────────────────────────────────────────────────
const CartBadge = memo(() => {
  const count = useCartStore((s) => s.getCount());
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white bg-black leading-none">
      {count > 99 ? '99+' : count}
    </span>
  );
});

// ─── Wishlist Badge ──────────────────────────────────────────────────────────
const WishlistBadge = memo(() => {
  const count = useAuthStore((s) => s.wishlist?.length || 0);
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white bg-black leading-none">
      {count}
    </span>
  );
});

// ─── Profile Dropdown ────────────────────────────────────────────────────────
const ProfileDropdown = memo(({ isOpen }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-[#E5E5E5] rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
      {isAuthenticated ? (
        <>
          <div className="px-4 py-3 border-b border-[#E5E5E5]">
            <p className="text-[11px] text-[#666] font-body uppercase tracking-widest">Welcome</p>
            <p className="text-black font-heading text-sm font-semibold mt-0.5 truncate">{user?.name}</p>
          </div>
          <div className="py-1">
            {[
              { icon: User, label: 'My Profile', path: '/profile' },
              { icon: Package, label: 'My Orders', path: '/orders' },
              { icon: Heart, label: 'Wishlist', path: '/wishlist' },
            ].map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[#666] hover:text-black hover:bg-black/5 transition-colors duration-200 font-body text-sm"
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
            <div className="border-t border-[#E5E5E5] mt-1 pt-1">
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[#FF4757] hover:bg-[#FF4757]/10 transition-colors duration-200 font-body text-sm"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="px-4 py-3 border-b border-[#E5E5E5]">
            <p className="text-black font-heading text-sm font-semibold">Welcome</p>
            <p className="text-[#666] text-[11px] font-body mt-0.5">Sign in for the best experience</p>
          </div>
          <div className="p-3 flex flex-col gap-2">
            <Link
              to="/login"
              className="w-full text-center py-2 text-sm font-body font-medium text-white bg-black rounded-md hover:bg-[#333] transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="w-full text-center py-2 text-sm font-body font-medium text-[#666] border border-[#CCC] rounded-md hover:text-black hover:border-[#999] transition-colors duration-200"
            >
              Create Account
            </Link>
          </div>
        </>
      )}
    </div>
  );
});

// ─── Mega Dropdown ───────────────────────────────────────────────────────────
const MegaDropdown = memo(({ category, isOpen }) => {
  const data = MEGA_MENU[category];
  if (!data || !isOpen) return null;

  const columns = Object.entries(data).filter(([key]) => key !== 'image');

  return (
    <div
      className={`absolute left-0 right-0 top-full bg-white border-t border-[#E5E5E5] shadow-2xl z-40 transition-all duration-200 ease-out ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-8 grid gap-8" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 200px` }}>
        {columns.map(([heading, links]) => (
          <div key={heading}>
            <h4 className="font-heading text-[11px] uppercase text-accent-primary tracking-[0.2em] mb-4 font-semibold">
              {heading}
            </h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    to={`/shop?category=${category}&type=${link}`}
                    className="font-body text-[13px] text-[#666] hover:text-black transition-all duration-200 block hover:pl-1"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Featured image column */}
        <div className="relative overflow-hidden rounded-lg group">
          <img
            src={data.image}
            alt={category}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            style={{ height: '220px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-heading text-xs uppercase tracking-widest">{category}</p>
            <p className="text-accent-primary text-[10px] font-body mt-0.5">New Arrivals →</p>
          </div>
        </div>
      </div>
    </div>
  );
});

// ─── Main Navbar ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollDirection = useScrollDirection();
  const { toggleSearch } = useUiStore();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const dropdownTimer = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setActiveDropdown(null);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = useCallback((link) => {
    clearTimeout(dropdownTimer.current);
    if (MEGA_MENU[link]) setActiveDropdown(link);
  }, []);

  const handleMouseLeave = useCallback(() => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  }, []);

  const handleDropdownMouseEnter = useCallback(() => {
    clearTimeout(dropdownTimer.current);
  }, []);

  const isNavbarHidden = scrollDirection === 'down' && !isAtTop;

  return (
    <header className="sticky top-0 z-50 flex flex-col w-full shadow-sm">
      {/* ── Announcement Strip ── */}
      <div className="relative h-[30px] bg-black overflow-hidden z-50">
        <div className="announcement-ticker flex items-center h-full whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-6 text-white text-[11px] font-body px-8">
              <span>FLAT 50% OFF on First Order — Use Code: <strong>FIRST50</strong></span>
              <span className="opacity-40">•</span>
              <span>Free Shipping Above ₹999</span>
              <span className="opacity-40">•</span>
              <span>Easy 30-Day Returns</span>
              <span className="opacity-40">•</span>
              <span>New Arrivals Every Week</span>
              <span className="opacity-40">•</span>
            </span>
          ))}
        </div>
      </div>

      <nav
        className="bg-white border-b border-[#E5E5E5] h-16 transition-all duration-300 relative z-40"
      >
        <div className="max-w-[1400px] mx-auto h-full px-6 lg:px-10 flex items-center justify-between gap-6">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="font-heading font-bold text-xl uppercase tracking-[0.15em] text-black hover:text-[#333] transition-colors duration-300 flex-shrink-0 group"
          >
            <span className="transition-all duration-300">
              VOGUE VAULT
            </span>
          </Link>

          {/* ── Center Nav Links ── */}
          <div
            className="hidden md:flex items-center gap-7"
            onMouseLeave={handleMouseLeave}
          >
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname.includes(link.toLowerCase());
              const hasMega = Boolean(MEGA_MENU[link]);
              return (
                <div
                  key={link}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => handleMouseEnter(link)}
                >
                  <Link
                    to={link === 'Studio' ? '/studio' : `/shop?category=${link}`}
                    className={`font-heading text-[13px] uppercase tracking-[0.1em] font-medium flex items-center gap-0.5 transition-colors duration-200 pb-0.5 ${
                      isActive ? 'text-black' : 'text-[#666] hover:text-black'
                    }`}
                  >
                    {link}
                    {hasMega && (
                      <ChevronDown
                        size={11}
                        className={`transition-transform duration-200 ${activeDropdown === link ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>
                  {/* Active dot */}
                  {isActive && (
                    <span className="absolute -bottom-[1px] w-1 h-1 rounded-full bg-accent-primary" />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Right Icons ── */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              onClick={toggleSearch}
              className="text-[#666] hover:text-black transition-colors duration-200 hidden md:flex"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-[#666] hover:text-black transition-colors duration-200 relative hidden md:flex"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
              <WishlistBadge />
            </Link>

            {/* Profile */}
            <div className="relative hidden md:flex" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="text-[#666] hover:text-black transition-colors duration-200 flex items-center gap-1"
                aria-label="Profile"
              >
                <User size={20} strokeWidth={1.5} />
              </button>
              <ProfileDropdown isOpen={profileOpen} />
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="text-[#666] hover:text-black transition-colors duration-200 relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <CartBadge />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => useUiStore.getState().toggleMobileMenu()}
              className="text-[#666] hover:text-black transition-colors duration-200 md:hidden ml-1"
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ── Mega Dropdown Container (full-width) ── */}
        {NAV_LINKS.filter((l) => MEGA_MENU[l]).map((link) => (
          <div
            key={link}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <MegaDropdown category={link} isOpen={activeDropdown === link} />
          </div>
        ))}
      </nav>
    </header>
  );
};

export default memo(Navbar);
