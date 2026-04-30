import React, { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Search, Heart, User } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

const TABS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: LayoutGrid, label: 'Categories', path: '/shop' },
  { icon: Search, label: 'Search', path: null, action: 'search' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const MobileNav = () => {
  const { toggleSearch } = useUiStore();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-[#E5E5E5] z-50 flex items-center justify-around px-2">
      {TABS.map(({ icon: Icon, label, path, action }) => {
        if (action === 'search') {
          return (
            <button
              key={label}
              onClick={toggleSearch}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 text-[#666] hover:text-black transition-colors duration-150"
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[10px] font-body tracking-wider">{label}</span>
            </button>
          );
        }

        return (
          <NavLink
            key={label}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors duration-150 ${
                isActive ? 'text-black' : 'text-[#666] hover:text-black'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-[10px] font-body tracking-wider">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default memo(MobileNav);
